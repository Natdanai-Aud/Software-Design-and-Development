import { RiskLevel } from './risk-level.enum';
import { RiskPoint } from './risk-point.model';
import { deriveRiskStatistics } from './risk-statistics';

const DISTRICTS = [
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

/**
 * Deterministic offline fallback used when the Google My Maps KML source is
 * unreachable at startup. Rank-based statistics come from
 * `deriveRiskStatistics`, the same formula used for real KML points — see
 * `risk-statistics.ts`. Three points get realistic overrides so the demo
 * data isn't uniformly synthetic; their causes/solutions still come from
 * `withPdfDetails` (data/risk-point-pdf-details.ts), never from here.
 */
export function seedRiskPoints(): RiskPoint[] {
  const points: RiskPoint[] = Array.from({ length: 100 }, (_, index) => {
    const rank = index + 1;
    const district = DISTRICTS[index % DISTRICTS.length];
    const statistics = deriveRiskStatistics(rank);

    return {
      riskPointId: `RP-${String(rank).padStart(3, '0')}`,
      clusterRank: rank,
      nameTh: `จุดเสี่ยงจำลอง ${String(rank).padStart(3, '0')}`,
      district,
      road: `ถนนจำลองสาย ${rank}`,
      lat: 13.7 + (index % 20) * 0.008,
      lng: 100.47 + (index % 20) * 0.007,
      accidentCount: statistics.accidentCount,
      fatalities: statistics.fatalities,
      injuries: statistics.injuries,
      riskLevel: statistics.riskLevel,
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
