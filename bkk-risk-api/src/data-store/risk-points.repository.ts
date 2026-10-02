import { Injectable } from '@nestjs/common';
import { RiskPoint } from '../risk-points/risk-point.model';

@Injectable()
export class RiskPointsRepository {
  private points: RiskPoint[] = [];

  replaceAll(points: RiskPoint[]): void {
    this.points = points;
  }

  findAll(): RiskPoint[] {
    return this.points;
  }

  findById(riskPointId: string): RiskPoint | undefined {
    return this.points.find((point) => point.riskPointId === riskPointId);
  }
}
