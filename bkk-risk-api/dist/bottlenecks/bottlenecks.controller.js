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
exports.BottlenecksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const find_bottlenecks_dto_1 = require("./dto/find-bottlenecks.dto");
const bottlenecks_service_1 = require("./bottlenecks.service");
let BottlenecksController = class BottlenecksController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll(query) {
        return this.service.findAll(query.district, query.congestionLevel, query.lat, query.lng, query.radiusKm);
    }
};
exports.BottlenecksController = BottlenecksController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'ค้นหาจุดคอขวดจราจร' }),
    (0, swagger_1.ApiQuery)({ name: 'district', required: false, example: 'จตุจักร' }),
    (0, swagger_1.ApiQuery)({ name: 'congestionLevel', required: false, enum: ['NORMAL', 'CONGESTED', 'BLOCKED'] }),
    (0, swagger_1.ApiQuery)({ name: 'lat', required: false, type: Number, example: 13.7563 }),
    (0, swagger_1.ApiQuery)({ name: 'lng', required: false, type: Number, example: 100.5018 }),
    (0, swagger_1.ApiQuery)({ name: 'radiusKm', required: false, type: Number, default: 5, maximum: 50 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_bottlenecks_dto_1.FindBottlenecksDto]),
    __metadata("design:returntype", void 0)
], BottlenecksController.prototype, "findAll", null);
exports.BottlenecksController = BottlenecksController = __decorate([
    (0, swagger_1.ApiTags)('bottlenecks'),
    (0, common_1.Controller)('bottlenecks'),
    __metadata("design:paramtypes", [bottlenecks_service_1.BottlenecksService])
], BottlenecksController);
//# sourceMappingURL=bottlenecks.controller.js.map