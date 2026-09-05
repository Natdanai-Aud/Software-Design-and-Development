import { Bottleneck, RankingEntry, Remediation, RiskPoint } from './models';
export declare class MockDataService {
    private readonly _riskPoints;
    private readonly _remediations;
    private readonly _bottlenecks;
    private _ranking;
    private _rankedAt;
    get riskPoints(): RiskPoint[];
    get remediations(): Remediation[];
    get bottlenecks(): Bottleneck[];
    get ranking(): RankingEntry[];
    get rankedAt(): string;
    replaceRanking(items: RankingEntry[], rankedAt?: string): void;
}
