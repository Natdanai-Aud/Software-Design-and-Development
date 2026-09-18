import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { BottlenecksModule } from './bottlenecks/bottlenecks.module';
import { MockDataModule } from './common/mock-data.module';
import { RankingModule } from './ranking/ranking.module';
import { RemediationModule } from './remediation/remediation.module';
import { RiskPointsModule } from './risk-points/risk-points.module';

@Module({
  imports: [
    MockDataModule,
    RankingModule,
    RiskPointsModule,
    RemediationModule,
    BottlenecksModule,
    AdminModule,
  ],
})
export class AppModule {}
