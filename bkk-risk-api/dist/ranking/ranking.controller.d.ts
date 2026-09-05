import { RankingQueryDto } from './dto/ranking-query.dto';
import { RankingService } from './ranking.service';
export declare class RankingController {
    private readonly service;
    constructor(service: RankingService);
    findTop(query: RankingQueryDto): {
        rankedAt: string;
        items: import("../common/models").RankingEntry[];
    };
}
