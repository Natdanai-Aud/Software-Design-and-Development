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
exports.RiskPointsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const find_risk_points_dto_1 = require("./dto/find-risk-points.dto");
const risk_points_service_1 = require("./risk-points.service");
let RiskPointsController = class RiskPointsController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll(query) {
        return this.service.findAll(query.district, query.riskLevel);
    }
    findOne(riskPointId) {
        return this.service.findOne(riskPointId);
    }
};
exports.RiskPointsController = RiskPointsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'ค้นหาจุดเสี่ยงอุบัติเหตุสำหรับแสดงบนแผนที่' }),
    (0, swagger_1.ApiQuery)({ name: 'district', required: false, example: 'จตุจักร' }),
    (0, swagger_1.ApiQuery)({ name: 'riskLevel', required: false, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_risk_points_dto_1.FindRiskPointsDto]),
    __metadata("design:returntype", void 0)
], RiskPointsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':riskPointId'),
    (0, swagger_1.ApiOperation)({ summary: 'ดูรายละเอียดจุดเสี่ยง พร้อมสาเหตุและแนวทางแก้ไข' }),
    (0, swagger_1.ApiParam)({ name: 'riskPointId', example: 'RP-001' }),
    (0, swagger_1.ApiResponse)({ status: 200 }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Not Found' }),
    __param(0, (0, common_1.Param)('riskPointId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RiskPointsController.prototype, "findOne", null);
exports.RiskPointsController = RiskPointsController = __decorate([
    (0, swagger_1.ApiTags)('risk-points'),
    (0, common_1.Controller)('risk-points'),
    __metadata("design:paramtypes", [risk_points_service_1.RiskPointsService])
], RiskPointsController);
//# sourceMappingURL=risk-points.controller.js.map