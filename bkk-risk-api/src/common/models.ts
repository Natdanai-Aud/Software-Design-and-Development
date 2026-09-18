import {
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
  /** สภาพเส้นทางข้ามจากชุดข้อมูล crosswalk_50 (ปกติ / ต้องปรับปรุง / ... ) */
  crossMarking: string | null;
  /** ประเภททางข้าม เช่น Thermo */
  cType: string | null;
  /** จำนวนช่องจราจร */
  numLane: number | null;
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
