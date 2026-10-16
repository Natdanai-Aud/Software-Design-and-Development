import { Injectable, NotFoundException } from '@nestjs/common';
import { RiskPointsRepository } from '../data-store/risk-points.repository';
import { omit } from '../shared/omit';
import { RiskLevel } from './risk-level.enum';

@Injectable()
export class RiskPointsService {
  constructor(private readonly riskPointsRepository: RiskPointsRepository) {}

  findAll(district?: string, riskLevel?: RiskLevel) {
    return this.riskPointsRepository
      .findAll()
      .filter((point) => !district || point.district === district)
      .filter((point) => !riskLevel || point.riskLevel === riskLevel)
      .map((point) => omit(point, ['causes', 'solutions']));
  }

  findOne(riskPointId: string) {
    const point = this.riskPointsRepository.findById(riskPointId);

    if (!point) {
      throw new NotFoundException(`ไม่พบจุดเสี่ยงรหัส ${riskPointId}`);
    }

    return { ...point };
  }
}
