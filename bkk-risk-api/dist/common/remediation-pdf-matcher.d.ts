import { Remediation, RiskPoint } from './models';
import { RemediationPdfDetails } from '../data/remediation-pdf-details';
export declare function matchRiskPointByCoordinates(lat: number, lng: number, riskPoints: RiskPoint[]): RiskPoint | null;
export declare function buildRemediationsFromPdfDetails(details: RemediationPdfDetails[], riskPoints: RiskPoint[]): Remediation[];
