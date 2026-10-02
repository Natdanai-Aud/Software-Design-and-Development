import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { BottlenecksModule } from './bottlenecks/bottlenecks.module';
import { DataStoreModule } from './data-store/data-store.module';
import { RankingModule } from './ranking/ranking.module';
import { RemediationModule } from './remediation/remediation.module';
import { RiskPointsModule } from './risk-points/risk-points.module';

@Module({
  imports: [
    DataStoreModule,
    // RankingModule must come before RiskPointsModule: Nest maps routes in
    // import order, and RiskPointsController's `GET /risk-points/:riskPointId`
    // would otherwise shadow `GET /risk-points/ranking`. Locked by the
    // "ranking route is not shadowed" case in test/app.e2e-spec.ts.
    RankingModule,
    RiskPointsModule,
    RemediationModule,
    BottlenecksModule,
    AdminModule,
  ],
})
export class AppModule {}
