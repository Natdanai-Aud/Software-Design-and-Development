import { RemediationStatus } from '../../common/enums';
export declare class UpdateRemediationDto {
    status?: RemediationStatus;
    dueAt?: string | null;
    completedAt?: string | null;
    note?: string | null;
}
