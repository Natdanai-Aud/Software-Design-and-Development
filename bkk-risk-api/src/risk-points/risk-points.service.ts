import { Injectable, NotFoundException } from '@nestjs/common';
import { MockDataService } from '../common/mock-data.service';
import { RemediationService } from '../remediation/remediation.service';

@Injectable()
export class RiskPointsService {
  constructor(
    private readonly mockData: MockDataService,
    private readonly remediationService: RemediationService,
  ) {}

  findAll(district?: string, riskLevel?: string) {
    return this.mockData.riskPoints
      .filter((point) => !district || point.district === district)
      .filter((point) => !riskLevel || point.riskLevel === riskLevel)
      .map(({ causes, solutions, ...point }) => point);
  }

  findOne(riskPointId: string) {
    const point = this.mockData.riskPoints.find(
      (item) => item.riskPointId === riskPointId,
    );

    if (!point) {
      throw new NotFoundException(`ไม่พบจุดเสี่ยงรหัส ${riskPointId}`);
    }

    return {
      ...point,
    };
  }
}
