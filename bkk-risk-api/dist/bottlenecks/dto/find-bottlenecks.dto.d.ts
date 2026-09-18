import { CongestionLevel } from '../../common/enums';
export declare class FindBottlenecksDto {
    district?: string;
    congestionLevel?: CongestionLevel;
    lat?: number;
    lng?: number;
    radiusKm?: number;
}
