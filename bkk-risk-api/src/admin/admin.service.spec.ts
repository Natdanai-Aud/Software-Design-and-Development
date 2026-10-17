import { AdminService } from './admin.service';
import { ImportSource } from './import-source.enum';
import { RankingService } from '../ranking/ranking.service';
import { RemediationService } from '../remediation/remediation.service';

function makeService(): {
  service: AdminService;
  rankingService: { rebuild: jest.Mock };
  remediationService: { update: jest.Mock };
} {
  const rankingService = { rebuild: jest.fn() };
  const remediationService = { update: jest.fn() };
  const service = new AdminService(
    rankingService as unknown as RankingService,
    remediationService as unknown as RemediationService,
  );
  return { service, rankingService, remediationService };
}

describe('AdminService', () => {
  it('creates a mock import result from the dto source', () => {
    const { service } = makeService();

    const result = service.createImport({ source: ImportSource.THAIRSC });

    expect(result.source).toBe(ImportSource.THAIRSC);
    expect(result.totalRows).toBe(100);
    expect(result.cleanedRows).toBe(97);
    expect(result.rejectedRows).toBe(3);
    expect(result.startedAt).toBeDefined();
    expect(result.finishedAt).toBeDefined();
  });

  it('delegates ranking rebuilds to the ranking service', async () => {
    const rebuilt = { total: 2, data: [] };
    const { service, rankingService } = makeService();
    rankingService.rebuild.mockResolvedValue(rebuilt);

    await expect(service.rebuildRanking()).resolves.toBe(rebuilt);
    expect(rankingService.rebuild).toHaveBeenCalledTimes(1);
  });

  it('delegates remediation updates to the remediation service', () => {
    const updated = { remediationId: 'RM-001' };
    const { service, remediationService } = makeService();
    remediationService.update.mockReturnValue(updated);
    const dto = { note: 'ติดตามงาน' };

    expect(service.updateRemediation('RM-001', dto)).toBe(updated);
    expect(remediationService.update).toHaveBeenCalledWith('RM-001', dto);
  });
});
