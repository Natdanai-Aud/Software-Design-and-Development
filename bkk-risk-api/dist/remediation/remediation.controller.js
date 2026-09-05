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
exports.RemediationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const find_remediations_dto_1 = require("./dto/find-remediations.dto");
const remediation_service_1 = require("./remediation.service");
let RemediationController = class RemediationController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll(query) {
        return this.service.findAll(query.district, query.status, query.delayed);
    }
};
exports.RemediationController = RemediationController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'ติดตามสถานะการแก้ไขของทุกจุดเสี่ยง' }),
    (0, swagger_1.ApiQuery)({ name: 'district', required: false, example: 'จตุจักร' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] }),
    (0, swagger_1.ApiQuery)({ name: 'delayed', required: false, type: Boolean, example: true }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_remediations_dto_1.FindRemediationsDto]),
    __metadata("design:returntype", void 0)
], RemediationController.prototype, "findAll", null);
exports.RemediationController = RemediationController = __decorate([
    (0, swagger_1.ApiTags)('remediation'),
    (0, common_1.Controller)('remediations'),
    __metadata("design:paramtypes", [remediation_service_1.RemediationService])
], RemediationController);
//# sourceMappingURL=remediation.controller.js.map