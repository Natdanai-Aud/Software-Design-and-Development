import { RiskLevel } from './risk-level.enum';

export interface SourcedNote {
  description: string;
  sourceDocument: string;
}

export interface RiskPoint {
  riskPointId: string;
  clusterRank: number;
  nameTh: string;
  district: string;
  road?: string;
  lat: number;
  lng: number;
  accidentCount: number;
  fatalities?: number;
  injuries?: number;
  riskLevel: RiskLevel;
  dataYearRange?: string;
  causes: SourcedNote[];
  solutions: SourcedNote[];
}
