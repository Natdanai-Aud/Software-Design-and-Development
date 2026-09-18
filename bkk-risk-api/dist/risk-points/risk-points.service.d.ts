import { MockDataService } from '../common/mock-data.service';
import { RemediationService } from '../remediation/remediation.service';
export declare class RiskPointsService {
    private readonly mockData;
    private readonly remediationService;
    constructor(mockData: MockDataService, remediationService: RemediationService);
    findAll(district?: string, riskLevel?: string): {
        riskPointId: string;
        clusterRank: number;
        nameTh: string;
        district: string;
        road?: string;
        lat: number;
        lng: number;
        accidentCount: number;
        fatalities?: number;
        injuries?: number;
        riskLevel: import("../common/enums").RiskLevel;
        dataYearRange?: string;
    }[];
    findOne(riskPointId: string): {
        remediation: (import("../common/models").Remediation & {
            isDelayed: boolean;
        }) | null;
        riskPointId: string;
        clusterRank: number;
        nameTh: string;
        district: string;
        road?: string;
        lat: number;
        lng: number;
        accidentCount: number;
        fatalities?: number;
        injuries?: number;
        riskLevel: import("../common/enums").RiskLevel;
        dataYearRange?: string;
        causes: import("../common/models").SourcedNote[];
        solutions: import("../common/models").SourcedNote[];
    };
}
