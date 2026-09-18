import { MockDataService } from '../common/mock-data.service';
import { RankingEntry, RankingResult } from '../common/models';
export declare class RankingService {
    private readonly mockData;
    constructor(mockData: MockDataService);
    findTop(district?: string, limit?: number): {
        rankedAt: string;
        items: RankingEntry[];
    };
    rebuild(): RankingResult;
    seedInitialRanking(): void;
}
