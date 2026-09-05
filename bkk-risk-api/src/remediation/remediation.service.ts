import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MockDataService } from '../common/mock-data.service';
import { Remediation, RiskPoint } from '../common/models';
import { RemediationStatus } from '../common/enums';
import { UpdateRemediationDto } from './dto/update-remediation.dto';

@Injectable()
export class RemediationService {
  constructor(private readonly mockData: MockDataService) {}

  private todayDateString(): string {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  isDelayed(item: Remediation): boolean {
    const today = this.todayDateString();
    return (
      item.status !== RemediationStatus.COMPLETED &&
      !!item.dueAt &&
      item.dueAt < today
    );
  }

  private withComputedStatus(item: Remediation): Remediation & { isDelayed: boolean } {
    return {
      ...item,
      isDelayed: this.isDelayed(item),
    };
  }

  findLatestByRiskPointId(riskPointId: string) {
    const items = this.mockData.remediations
      .filter((item) => item.riskPointId === riskPointId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

    return items.length ? this.withComputedStatus(items[0]) : null;
  }

  findAll(district?: string, status?: RemediationStatus, delayed?: boolean) {
    const riskPointsById = new Map(
      this.mockData.riskPoints.map((point) => [point.riskPointId, point]),
    );

    const result = this.mockData.remediations
      .map((item) => this.withComputedStatus(item))
      .filter((item) => {
        if (!district) return true;
        const point = riskPointsById.get(item.riskPointId);
        return point?.district === district;
      })
      .filter((item) => !status || item.status === status)
      .filter((item) => delayed !== true || item.isDelayed);

    return result;
  }

  update(remediationId: string, dto: UpdateRemediationDto) {
    const item = this.mockData.remediations.find(
      (entry) => entry.remediationId === remediationId,
    );

    if (!item) {
      throw new NotFoundException(`ไม่พบงานแก้ไขรหัส ${remediationId}`);
    }

    Object.assign(item, {
      ...(dto.status !== undefined ? { status: dto.status } : {}),
      ...(dto.dueAt !== undefined ? { dueAt: dto.dueAt } : {}),
      ...(dto.completedAt !== undefined
        ? { completedAt: dto.completedAt }
        : {}),
      ...(dto.note !== undefined ? { note: dto.note } : {}),
      updatedAt: new Date().toISOString(),
    });

    return this.withComputedStatus(item);
  }
}
