import {
  CongestionLevel,
  ImportSource,
  RemediationStatus,
  RiskLevel,
} from './enums';

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

export interface Remediation {
  remediationId: string;
  riskPointId: string;
  status: RemediationStatus;
  responsibleAgency?: string;
  startedAt?: string | null;
  dueAt?: string | null;
  completedAt?: string | null;
  note?: string | null;
  updatedAt: string;
}

export interface RankingEntry {
  rank: number;
  riskPointId: string;
  nameTh: string;
  district?: string;
  riskScore: number;
  accidentCount?: number;
  fatalities?: number;
}

export interface Bottleneck {
  bottleneckId: string;
  nameTh: string;
  district: string;
  road?: string;
  lat: number;
  lng: number;
  congestionLevel: CongestionLevel;
  avgSpeedKmh?: number;
  observedAt: string;
}

export interface ImportResult {
  source: ImportSource;
  totalRows: number;
  cleanedRows: number;
  rejectedRows: number;
  startedAt: string;
  finishedAt: string;
}

export interface RankingResult {
  rankedAt: string;
  pointsProcessed: number;
}
