import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ImportSource } from './import-source.enum';

function makeController(): {
  controller: AdminController;
  adminService: {
    createImport: jest.Mock;
    rebuildRanking: jest.Mock;
    updateRemediation: jest.Mock;
  };
} {
  const adminService = {
    createImport: jest.fn(),
    rebuildRanking: jest.fn(),
    updateRemediation: jest.fn(),
  };
  const controller = new AdminController(
    adminService as unknown as AdminService,
  );
  return { controller, adminService };
}

describe('AdminController', () => {
  it('delegates import creation to the admin service', () => {
    const { controller, adminService } = makeController();
    const dto = { source: ImportSource.BMA_OPEN_DATA };

    controller.createImport(dto);

    expect(adminService.createImport).toHaveBeenCalledWith(dto);
  });

  it('delegates ranking rebuilds to the admin service', () => {
    const { controller, adminService } = makeController();

    controller.rebuildRanking();

    expect(adminService.rebuildRanking).toHaveBeenCalledTimes(1);
  });

  it('delegates remediation updates to the admin service', () => {
    const { controller, adminService } = makeController();
    const dto = { note: 'ติดตามงาน' };

    controller.updateRemediation('RM-001', dto);

    expect(adminService.updateRemediation).toHaveBeenCalledWith('RM-001', dto);
  });
});
