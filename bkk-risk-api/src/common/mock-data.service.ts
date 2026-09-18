import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  RankingEntry,
  Remediation,
  RiskPoint,
} from './models';
import { RiskLevel } from './enums';
import { buildRemediationsFromPdfDetails } from './remediation-pdf-matcher';
import { KmlRiskPointSource } from './kml-risk-point-source.service';
import { remediationPdfDetails } from '../data/remediation-pdf-details';
import { withPdfDetails } from '../data/risk-point-pdf-details';

function seedRiskPoints(): RiskPoint[] {
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

  const points: RiskPoint[] = Array.from({ length: 100 }, (_, index) => {
    const rank = index + 1;
    const district = districts[index % districts.length];
    const accidents = Math.max(58, 420 - index * 3);
    const fatalities = Math.max(1, 12 - Math.floor(index / 12));
    const injuries = Math.max(40, 390 - index * 3);
    const riskLevel =
      accidents >= 300
        ? RiskLevel.CRITICAL
        : accidents >= 220
          ? RiskLevel.HIGH
          : accidents >= 130
            ? RiskLevel.MEDIUM
            : RiskLevel.LOW;

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
    riskLevel: RiskLevel.CRITICAL,
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
    riskLevel: RiskLevel.CRITICAL,
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
    riskLevel: RiskLevel.HIGH,
  });

  return points;
}

@Injectable()
export class MockDataService implements OnModuleInit {
  private _riskPoints: RiskPoint[] = seedRiskPoints();

  private _pdfRemediations: Remediation[] = [];

  private _ranking: RankingEntry[] = [];
  private _rankedAt = '2026-08-01T02:15:00+07:00';

  constructor(private readonly kmlRiskPointSource: KmlRiskPointSource) {
    this._riskPoints = withPdfDetails(seedRiskPoints());
    this.refreshPdfRemediations();
  }

  async onModuleInit() {
    const fetched = await this.kmlRiskPointSource.fetchRiskPoints();

    if (fetched && fetched.length > 0) {
      this._riskPoints = withPdfDetails(fetched);
      this.refreshPdfRemediations();
    }
  }

  private refreshPdfRemediations() {
    this._pdfRemediations = buildRemediationsFromPdfDetails(
      remediationPdfDetails,
      this._riskPoints,
    );
  }

  get riskPoints(): RiskPoint[] {
    return this._riskPoints;
  }

  get remediations(): Remediation[] {
    return [...this._pdfRemediations];
  }

  get ranking(): RankingEntry[] {
    return this._ranking;
  }

  get rankedAt(): string {
    return this._rankedAt;
  }

  replaceRanking(items: RankingEntry[], rankedAt = new Date().toISOString()) {
    this._ranking = items;
    this._rankedAt = rankedAt;
  }
}
