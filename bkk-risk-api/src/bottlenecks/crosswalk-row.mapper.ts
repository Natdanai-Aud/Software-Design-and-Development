import { Bottleneck } from './bottleneck.model';

const KEY_ALIASES: Record<string, string> = {
  lat: 'lat',
  latitude: 'lat',
  long: 'lng',
  longitude: 'lng',
  lng: 'lng',
  district: 'district',
  road: 'road',
  location: 'location',
  ctype: 'cType',
  crossmarking: 'crossMarking',
  numlane: 'numLane',
};

function normalizeKey(key: string): string {
  return String(key ?? '')
    .replace(/^\uFEFF/, '')
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, '');
}

function stringOrNull(value: unknown): string | null {
  const text = String(value ?? '').trim();
  return text ? text : null;
}

function numberOrNull(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/** Maps one crosswalk_50 xlsx row (whose headers vary in case/naming across the 50 district files) to a Bottleneck. */
export function mapCrosswalkRow(
  row: Record<string, unknown>,
): Bottleneck | null {
  const fields = new Map<string, unknown>();

  for (const [key, value] of Object.entries(row)) {
    const normalized = KEY_ALIASES[normalizeKey(key)];
    if (normalized && value !== null && value !== undefined && value !== '') {
      fields.set(normalized, value);
    }
  }

  const lat = Number(fields.get('lat'));
  const lng = Number(fields.get('lng'));
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  const location = String(fields.get('location') ?? '').trim();
  const road = String(fields.get('road') ?? '').trim();

  return {
    bottleneckId: '',
    nameTh: location || road || 'ทางคนเดินข้าม',
    district: String(fields.get('district') ?? '').trim(),
    road: road || undefined,
    lat,
    lng,
    crossMarking: stringOrNull(fields.get('crossMarking')),
    cType: stringOrNull(fields.get('cType')),
    numLane: numberOrNull(fields.get('numLane')),
  };
}

export function parseCrosswalkRows(
  rows: Record<string, unknown>[],
): Bottleneck[] {
  return rows
    .map((row) => mapCrosswalkRow(row))
    .filter((item): item is Bottleneck => item !== null);
}
