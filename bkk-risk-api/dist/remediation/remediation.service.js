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
exports.RemediationService = void 0;
const common_1 = require("@nestjs/common");
const mock_data_service_1 = require("../common/mock-data.service");
const enums_1 = require("../common/enums");
let RemediationService = class RemediationService {
    mockData;
    constructor(mockData) {
        this.mockData = mockData;
    }
    todayDateString() {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }
    isDelayed(item) {
        const today = this.todayDateString();
        return (item.status !== enums_1.RemediationStatus.COMPLETED &&
            !!item.dueAt &&
            item.dueAt < today);
    }
    withComputedStatus(item) {
        return {
            ...item,
            isDelayed: this.isDelayed(item),
        };
    }
    findLatestByRiskPointId(riskPointId) {
        const items = this.mockData.remediations
            .filter((item) => item.riskPointId === riskPointId)
            .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
        return items.length ? this.withComputedStatus(items[0]) : null;
    }
    findAll(district, status, delayed) {
        const riskPointsById = new Map(this.mockData.riskPoints.map((point) => [point.riskPointId, point]));
        const result = this.mockData.remediations
            .map((item) => this.withComputedStatus(item))
            .filter((item) => {
            if (!district)
                return true;
            const point = riskPointsById.get(item.riskPointId);
            return point?.district === district;
        })
            .filter((item) => !status || item.status === status)
            .filter((item) => delayed !== true || item.isDelayed);
        return result;
    }
    update(remediationId, dto) {
        const item = this.mockData.remediations.find((entry) => entry.remediationId === remediationId);
        if (!item) {
            throw new common_1.NotFoundException(`ไม่พบงานแก้ไขรหัส ${remediationId}`);
        }
        Object.assign(item, {
            ...(dto.status !== undefined ? { status: dto.status } : {}),
            ...(dto.dueAt !== undefined ? { dueAt: dto.dueAt } : {}),
            ...(dto.completedAt !== undefined
                ? { completedAt: dto.completedAt }
                : {}),
            ...(dto.note !== undefined ? { note: dto.note } : {}),
            updatedAt: new Date().toISOString(),
        });
        return this.withComputedStatus(item);
    }
};
exports.RemediationService = RemediationService;
exports.RemediationService = RemediationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mock_data_service_1.MockDataService])
], RemediationService);
//# sourceMappingURL=remediation.service.js.map