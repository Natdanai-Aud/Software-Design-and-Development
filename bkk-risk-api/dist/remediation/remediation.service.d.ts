import { MockDataService } from '../common/mock-data.service';
import { Remediation } from '../common/models';
import { RemediationStatus } from '../common/enums';
import { UpdateRemediationDto } from './dto/update-remediation.dto';
export declare class RemediationService {
    private readonly mockData;
    constructor(mockData: MockDataService);
    private todayDateString;
    isDelayed(item: Remediation): boolean;
    private withComputedStatus;
    findLatestByRiskPointId(riskPointId: string): (Remediation & {
        isDelayed: boolean;
    }) | null;
    findAll(district?: string, status?: RemediationStatus, delayed?: boolean): (Remediation & {
        isDelayed: boolean;
    })[];
    update(remediationId: string, dto: UpdateRemediationDto): Remediation & {
        isDelayed: boolean;
    };
}
