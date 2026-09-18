import { FindBottlenecksDto } from './dto/find-bottlenecks.dto';
import { BottlenecksService } from './bottlenecks.service';
export declare class BottlenecksController {
    private readonly service;
    constructor(service: BottlenecksService);
    findAll(query: FindBottlenecksDto): import("../common/models").Bottleneck[];
}
