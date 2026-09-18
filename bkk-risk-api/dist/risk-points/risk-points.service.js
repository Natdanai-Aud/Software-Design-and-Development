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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskPointsService = void 0;
const common_1 = require("@nestjs/common");
const mock_data_service_1 = require("../common/mock-data.service");
const remediation_service_1 = require("../remediation/remediation.service");
let RiskPointsService = class RiskPointsService {
    mockData;
    remediationService;
    constructor(mockData, remediationService) {
        this.mockData = mockData;
        this.remediationService = remediationService;
    }
    findAll(district, riskLevel) {
        return this.mockData.riskPoints
            .filter((point) => !district || point.district === district)
            .filter((point) => !riskLevel || point.riskLevel === riskLevel)
            .map(({ causes, solutions, ...point }) => point);
    }
    findOne(riskPointId) {
        const point = this.mockData.riskPoints.find((item) => item.riskPointId === riskPointId);
        if (!point) {
            throw new common_1.NotFoundException(`ไม่พบจุดเสี่ยงรหัส ${riskPointId}`);
        }
        return {
            ...point,
            remediation: this.remediationService.findLatestByRiskPointId(riskPointId) ?? null,
        };
    }
};
exports.RiskPointsService = RiskPointsService;
exports.RiskPointsService = RiskPointsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mock_data_service_1.MockDataService,
        remediation_service_1.RemediationService])
], RiskPointsService);
//# sourceMappingURL=risk-points.service.js.map