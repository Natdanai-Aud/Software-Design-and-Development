import { ImportResult } from '../common/models';
import { CreateImportDto } from './dto/create-import.dto';
import { RankingService } from '../ranking/ranking.service';
export declare class AdminService {
    private readonly rankingService;
    constructor(rankingService: RankingService);
    createImport(dto: CreateImportDto): ImportResult;
    rebuildRanking(): import("../common/models").RankingResult;
}
