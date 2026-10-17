import { RankingController } from './ranking.controller';
import { RankingService } from './ranking.service';

function makeController(): {
  controller: RankingController;
  service: { findTop: jest.Mock };
} {
  const service = { findTop: jest.fn() };
  const controller = new RankingController(
    service as unknown as RankingService,
  );
  return { controller, service };
}

describe('RankingController', () => {
  it('passes district and limit to the service', async () => {
    const { controller, service } = makeController();
    const query = { district: 'จตุจักร', limit: 5 };

    await controller.findTop(query);

    expect(service.findTop).toHaveBeenCalledWith('จตุจักร', 5);
  });

  it('passes empty filters through to the service', async () => {
    const { controller, service } = makeController();

    await controller.findTop({ limit: 10 });

    expect(service.findTop).toHaveBeenCalledWith(undefined, 10);
  });
});
