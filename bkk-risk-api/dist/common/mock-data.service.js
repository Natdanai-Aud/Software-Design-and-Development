"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockDataService = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("./enums");
function seedRiskPoints() {
    const districts = [
        'จตุจักร',
        'ห้วยขวาง',
        'บางนา',
        'วัฒนา',
        'ดินแดง',
        'พระนคร',
        'ปทุมวัน',
        'ลาดพร้าว',
        'บางกะปิ',
        'คลองเตย',
    ];
    const points = Array.from({ length: 100 }, (_, index) => {
        const rank = index + 1;
        const district = districts[index % districts.length];
        const accidents = Math.max(58, 420 - index * 3);
        const fatalities = Math.max(1, 12 - Math.floor(index / 12));
        const injuries = Math.max(40, 390 - index * 3);
        const riskLevel = accidents >= 300
            ? enums_1.RiskLevel.CRITICAL
            : accidents >= 220
                ? enums_1.RiskLevel.HIGH
                : accidents >= 130
                    ? enums_1.RiskLevel.MEDIUM
                    : enums_1.RiskLevel.LOW;
        return {
            riskPointId: `RP-${String(rank).padStart(3, '0')}`,
            clusterRank: rank,
            nameTh: `จุดเสี่ยงจำลอง ${String(rank).padStart(3, '0')}`,
            district,
            road: `ถนนจำลองสาย ${rank}`,
            lat: 13.70 + (index % 20) * 0.008,
            lng: 100.47 + (index % 20) * 0.007,
            accidentCount: accidents,
            fatalities,
            injuries,
            riskLevel,
            dataYearRange: '2566-2568',
            causes: [],
            solutions: [],
        };
    });
    Object.assign(points[0], {
        nameTh: 'แยกรัชดา-ลาดพร้าว',
        district: 'จตุจักร',
        road: 'ถนนรัชดาภิเษก',
        lat: 13.8065,
        lng: 100.5745,
        accidentCount: 412,
        fatalities: 9,
        injuries: 388,
        riskLevel: enums_1.RiskLevel.CRITICAL,
        causes: [
            {
                description: 'ทัศนวิสัยบริเวณทางแยกถูกบดบังด้วยตอม่อรถไฟฟ้า',
                sourceDocument: '660201-solutions-1-20.pdf',
            },
            {
                description: 'รถจักรยานยนต์ย้อนศรบริเวณจุดกลับรถ',
                sourceDocument: '660201-solutions-1-20.pdf',
            },
        ],
        solutions: [
            {
                description: 'ติดตั้งกระจกโค้งและไฟส่องสว่างเพิ่มบริเวณทางแยก',
                sourceDocument: '660201-solutions-1-20.pdf',
            },
        ],
    });
    Object.assign(points[6], {
        nameTh: 'แยกบางนา',
        district: 'บางนา',
        road: 'ถนนเทพรัตน',
        lat: 13.6687,
        lng: 100.603,
        accidentCount: 377,
        fatalities: 11,
        injuries: 352,
        riskLevel: enums_1.RiskLevel.CRITICAL,
    });
    Object.assign(points[13], {
        nameTh: 'แยกอโศก-เพชรบุรี',
        district: 'ห้วยขวาง',
        road: 'ถนนอโศกมนตรี',
        lat: 13.7375,
        lng: 100.5601,
        accidentCount: 210,
        fatalities: 3,
        injuries: 198,
        riskLevel: enums_1.RiskLevel.HIGH,
    });
    return points;
}
let MockDataService = class MockDataService {
    _riskPoints = seedRiskPoints();
    _remediations = [
        {
            remediationId: 'RM-001',
            riskPointId: 'RP-001',
            status: enums_1.RemediationStatus.IN_PROGRESS,
            responsibleAgency: 'สำนักการจราจรและขนส่ง',
            startedAt: '2026-03-10',
            dueAt: '2026-06-30',
            completedAt: null,
            note: 'รอผลการจัดซื้อจัดจ้างอุปกรณ์ไฟส่องสว่าง',
            updatedAt: '2026-07-28T14:05:00+07:00',
        },
        {
            remediationId: 'RM-007',
            riskPointId: 'RP-007',
            status: enums_1.RemediationStatus.COMPLETED,
            responsibleAgency: 'สำนักการจราจรและขนส่ง',
            startedAt: '2026-01-15',
            dueAt: '2026-04-30',
            completedAt: '2026-04-22',
            note: 'ติดตั้งสัญญาณไฟคนข้ามแบบกดปุ่มแล้วเสร็จ',
            updatedAt: '2026-04-22T16:40:00+07:00',
        },
        {
            remediationId: 'RM-014',
            riskPointId: 'RP-014',
            status: enums_1.RemediationStatus.PENDING,
            responsibleAgency: 'สำนักการจราจรและขนส่ง',
            startedAt: null,
            dueAt: '2026-12-15',
            completedAt: null,
            note: 'อยู่ระหว่างจัดทำแบบ',
            updatedAt: '2026-08-01T10:00:00+07:00',
        },
    ];
    _bottlenecks = [
        {
            bottleneckId: 'BN-003',
            nameTh: 'หน้าห้างเซ็นทรัลลาดพร้าว',
            district: 'จตุจักร',
            road: 'ถนนพหลโยธิน',
            lat: 13.8163,
            lng: 100.5606,
            congestionLevel: enums_1.CongestionLevel.BLOCKED,
            avgSpeedKmh: 6.5,
            observedAt: '2026-08-07T17:45:00+07:00',
        },
        {
            bottleneckId: 'BN-011',
            nameTh: 'ทางลงด่วนพระราม 9',
            district: 'ห้วยขวาง',
            road: 'ถนนพระราม 9',
            lat: 13.7566,
            lng: 100.5661,
            congestionLevel: enums_1.CongestionLevel.CONGESTED,
            avgSpeedKmh: 18.2,
            observedAt: '2026-08-07T17:45:00+07:00',
        },
        {
            bottleneckId: 'BN-015',
            nameTh: 'แยกปทุมวัน',
            district: 'ปทุมวัน',
            road: 'ถนนพระราม 1',
            lat: 13.7449,
            lng: 100.5331,
            congestionLevel: enums_1.CongestionLevel.NORMAL,
            avgSpeedKmh: 42.3,
            observedAt: '2026-08-07T17:45:00+07:00',
        },
    ];
    _ranking = [];
    _rankedAt = '2026-08-01T02:15:00+07:00';
    get riskPoints() {
        return this._riskPoints;
    }
    get remediations() {
        return this._remediations;
    }
    get bottlenecks() {
        return this._bottlenecks;
    }
    get ranking() {
        return this._ranking;
    }
    get rankedAt() {
        return this._rankedAt;
    }
    replaceRanking(items, rankedAt = new Date().toISOString()) {
        this._ranking = items;
        this._rankedAt = rankedAt;
    }
};
exports.MockDataService = MockDataService;
exports.MockDataService = MockDataService = __decorate([
    (0, common_1.Injectable)()
], MockDataService);
//# sourceMappingURL=mock-data.service.js.map