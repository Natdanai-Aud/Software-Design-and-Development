#!/usr/bin/env node
/**
 * scripts/extract-pdf-remediations.js
 *
 * Extracts completed-remediation records from the Bangkok "risk_point" dataset's
 * monthly report PDFs ("จุดเสี่ยงที่ดำเนินการแล้วเดือน...") on data.bangkok.go.th.
 *
 * These PDFs' text layer uses a broken font encoding (confirmed with both
 * pdfplumber and pdftotext — every character comes out mapped to the wrong
 * Thai codepoint), so we render each page to an image and OCR it instead.
 *
 * IMPORTANT: the "จุดที่ N" number printed in these reports is NOT the same
 * numbering as RiskPoint.clusterRank from the Google My Maps KML (it goes
 * above 100, the KML only has 100 points). Do not join on that number.
 * Each point's page instead prints its lat/lng ("พิกัด : lat, lng"), which
 * this script extracts so the NestJS side can join by nearest coordinate
 * (see src/common/remediation-pdf-matcher.ts).
 *
 * A point whose green status banner does NOT contain a Thai month + year
 * (e.g. "ขอปรับลดจุดเสี่ยง (ประสานหน่วยงานภายนอก)" — requested for removal
 * from the risk-point list, seen on จุดที่ 67 in the Sept 2566 report) is
 * skipped on purpose: it was never actually completed, so it should not be
 * seeded with a fabricated date.
 *
 * Requires on PATH: pdftoppm (poppler-utils), tesseract (with the `tha`
 * traineddata installed), python3 with Pillow + numpy (used for green-banner
 * detection and grayscale thresholding — see below on why that matters).
 *
 * Usage:
 *   TESSDATA_PREFIX=/path/to/tessdata \
 *     node scripts/extract-pdf-remediations.js <dir-with-monthly-pdfs> \
 *     > src/data/remediation-pdf-details.ts
 *
 * Put all the monthly PDFs downloaded from
 * https://data.bangkok.go.th/dataset/risk_point in <dir-with-monthly-pdfs>.
 * When the same coordinates appear in more than one monthly report, the
 * entry with the later completedAt wins.
 *
 * WHY THE TWO-PASS + THRESHOLD APPROACH:
 * Some of these reports render the "จุดที่ N" title in a colored banner
 * (not white background) — full-page OCR at default settings misses it
 * entirely on those pages. Cropping to just the top ~10% and converting to
 * pure black/white (threshold ~120 on the grayscale value) before OCR fixes
 * this reliably across both banner-color variants seen in these files
 * ((146,208,80) and (112,173,71) — both "green, accent 6" theme shades).
 * Full-page OCR (psm 3) is still used separately for the body text
 * (responsibleAgency / note), since that reliably skips the noisy embedded
 * photos that break OCR when the title crop is attempted at full-page scale.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const GREEN_BANNER_RGBS = [
  [146, 208, 80],
  [112, 173, 71],
];
const GREEN_TOLERANCE = 20;

const THAI_MONTHS = {
  'มกราคม': 1, 'กุมภาพันธ์': 2, 'มีนาคม': 3, 'เมษายน': 4,
  'พฤษภาคม': 5, 'มิถุนายน': 6, 'กรกฎาคม': 7, 'สิงหาคม': 8,
  'กันยายน': 9, 'ตุลาคม': 10, 'พฤศจิกายน': 11, 'ธันวาคม': 12,
};

const STOP_LABELS = [
  'เขต :', 'เขต:', 'หน่วยงานที่เกี่ยวข้อง', 'สาเหตุการเกิดอุบัติเหตุ',
  'แนวทางการแก้ไข', 'อุปกรณ์ที่ติดตั้ง', 'Action Plan',
  'ดําเนินการแล้วเสร็จ', 'ดำเนินการแล้วเสร็จ', 'การดําเนินการ', 'การดำเนินการ',
  'ภาพก่อน', 'ภาพก่อน - หลัง',
];

function ocr(pngPath, psm) {
  return execFileSync(
    'tesseract',
    [pngPath, 'stdout', '-l', 'tha', '--psm', String(psm)],
    { encoding: 'utf8', maxBuffer: 1024 * 1024 * 32 },
  );
}

function thaiRatio(line) {
  const chars = [...line.trim()];
  if (chars.length === 0) return 0;
  const thai = chars.filter((c) => /[\u0E01-\u0E5B]/.test(c)).length;
  return thai / chars.length;
}

function captureBlock(lines, startIndex) {
  const out = [];
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) break;
    if (thaiRatio(line) < 0.35) break;
    if (STOP_LABELS.some((s) => line.includes(s))) break;
    out.push(line);
  }
  return out.join(' ').replace(/\s+/g, ' ').trim();
}

function extractLabeledField(text, label) {
  const lines = text.split('\n');
  const idx = lines.findIndex((l) => l.includes(label));
  if (idx === -1) return undefined;
  const afterLabel = (lines[idx].split(label)[1] || '').trim();
  const rest = captureBlock(lines, idx + 1);
  const value = `${afterLabel} ${rest}`.replace(/\s+/g, ' ').trim().replace(/^:\s*/, '');
  return value || undefined;
}

// Crop the top band of the page and binarize it (grayscale threshold).
// Binarizing matters: several reports render the title in a colored banner,
// and tesseract's default handling of colored backgrounds is unreliable.
function cropTopThresholded(pngPath, outPath, frac) {
  execFileSync('python3', ['-c', `
from PIL import Image
import numpy as np
img = Image.open("${pngPath}")
w, h = img.size
crop = img.crop((0, 0, w, int(h * ${frac}))).convert('L')
arr = np.array(crop)
bw = np.where(arr < 120, 0, 255).astype('uint8')
Image.fromarray(bw).save("${outPath}")
`]);
}

function findGreenBandY(pngPath) {
  const targets = GREEN_BANNER_RGBS.map((c) => `(${c.join(',')})`).join(',');
  const out = execFileSync('python3', ['-c', `
from PIL import Image
img = Image.open("${pngPath}").convert("RGB")
w, h = img.size
targets = [${targets}]
tol = ${GREEN_TOLERANCE}
def close(px):
    for t in targets:
        if all(abs(px[i]-t[i]) <= tol for i in range(3)):
            return True
    return False
rows = []
x = int(w*0.2)
for y in range(h):
    if close(img.getpixel((x,y))):
        rows.append(y)
print(f"{min(rows)},{max(rows)}" if rows else "")
`], { encoding: 'utf8' }).trim();
  return out ? out.split(',').map(Number) : null;
}

function cropBannerThresholded(pngPath, outPath, [y0, y1]) {
  const pad = 10;
  execFileSync('python3', ['-c', `
from PIL import Image
import numpy as np
img = Image.open("${pngPath}")
w, h = img.size
crop = img.crop((0, max(0, ${y0} - ${pad}), w, min(h, ${y1} + ${pad}))).convert('L')
arr = np.array(crop)
bw = np.where(arr < 120, 0, 255).astype('uint8')
Image.fromarray(bw).save("${outPath}")
`]);
}

// Returns undefined for a non-date status (e.g. "ขอปรับลดจุดเสี่ยง" — the
// point was requested for removal, not completed). That is intentional:
// such a point is then dropped by the final .filter(e => e.completedAt).
function parseCompletedDate(bannerText) {
  const monthPattern = Object.keys(THAI_MONTHS).join('|');
  const re = new RegExp(`(${monthPattern})[^0-9]{0,10}(\\d{4})`);
  const m = bannerText.match(re);
  if (!m) return undefined;
  const month = THAI_MONTHS[m[1]];
  const gregorianYear = Number(m[2]) - 543;
  return `${gregorianYear}-${String(month).padStart(2, '0')}-01`;
}

function extractCoordinates(text) {
  const m = text.match(/([0-9]{1,2}\.[0-9]{3,8})\s*,\s*([0-9]{2,3}\.[0-9]{3,8})/);
  if (!m) return {};
  return { lat: Number(m[1]), lng: Number(m[2]) };
}

function renderPdfToPngs(pdfPath, outDir) {
  execFileSync('pdftoppm', ['-png', '-r', '150', pdfPath, path.join(outDir, 'page')]);
  return fs
    .readdirSync(outDir)
    .filter((f) => f.endsWith('.png'))
    .sort((a, b) => {
      const na = parseInt(a.match(/\d+/)[0], 10);
      const nb = parseInt(b.match(/\d+/)[0], 10);
      return na - nb;
    })
    .map((f) => path.join(outDir, f));
}

function extractFromPdf(pdfPath, log) {
  const sourceDocument = path.basename(pdfPath);
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'remediation-pdf-'));
  const pages = renderPdfToPngs(pdfPath, tmpDir);

  const entries = [];
  let current = null;

  for (const pngPath of pages) {
    const topPath = pngPath + '.top.png';
    cropTopThresholded(pngPath, topPath, 0.10);
    const topText = ocr(topPath, 6);
    const titleMatch = topText.match(/จุด[ทที่]{1,3}\s*(\d+)\s*:\s*(.+)/);

    if (titleMatch) {
      if (current) entries.push(current);
      const { lat, lng } = extractCoordinates(topText);
      const districtLine = topText.split('\n').find((l) => l.includes('เขต'));
      current = {
        reportedPointNumber: Number(titleMatch[1]),
        title: titleMatch[2].trim().split('(')[0].trim(),
        lat,
        lng,
        district: districtLine ? districtLine.split(':').slice(1).join(':').trim() : undefined,
        responsibleAgency: undefined,
        note: undefined,
        completedAt: undefined,
        sourceDocument,
      };
      log(`  จุดที่ ${current.reportedPointNumber}: ${current.title} @ ${lat},${lng}`);
    }

    if (current) {
      const bodyText = ocr(pngPath, 3);
      const agency = extractLabeledField(bodyText, 'หน่วยงานที่เกี่ยวข้อง');
      if (agency && !current.responsibleAgency) current.responsibleAgency = agency;

      const note =
        extractLabeledField(bodyText, 'การดําเนินการ :') ||
        extractLabeledField(bodyText, 'การดำเนินการ :') ||
        extractLabeledField(bodyText, 'หลังการดําเนินการ :') ||
        extractLabeledField(bodyText, 'หลังการดำเนินการ :');
      if (note) current.note = note;

      const band = findGreenBandY(pngPath);
      if (band) {
        const bannerPath = pngPath + '.banner.png';
        cropBannerThresholded(pngPath, bannerPath, band);
        const completedAt = parseCompletedDate(ocr(bannerPath, 6));
        if (completedAt) {
          current.completedAt = completedAt;
          log(`    -> completedAt: ${completedAt}`);
        }
      }
    }
  }
  if (current) entries.push(current);

  fs.rmSync(tmpDir, { recursive: true, force: true });
  return entries.filter((e) => e.completedAt && e.lat && e.lng);
}

function toTsLiteral(entries) {
  const lines = [];
  lines.push(`export interface RemediationPdfDetails {`);
  lines.push(`  /** "จุดที่ N" as printed in the PDF — NOT RiskPoint.clusterRank, do not join on this. */`);
  lines.push(`  reportedPointNumber: number;`);
  lines.push(`  title: string;`);
  lines.push(`  lat: number;`);
  lines.push(`  lng: number;`);
  lines.push(`  district?: string;`);
  lines.push(`  responsibleAgency?: string;`);
  lines.push(`  completedAt: string;`);
  lines.push(`  note?: string;`);
  lines.push(`  sourceDocument: string;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`/** Generated by scripts/extract-pdf-remediations.js — do not edit by hand. */`);
  lines.push(`export const remediationPdfDetails: RemediationPdfDetails[] = [`);
  for (const e of entries) {
    lines.push(`  {`);
    lines.push(`    reportedPointNumber: ${e.reportedPointNumber},`);
    lines.push(`    title: ${JSON.stringify(e.title)},`);
    lines.push(`    lat: ${e.lat},`);
    lines.push(`    lng: ${e.lng},`);
    if (e.district) lines.push(`    district: ${JSON.stringify(e.district)},`);
    if (e.responsibleAgency) lines.push(`    responsibleAgency: ${JSON.stringify(e.responsibleAgency)},`);
    lines.push(`    completedAt: ${JSON.stringify(e.completedAt)},`);
    if (e.note) lines.push(`    note: ${JSON.stringify(e.note)},`);
    lines.push(`    sourceDocument: ${JSON.stringify(e.sourceDocument)},`);
    lines.push(`  },`);
  }
  lines.push(`];`);
  return lines.join('\n') + '\n';
}

function main() {
  const inputDir = process.argv[2];
  if (!inputDir) {
    console.error('Usage: node extract-pdf-remediations.js <dir-with-monthly-pdfs>');
    process.exit(1);
  }

  const pdfFiles = fs
    .readdirSync(inputDir)
    .filter((f) => f.toLowerCase().endsWith('.pdf'))
    .sort();

  const byCoordKey = new Map();
  for (const file of pdfFiles) {
    console.error(`Processing ${file}...`);
    const entries = extractFromPdf(path.join(inputDir, file), (m) => console.error(m));
    for (const entry of entries) {
      const key = `${entry.lat.toFixed(4)},${entry.lng.toFixed(4)}`;
      const existing = byCoordKey.get(key);
      if (!existing || entry.completedAt > existing.completedAt) {
        byCoordKey.set(key, entry);
      }
    }
  }

  const sorted = [...byCoordKey.values()].sort((a, b) => a.reportedPointNumber - b.reportedPointNumber);
  process.stdout.write(toTsLiteral(sorted));
  console.error(`\nDone. ${sorted.length} completed risk points extracted.`);
}

main();