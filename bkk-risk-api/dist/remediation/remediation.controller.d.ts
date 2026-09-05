import { FindRemediationsDto } from './dto/find-remediations.dto';
import { RemediationService } from './remediation.service';
export declare class RemediationController {
    private readonly service;
    constructor(service: RemediationService);
    findAll(query: FindRemediationsDto): (import("../common/models").Remediation & {
        isDelayed: boolean;
    })[];
}
