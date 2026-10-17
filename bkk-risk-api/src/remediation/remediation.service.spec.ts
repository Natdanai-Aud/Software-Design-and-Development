import { NotFoundException } from '@nestjs/common';
import { RemediationsRepository } from '../data-store/remediations.repository';
import { RiskPointsRepository } from '../data-store/risk-points.repository';
import { RiskLevel } from '../risk-points/risk-level.enum';
import { RiskPoint } from '../risk-points/risk-point.model';
import { Remediation } from './remediation.model';
import { RemediationStatus } from './remediation-status.enum';
import { RemediationService } from './remediation.service';

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
    causes: [],
    solutions: [],
    ...overrides,
  };
}

function makeRemediation(overrides: Partial<Remediation> = {}): Remediation {
  return {
    remediationId: 'RM-001',
    riskPointId: 'RP-001',
    status: RemediationStatus.PENDING,
    startedAt: '2568-01-01',
    dueAt: '2568-02-01',
    updatedAt: '2568-01-01',
    ...overrides,
  };
}

function makeService(
  remediations: Remediation[] = [],
  points: RiskPoint[] = [],
): RemediationService {
  const remediationsRepository = new RemediationsRepository();
  remediationsRepository.replaceAll(remediations);
  const riskPointsRepository = new RiskPointsRepository();
  riskPointsRepository.replaceAll(points);
  return new RemediationService(remediationsRepository, riskPointsRepository);
}

describe('RemediationService', () => {
  describe('findAll', () => {
    it('returns every remediation without internal timestamps', () => {
      const service = makeService(
        [makeRemediation(), makeRemediation({ remediationId: 'RM-002' })],
        [makeRiskPoint()],
      );

      const found = service.findAll();

      expect(found).toHaveLength(2);
      expect('startedAt' in found[0]).toBe(false);
      expect('dueAt' in found[0]).toBe(false);
      expect(found[0].remediationId).toBe('RM-001');
    });

    it('filters by district through the linked risk point', () => {
      const service = makeService(
        [
          makeRemediation(),
          makeRemediation({
            remediationId: 'RM-002',
            riskPointId: 'RP-002',
          }),
        ],
        [
          makeRiskPoint(),
          makeRiskPoint({ riskPointId: 'RP-002', district: 'ห้วยขวาง' }),
        ],
      );

      const found = service.findAll('ห้วยขวาง');

      expect(found).toHaveLength(1);
      expect(found[0].remediationId).toBe('RM-002');
    });

    it('excludes remediations whose risk point is missing when filtering by district', () => {
      const service = makeService([makeRemediation()], []);

      expect(service.findAll('วัฒนา')).toHaveLength(0);
    });

    it('filters by status', () => {
      const service = makeService(
        [
          makeRemediation(),
          makeRemediation({
            remediationId: 'RM-002',
            status: RemediationStatus.COMPLETED,
          }),
        ],
        [makeRiskPoint()],
      );

      const found = service.findAll(undefined, RemediationStatus.COMPLETED);

      expect(found).toHaveLength(1);
      expect(found[0].remediationId).toBe('RM-002');
    });
  });

  describe('update', () => {
    it('applies a partial patch and stamps updatedAt', () => {
      const service = makeService([makeRemediation()], [makeRiskPoint()]);

      const updated = service.update('RM-001', {
        status: RemediationStatus.IN_PROGRESS,
        note: 'เริ่มดำเนินการ',
      });

      expect(updated.status).toBe(RemediationStatus.IN_PROGRESS);
      expect(updated.note).toBe('เริ่มดำเนินการ');
      expect(updated.updatedAt).toBeDefined();
      expect('startedAt' in updated).toBe(false);
    });

    it('applies dueAt and completedAt patches', () => {
      const service = makeService([makeRemediation()], [makeRiskPoint()]);

      const updated = service.update('RM-001', {
        dueAt: '2568-03-01',
        completedAt: '2568-02-15',
      });

      // dueAt is stored but hidden from the public response,
      // while completedAt stays visible.
      expect('dueAt' in updated).toBe(false);
      expect(updated.completedAt).toBe('2568-02-15');
    });

    it('updates only the timestamp when the dto is empty', () => {
      const service = makeService([makeRemediation()], [makeRiskPoint()]);

      const updated = service.update('RM-001', {});

      expect(updated.status).toBe(RemediationStatus.PENDING);
      expect(updated.updatedAt).toBeDefined();
    });

    it('throws NotFoundException for an unknown id', () => {
      const service = makeService([makeRemediation()], [makeRiskPoint()]);

      expect(() =>
        service.update('RM-999', { status: RemediationStatus.COMPLETED }),
      ).toThrow(NotFoundException);
    });
  });
});
