"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskPointsModule = void 0;
const common_1 = require("@nestjs/common");
const remediation_module_1 = require("../remediation/remediation.module");
const risk_points_controller_1 = require("./risk-points.controller");
const risk_points_service_1 = require("./risk-points.service");
let RiskPointsModule = class RiskPointsModule {
};
exports.RiskPointsModule = RiskPointsModule;
exports.RiskPointsModule = RiskPointsModule = __decorate([
    (0, common_1.Module)({
        imports: [remediation_module_1.RemediationModule],
        controllers: [risk_points_controller_1.RiskPointsController],
        providers: [risk_points_service_1.RiskPointsService],
        exports: [risk_points_service_1.RiskPointsService],
    })
], RiskPointsModule);
//# sourceMappingURL=risk-points.module.js.map