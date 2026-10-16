import { Injectable, OnModuleInit } from '@nestjs/common';
import { KmlRiskPointSource } from '../risk-points/kml-risk-point.source';
import { seedRiskPoints } from '../risk-points/risk-point.seed';
import { withPdfDetails } from '../data/risk-point-pdf-details';
import { remediationPdfDetails } from '../data/remediation-pdf-details';
import { buildRemediationsFromPdfDetails } from '../remediation/remediation-pdf-matcher';
import { RiskPointsRepository } from './risk-points.repository';
import { RemediationsRepository } from './remediations.repository';

/**
 * Populates the two in-memory repositories: seeded/fallback risk points at
 * construction time (so the repositories are never empty), then real KML
 * risk points once `onModuleInit` resolves, if the fetch succeeds. This
 * mirrors the original MockDataService's constructor + onModuleInit split.
 */
@Injectable()
export class DataBootstrapService implements OnModuleInit {
  constructor(
    private readonly riskPointsRepository: RiskPointsRepository,
    private readonly remediationsRepository: RemediationsRepository,
    private readonly kmlRiskPointSource: KmlRiskPointSource,
  ) {
    this.loadSeed();
  }

  async onModuleInit() {
    const fetched = await this.kmlRiskPointSource.fetchRiskPoints();

    if (fetched && fetched.length > 0) {
      this.riskPointsRepository.replaceAll(withPdfDetails(fetched));
      this.rebuildRemediations();
    }
  }

  private loadSeed(): void {
    this.riskPointsRepository.replaceAll(withPdfDetails(seedRiskPoints()));
    this.rebuildRemediations();
  }

  private rebuildRemediations(): void {
    this.remediationsRepository.replaceAll(
      buildRemediationsFromPdfDetails(
        remediationPdfDetails,
        this.riskPointsRepository.findAll(),
      ),
    );
  }
}
