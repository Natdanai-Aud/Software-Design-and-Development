import { DataBootstrapService } from './data-bootstrap.service';
import { RiskPointsRepository } from './risk-points.repository';
import { RemediationsRepository } from './remediations.repository';
import { KmlRiskPointSource } from '../risk-points/kml-risk-point.source';
import { RiskLevel } from '../risk-points/risk-level.enum';
import { RiskPoint } from '../risk-points/risk-point.model';

describe('DataBootstrapService', () => {
  function makeSource(impl?: {
    fetchRiskPoints?: jest.Mock;
  }): KmlRiskPointSource {
    return {
      fetchRiskPoints: jest.fn(),
      ...impl,
    } as unknown as KmlRiskPointSource;
  }

  function makeService(source: KmlRiskPointSource) {
    const riskPointsRepository = new RiskPointsRepository();
    const remediationsRepository = new RemediationsRepository();
    const bootstrap = new DataBootstrapService(
      riskPointsRepository,
      remediationsRepository,
      source,
    );
    return { bootstrap, riskPointsRepository, remediationsRepository };
  }

  it('seeds 100 mock risk points by default', () => {
    const { riskPointsRepository } = makeService(makeSource());

    const points = riskPointsRepository.findAll();
    expect(points).toHaveLength(100);
    expect(points[0].riskPointId).toBe('RP-001');
    expect(points[0].riskLevel).toBe(RiskLevel.CRITICAL);
  });

  it('keeps seeded points when the KML source returns nothing', async () => {
    const source = makeSource({
      fetchRiskPoints: jest.fn().mockResolvedValue(null),
    });
    const { bootstrap, riskPointsRepository } = makeService(source);

    await bootstrap.onModuleInit();

    expect(source.fetchRiskPoints).toHaveBeenCalled();
    expect(riskPointsRepository.findAll()).toHaveLength(100);
  });

  it('replaces seeded points with real points from the KML source', async () => {
    const realPoints: RiskPoint[] = [
      {
        riskPointId: 'RP-042',
        clusterRank: 999,
        nameTh: 'แยกทดสอบ',
        district: 'ทดสอบ',
        lat: 13.735236,
        lng: 100.64114,
        accidentCount: 420,
        fatalities: 12,
        injuries: 390,
        riskLevel: RiskLevel.CRITICAL,
        dataYearRange: '2566-2568',
        causes: [],
        solutions: [],
      },
    ];
    const source = makeSource({
      fetchRiskPoints: jest.fn().mockResolvedValue(realPoints),
    });
    const { bootstrap, riskPointsRepository } = makeService(source);

    await bootstrap.onModuleInit();

    const points = riskPointsRepository.findAll();
    const point = points[0];
    expect(points).toHaveLength(1);
    expect(point.riskPointId).toBe('RP-042');
    expect(point.clusterRank).toBe(999);
    expect(point.causes).toEqual([]);
    expect(point.solutions).toEqual([]);
  });

  it('attaches PDF-extracted causes and solutions to replaced KML points by cluster rank', async () => {
    const realPoints: RiskPoint[] = [
      {
        riskPointId: 'RP-042',
        clusterRank: 1,
        nameTh: 'แยกทดสอบ',
        district: 'ทดสอบ',
        lat: 13.735236,
        lng: 100.64114,
        accidentCount: 420,
        fatalities: 12,
        injuries: 390,
        riskLevel: RiskLevel.CRITICAL,
        dataYearRange: '2566-2568',
        causes: [],
        solutions: [],
      },
    ];
    const source = makeSource({
      fetchRiskPoints: jest.fn().mockResolvedValue(realPoints),
    });
    const { bootstrap, riskPointsRepository } = makeService(source);

    await bootstrap.onModuleInit();

    const point = riskPointsRepository.findAll()[0];
    expect(point.causes).toHaveLength(3);
    expect(point.causes[0]).toEqual({
      description: 'อุบัติเหตุจากการวิ่งตัด Lane จราจร',
      sourceDocument: '660628-solutions-1-20.pdf',
    });
    expect(point.solutions.length).toBeGreaterThan(0);
  });
});
