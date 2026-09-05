import { CreateImportDto } from './dto/create-import.dto';
import { UpdateRemediationDto } from '../remediation/dto/update-remediation.dto';
import { AdminService } from './admin.service';
import { RemediationService } from '../remediation/remediation.service';
export declare class AdminController {
    private readonly adminService;
    private readonly remediationService;
    constructor(adminService: AdminService, remediationService: RemediationService);
    createImport(dto: CreateImportDto): import("../common/models").ImportResult;
    rebuildRanking(): import("../common/models").RankingResult;
    updateRemediation(remediationId: string, dto: UpdateRemediationDto): import("../common/models").Remediation & {
        isDelayed: boolean;
    };
}
