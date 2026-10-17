import { RiskPointsController } from './risk-points.controller';
import { RiskPointsService } from './risk-points.service';
import { RiskLevel } from './risk-level.enum';

function makeController(): {
  controller: RiskPointsController;
  service: { findAll: jest.Mock; findOne: jest.Mock };
} {
  const service = { findAll: jest.fn(), findOne: jest.fn() };
  const controller = new RiskPointsController(
    service as unknown as RiskPointsService,
  );
  return { controller, service };
}

describe('RiskPointsController', () => {
  it('passes district and risk level filters to the service', () => {
    const { controller, service } = makeController();
    const query = { district: 'จตุจักร', riskLevel: RiskLevel.HIGH };

    controller.findAll(query);

    expect(service.findAll).toHaveBeenCalledWith('จตุจักร', RiskLevel.HIGH);
  });

  it('passes empty filters through to the service', () => {
    const { controller, service } = makeController();

    controller.findAll({});

    expect(service.findAll).toHaveBeenCalledWith(undefined, undefined);
  });

  it('returns a single risk point by id', () => {
    const { controller, service } = makeController();
    service.findOne.mockReturnValue({ riskPointId: 'RP-001' });

    expect(controller.findOne('RP-001')).toEqual({ riskPointId: 'RP-001' });
    expect(service.findOne).toHaveBeenCalledWith('RP-001');
  });
});
