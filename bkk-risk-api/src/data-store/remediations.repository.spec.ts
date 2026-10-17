import { RemediationsRepository } from './remediations.repository';
import { Remediation } from '../remediation/remediation.model';
import { RemediationStatus } from '../remediation/remediation-status.enum';

function makeRemediation(
  overrides: Partial<Remediation> = {},
): Remediation {
  return {
    remediationId: 'RM-001',
    riskPointId: 'RP-001',
    status: RemediationStatus.PENDING,
    updatedAt: '2568-01-01',
    ...overrides,
  };
}

describe('RemediationsRepository', () => {
  it('starts empty', () => {
    expect(new RemediationsRepository().findAll()).toEqual([]);
  });

  it('replaces all items and returns a copy from findAll', () => {
    const repo = new RemediationsRepository();
    const items = [makeRemediation(), makeRemediation({ remediationId: 'RM-002' })];

    repo.replaceAll(items);

    const found = repo.findAll();
    expect(found).toEqual(items);
    expect(found).not.toBe(items);
    found.pop();
    expect(repo.findAll()).toHaveLength(2);
  });

  it('finds an item by id and misses unknown ids', () => {
    const repo = new RemediationsRepository();
    repo.replaceAll([makeRemediation()]);

    expect(repo.findById('RM-001')?.riskPointId).toBe('RP-001');
    expect(repo.findById('RM-999')).toBeUndefined();
  });

  it('updates the stored record in place', () => {
    const repo = new RemediationsRepository();
    repo.replaceAll([makeRemediation()]);

    const updated = repo.update('RM-001', {
      status: RemediationStatus.IN_PROGRESS,
      note: 'เริ่มดำเนินการ',
    });

    expect(updated?.status).toBe(RemediationStatus.IN_PROGRESS);
    expect(repo.findById('RM-001')?.note).toBe('เริ่มดำเนินการ');
  });

  it('returns undefined when updating an unknown id', () => {
    const repo = new RemediationsRepository();
    repo.replaceAll([makeRemediation()]);

    expect(repo.update('RM-999', { status: RemediationStatus.COMPLETED })).toBeUndefined();
    expect(repo.findAll()).toHaveLength(1);
  });
});
