import { BottlenecksController } from './bottlenecks.controller';
import { BottlenecksService } from './bottlenecks.service';

function makeController(): {
  controller: BottlenecksController;
  service: { findAll: jest.Mock };
} {
  const service = { findAll: jest.fn() };
  const controller = new BottlenecksController(
    service as unknown as BottlenecksService,
  );
  return { controller, service };
}

describe('BottlenecksController', () => {
  it('passes the district filter to the service', () => {
    const { controller, service } = makeController();

    controller.findAll({ district: 'ห้วยขวาง' });

    expect(service.findAll).toHaveBeenCalledWith('ห้วยขวาง');
  });
});
