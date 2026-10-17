import { NotFoundException } from '@nestjs/common';
import { RiskPointsRepository } from '../data-store/risk-points.repository';
import { RiskLevel } from './risk-level.enum';
import { RiskPoint } from './risk-point.model';
import { RiskPointsService } from './risk-points.service';

function makeRiskPoint(overrides: Partial<RiskPoint> = {}): RiskPoint {
  return {
    riskPointId: 'RP-001',
    clusterRank: 1,
    nameTh: 'แยกอโศก',
    district: 'วัฒนา',
    lat: 13.73,
    lng: 100.56,
    accidentCount: 12,
    riskLevel: RiskLevel.HIGH,
    causes: [{ description: 'รถหนาแน่น', sourceDocument: 'doc-1' }],
    solutions: [{ description: 'เพิ่มสัญญาณไฟ', sourceDocument: 'doc-1' }],
    ...overrides,
  };
}

function makeService(points: RiskPoint[] = []): RiskPointsService {
  const repository = new RiskPointsRepository();
  repository.replaceAll(points);
  return new RiskPointsService(repository);
}

describe('RiskPointsService', () => {
  describe('findAll', () => {
    it('returns every point when no filter is given', () => {
      const points = [
        makeRiskPoint(),
        makeRiskPoint({ riskPointId: 'RP-002', district: 'ห้วยขวาง' }),
      ];

      expect(makeService(points).findAll()).toHaveLength(2);
    });

    it('filters by district', () => {
      const service = makeService([
        makeRiskPoint(),
        makeRiskPoint({ riskPointId: 'RP-002', district: 'ห้วยขวาง' }),
      ]);

      const found = service.findAll('ห้วยขวาง');

      expect(found).toHaveLength(1);
      expect(found[0].riskPointId).toBe('RP-002');
    });

    it('filters by risk level', () => {
      const service = makeService([
        makeRiskPoint(),
        makeRiskPoint({
          riskPointId: 'RP-002',
          riskLevel: RiskLevel.CRITICAL,
        }),
      ]);

      const found = service.findAll(undefined, RiskLevel.CRITICAL);

      expect(found).toHaveLength(1);
      expect(found[0].riskPointId).toBe('RP-002');
    });

    it('combines district and risk-level filters', () => {
      const service = makeService([
        makeRiskPoint(),
        makeRiskPoint({
          riskPointId: 'RP-002',
          district: 'ห้วยขวาง',
          riskLevel: RiskLevel.CRITICAL,
        }),
      ]);

      expect(service.findAll('ห้วยขวาง', RiskLevel.CRITICAL)).toHaveLength(1);
      expect(service.findAll('ห้วยขวาง', RiskLevel.HIGH)).toHaveLength(0);
    });

    it('omits causes and solutions from the response', () => {
      const [item] = makeService([makeRiskPoint()]).findAll();

      expect('causes' in item).toBe(false);
      expect('solutions' in item).toBe(false);
      expect(item.riskPointId).toBe('RP-001');
    });
  });

  describe('findOne', () => {
    it('returns a copy of the stored point with full details', () => {
      const service = makeService([makeRiskPoint()]);

      const found = service.findOne('RP-001');

      expect(found.riskPointId).toBe('RP-001');
      expect(found.causes).toHaveLength(1);
      expect(found).not.toBe(service.findOne('RP-001'));
    });

    it('throws NotFoundException for an unknown id', () => {
      expect(() => makeService([makeRiskPoint()]).findOne('RP-999')).toThrow(
        NotFoundException,
      );
    });
  });
});
