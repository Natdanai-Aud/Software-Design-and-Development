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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const mock_admin_guard_1 = require("../common/guards/mock-admin.guard");
const create_import_dto_1 = require("./dto/create-import.dto");
const update_remediation_dto_1 = require("../remediation/dto/update-remediation.dto");
const admin_service_1 = require("./admin.service");
const remediation_service_1 = require("../remediation/remediation.service");
let AdminController = class AdminController {
    adminService;
    remediationService;
    constructor(adminService, remediationService) {
        this.adminService = adminService;
        this.remediationService = remediationService;
    }
    createImport(dto) {
        return this.adminService.createImport(dto);
    }
    rebuildRanking() {
        return this.adminService.rebuildRanking();
    }
    updateRemediation(remediationId, dto) {
        return this.remediationService.update(remediationId, dto);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)('imports'),
    (0, swagger_1.ApiOperation)({ summary: 'นำเข้าข้อมูลดิบและทำความสะอาดข้อมูล (เจ้าหน้าที่)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_import_dto_1.CreateImportDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createImport", null);
__decorate([
    (0, common_1.Post)('ranking/rebuild'),
    (0, swagger_1.ApiOperation)({ summary: 'สั่งคำนวณอันดับความเสี่ยงใหม่ (เจ้าหน้าที่)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "rebuildRanking", null);
__decorate([
    (0, common_1.Patch)('remediations/:remediationId'),
    (0, swagger_1.ApiOperation)({ summary: 'อัปเดตสถานะงานแก้ไข (เจ้าหน้าที่)' }),
    (0, swagger_1.ApiParam)({ name: 'remediationId', example: 'RM-001' }),
    __param(0, (0, common_1.Param)('remediationId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_remediation_dto_1.UpdateRemediationDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateRemediation", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, swagger_1.ApiBearerAuth)('bearerAuth'),
    (0, common_1.UseGuards)(mock_admin_guard_1.MockAdminGuard),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        remediation_service_1.RemediationService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map