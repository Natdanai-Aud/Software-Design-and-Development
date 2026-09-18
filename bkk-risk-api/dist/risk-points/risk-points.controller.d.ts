import { FindRiskPointsDto } from './dto/find-risk-points.dto';
import { RiskPointsService } from './risk-points.service';
export declare class RiskPointsController {
    private readonly service;
    constructor(service: RiskPointsService);
    findAll(query: FindRiskPointsDto): {
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
