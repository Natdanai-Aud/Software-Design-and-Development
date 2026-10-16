import { RemediationStatus } from './remediation-status.enum';

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
