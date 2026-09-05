"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ranking_query_dto_1 = require("./dto/ranking-query.dto");
const ranking_service_1 = require("./ranking.service");
let RankingController = class RankingController {
    service;
    constructor(service) {
        this.service = service;
        this.service.seedInitialRanking();
    }
    findTop(query) {
        return this.service.findTop(query.district, query.limit);
    }
};
exports.RankingController = RankingController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'ดูอันดับจุดเสี่ยง (ค่าเริ่มต้น Top 10)' }),
    (0, swagger_1.ApiQuery)({ name: 'district', required: false, example: 'จตุจักร' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, default: 10, minimum: 1, maximum: 100 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ranking_query_dto_1.RankingQueryDto]),
    __metadata("design:returntype", void 0)
], RankingController.prototype, "findTop", null);
exports.RankingController = RankingController = __decorate([
    (0, swagger_1.ApiTags)('ranking'),
    (0, common_1.Controller)('risk-points/ranking'),
    __metadata("design:paramtypes", [ranking_service_1.RankingService])
], RankingController);
//# sourceMappingURL=ranking.controller.js.map