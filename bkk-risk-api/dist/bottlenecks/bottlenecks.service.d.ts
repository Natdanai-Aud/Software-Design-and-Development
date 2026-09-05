import { MockDataService } from '../common/mock-data.service';
import { Bottleneck } from '../common/models';
export declare class BottlenecksService {
    private readonly mockData;
    constructor(mockData: MockDataService);
    private distanceKm;
    findAll(district?: string, congestionLevel?: string, lat?: number, lng?: number, radiusKm?: number): Bottleneck[];
}
