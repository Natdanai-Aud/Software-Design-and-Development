import { Injectable, NotFoundException } from '@nestjs/common';
import { RemediationsRepository } from '../data-store/remediations.repository';
import { RiskPointsRepository } from '../data-store/risk-points.repository';
import { omit } from '../shared/omit';
import { Remediation } from './remediation.model';
import { RemediationStatus } from './remediation-status.enum';
import { UpdateRemediationDto } from './dto/update-remediation.dto';

@Injectable()
export class RemediationService {
  constructor(
    private readonly remediationsRepository: RemediationsRepository,
    private readonly riskPointsRepository: RiskPointsRepository,
  ) {}

  private toPublicResponse(
    item: Remediation,
  ): Omit<Remediation, 'startedAt' | 'dueAt'> {
    return omit(item, ['startedAt', 'dueAt']);
  }

  findAll(district?: string, status?: RemediationStatus) {
    return this.remediationsRepository
      .findAll()
      .filter((item) => {
        if (!district) return true;
        const point = this.riskPointsRepository.findById(item.riskPointId);
        return point?.district === district;
      })
      .filter((item) => !status || item.status === status)
      .map((item) => this.toPublicResponse(item));
  }

  update(remediationId: string, dto: UpdateRemediationDto) {
    const updated = this.remediationsRepository.update(remediationId, {
      ...(dto.status !== undefined ? { status: dto.status } : {}),
      ...(dto.dueAt !== undefined ? { dueAt: dto.dueAt } : {}),
      ...(dto.completedAt !== undefined
        ? { completedAt: dto.completedAt }
        : {}),
      ...(dto.note !== undefined ? { note: dto.note } : {}),
      updatedAt: new Date().toISOString(),
    });

    if (!updated) {
      throw new NotFoundException(`ไม่พบงานแก้ไขรหัส ${remediationId}`);
    }

    return this.toPublicResponse(updated);
  }
}
