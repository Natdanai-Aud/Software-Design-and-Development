export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum RemediationStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum CongestionLevel {
  NORMAL = 'NORMAL',
  CONGESTED = 'CONGESTED',
  BLOCKED = 'BLOCKED',
}

export enum ImportSource {
  THAIRSC = 'THAIRSC',
  ITIC = 'ITIC',
  BMA_OPEN_DATA = 'BMA_OPEN_DATA',
}
