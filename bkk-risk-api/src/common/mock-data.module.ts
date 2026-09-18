import { Global, Module } from '@nestjs/common';
import { MockDataService } from './mock-data.service';
import { KmlRiskPointSource } from './kml-risk-point-source.service';

@Global()
@Module({
  providers: [MockDataService, KmlRiskPointSource],
  exports: [MockDataService],
})
export class MockDataModule {}
