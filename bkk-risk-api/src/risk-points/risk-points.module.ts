import { Module } from '@nestjs/common';
import { RiskPointsController } from './risk-points.controller';
import { RiskPointsService } from './risk-points.service';

@Module({
  controllers: [RiskPointsController],
  providers: [RiskPointsService],
  exports: [RiskPointsService],
})
export class RiskPointsModule {}
