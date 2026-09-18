"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const remediation_pdf_matcher_1 = require("./remediation-pdf-matcher");
const enums_1 = require("./enums");
function makeRiskPoint(overrides) {
    return {
        riskPointId: 'RP-999',
        clusterRank: 999,
        nameTh: 'จุดทดสอบ',
        district: 'ทดสอบ',
        lat: 13.7,
        lng: 100.5,
        accidentCount: 0,
        riskLevel: enums_1.RiskLevel.LOW,
        causes: [],
        solutions: [],
        ...overrides,
    };
}
describe('matchRiskPointByCoordinates', () => {
    it('matches the closest point within range', () => {
        const near = makeRiskPoint({ riskPointId: 'RP-001', lat: 13.7113, lng: 100.4995 });
        const far = makeRiskPoint({ riskPointId: 'RP-002', lat: 13.9, lng: 100.9 });
        const match = (0, remediation_pdf_matcher_1.matchRiskPointByCoordinates)(13.711271, 100.4995, [far, near]);
        expect(match?.riskPointId).toBe('RP-001');
    });
    it('returns null when nothing is within range', () => {
        const distant = makeRiskPoint({ riskPointId: 'RP-001', lat: 14.5, lng: 101.5 });
        const match = (0, remediation_pdf_matcher_1.matchRiskPointByCoordinates)(13.711271, 100.4995, [distant]);
        expect(match).toBeNull();
    });
    it('returns null for an empty risk point list', () => {
        expect((0, remediation_pdf_matcher_1.matchRiskPointByCoordinates)(13.711271, 100.4995, [])).toBeNull();
    });
});
describe('buildRemediationsFromPdfDetails', () => {
    const riskPoints = [
        makeRiskPoint({ riskPointId: 'RP-006', lat: 13.711271, lng: 100.4995 }),
        makeRiskPoint({ riskPointId: 'RP-014', lat: 13.736391, lng: 100.56129 }),
    ];
    const details = [
        {
            reportedPointNumber: 6,
            title: 'ถนนเจริญนคร บริเวณซอย 39 - 47',
            lat: 13.711271,
            lng: 100.4995,
            responsibleAgency: 'สำนักการจราจรและขนส่ง, สน.สำเหร่',
            completedAt: '2023-09-01',
            note: 'ติดตั้งหมุดสะท้อนแสง',
            sourceDocument: 'จุดเสี่ยงที่ดำเนินการแล้วเดือนกันยายน 2566.pdf',
        },
        {
            reportedPointNumber: 999,
            title: 'จุดที่ไม่มีใน RiskPoint ปัจจุบัน',
            lat: 20.0,
            lng: 105.0,
            completedAt: '2023-09-01',
            sourceDocument: 'จุดเสี่ยงที่ดำเนินการแล้วเดือนกันยายน 2566.pdf',
        },
    ];
    it('joins matched entries to their RiskPoint and marks them COMPLETED', () => {
        const result = (0, remediation_pdf_matcher_1.buildRemediationsFromPdfDetails)(details, riskPoints);
        expect(result).toHaveLength(1);
        expect(result[0].riskPointId).toBe('RP-006');
        expect(result[0].status).toBe(enums_1.RemediationStatus.COMPLETED);
        expect(result[0].completedAt).toBe('2023-09-01');
        expect(result[0].note).toBe('ติดตั้งหมุดสะท้อนแสง');
    });
    it('skips entries whose coordinates match no known RiskPoint', () => {
        const result = (0, remediation_pdf_matcher_1.buildRemediationsFromPdfDetails)(details, riskPoints);
        expect(result.find((r) => r.riskPointId === 'RP-999')).toBeUndefined();
    });
    it('assigns unique sequential remediationIds', () => {
        const twoMatching = [details[0], { ...details[0], lat: 13.736391, lng: 100.56129 }];
        const result = (0, remediation_pdf_matcher_1.buildRemediationsFromPdfDetails)(twoMatching, riskPoints);
        expect(result.map((r) => r.remediationId)).toEqual(['RM-PDF-001', 'RM-PDF-002']);
    });
});
//# sourceMappingURL=remediation-pdf-matcher.spec.js.map