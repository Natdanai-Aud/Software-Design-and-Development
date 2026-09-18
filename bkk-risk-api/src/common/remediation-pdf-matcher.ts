import { Remediation, RiskPoint } from './models';
import { RemediationStatus } from './enums';
import { RemediationPdfDetails } from '../data/remediation-pdf-details';

const MAX_MATCH_DISTANCE_METERS = 150;

function haversineMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function matchRiskPointByCoordinates(
  lat: number,
  lng: number,
  riskPoints: RiskPoint[],
): RiskPoint | null {
  let best: RiskPoint | null = null;
  let bestDistance = Infinity;

  for (const point of riskPoints) {
    const distance = haversineMeters(lat, lng, point.lat, point.lng);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = point;
    }
  }

  return best && bestDistance <= MAX_MATCH_DISTANCE_METERS ? best : null;
}

function toIsoUpdatedAt(completedAt: string): string {
  return new Date(`${completedAt}T00:00:00+07:00`).toISOString();
}

export function buildRemediationsFromPdfDetails(
  details: RemediationPdfDetails[],
  riskPoints: RiskPoint[],
): Remediation[] {
  const result: Remediation[] = [];
  let sequence = 0;

  for (const entry of details) {
    const point = matchRiskPointByCoordinates(entry.lat, entry.lng, riskPoints);
    if (!point) continue;

    sequence += 1;
    result.push({
      remediationId: `RM-PDF-${String(sequence).padStart(3, '0')}`,
      riskPointId: point.riskPointId,
      status: RemediationStatus.COMPLETED,
      responsibleAgency: entry.responsibleAgency,
      startedAt: null,
      dueAt: null,
      completedAt: entry.completedAt,
      note: entry.note ?? null,
      updatedAt: toIsoUpdatedAt(entry.completedAt),
    });
  }

  return result;
}