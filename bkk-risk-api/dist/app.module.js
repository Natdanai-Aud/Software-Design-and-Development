"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const admin_module_1 = require("./admin/admin.module");
const bottlenecks_module_1 = require("./bottlenecks/bottlenecks.module");
const mock_data_module_1 = require("./common/mock-data.module");
const ranking_module_1 = require("./ranking/ranking.module");
const remediation_module_1 = require("./remediation/remediation.module");
const risk_points_module_1 = require("./risk-points/risk-points.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mock_data_module_1.MockDataModule,
            ranking_module_1.RankingModule,
            risk_points_module_1.RiskPointsModule,
            remediation_module_1.RemediationModule,
            bottlenecks_module_1.BottlenecksModule,
            admin_module_1.AdminModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map