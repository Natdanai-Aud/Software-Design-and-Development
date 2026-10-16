import { Global, Module } from '@nestjs/common';
import { KmlRiskPointSource } from '../risk-points/kml-risk-point.source';
import { RiskPointsRepository } from './risk-points.repository';
import { RemediationsRepository } from './remediations.repository';
import { DataBootstrapService } from './data-bootstrap.service';

@Global()
@Module({
  providers: [
    RiskPointsRepository,
    RemediationsRepository,
    KmlRiskPointSource,
    DataBootstrapService,
  ],
  exports: [RiskPointsRepository, RemediationsRepository],
})
export class DataStoreModule {}
