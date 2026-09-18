import { Module } from '@nestjs/common';
import { RemediationModule } from '../remediation/remediation.module';
import { RiskPointsController } from './risk-points.controller';
import { RiskPointsService } from './risk-points.service';

@Module({
  imports: [RemediationModule],
  controllers: [RiskPointsController],
  providers: [RiskPointsService],
  exports: [RiskPointsService],
})
export class RiskPointsModule {}
