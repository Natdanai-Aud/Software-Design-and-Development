import { RemediationController } from './remediation.controller';
import { RemediationService } from './remediation.service';
import { RemediationStatus } from './remediation-status.enum';

function makeController(): {
  controller: RemediationController;
  service: { findAll: jest.Mock };
} {
  const service = { findAll: jest.fn() };
  const controller = new RemediationController(
    service as unknown as RemediationService,
  );
  return { controller, service };
}

describe('RemediationController', () => {
  it('passes district and status filters to the service', () => {
    const { controller, service } = makeController();
    const query = {
      district: 'จตุจักร',
      status: RemediationStatus.IN_PROGRESS,
    };

    controller.findAll(query);

    expect(service.findAll).toHaveBeenCalledWith(
      'จตุจักร',
      RemediationStatus.IN_PROGRESS,
    );
  });

  it('passes empty filters through to the service', () => {
    const { controller, service } = makeController();

    controller.findAll({});

    expect(service.findAll).toHaveBeenCalledWith(undefined, undefined);
  });
});
