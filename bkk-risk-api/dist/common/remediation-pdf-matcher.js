"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchRiskPointByCoordinates = matchRiskPointByCoordinates;
exports.buildRemediationsFromPdfDetails = buildRemediationsFromPdfDetails;
const enums_1 = require("./enums");
const MAX_MATCH_DISTANCE_METERS = 150;
function haversineMeters(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
}
function matchRiskPointByCoordinates(lat, lng, riskPoints) {
    let best = null;
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
function toIsoUpdatedAt(completedAt) {
    return new Date(`${completedAt}T00:00:00+07:00`).toISOString();
}
function buildRemediationsFromPdfDetails(details, riskPoints) {
    const result = [];
    let sequence = 0;
    for (const entry of details) {
        const point = matchRiskPointByCoordinates(entry.lat, entry.lng, riskPoints);
        if (!point)
            continue;
        sequence += 1;
        result.push({
            remediationId: `RM-PDF-${String(sequence).padStart(3, '0')}`,
            riskPointId: point.riskPointId,
            status: enums_1.RemediationStatus.COMPLETED,
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
//# sourceMappingURL=remediation-pdf-matcher.js.map