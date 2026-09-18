import { RemediationStatus } from '../../common/enums';
export declare class FindRemediationsDto {
    district?: string;
    status?: RemediationStatus;
    delayed?: boolean;
}
