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

  private toPublicResponse(
    item: Remediation,
  ): Omit<Remediation, 'startedAt' | 'dueAt'> {
    const { startedAt, dueAt, ...rest } = item;
    return rest;
  }

  findLatestByRiskPointId(riskPointId: string) {
    const items = this.mockData.remediations
      .filter((item) => item.riskPointId === riskPointId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

    return items.length ? this.toPublicResponse(items[0]) : null;
  }

  findAll(district?: string, status?: RemediationStatus) {
    const riskPointsById = new Map(
      this.mockData.riskPoints.map((point) => [point.riskPointId, point]),
    );

    const result = this.mockData.remediations
      .filter((item) => {
        if (!district) return true;
        const point = riskPointsById.get(item.riskPointId);
        return point?.district === district;
      })
      .filter((item) => !status || item.status === status)
      .map((item) => this.toPublicResponse(item));

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

    return this.toPublicResponse(item);
  }
}
