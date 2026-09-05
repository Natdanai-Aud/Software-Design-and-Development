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
exports.BottlenecksService = void 0;
const common_1 = require("@nestjs/common");
const mock_data_service_1 = require("../common/mock-data.service");
let BottlenecksService = class BottlenecksService {
    mockData;
    constructor(mockData) {
        this.mockData = mockData;
    }
    distanceKm(lat1, lng1, lat2, lng2) {
        const R = 6371;
        const toRad = (deg) => (deg * Math.PI) / 180;
        const dLat = toRad(lat2 - lat1);
        const dLng = toRad(lng2 - lng1);
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) *
                Math.cos(toRad(lat2)) *
                Math.sin(dLng / 2) ** 2;
        return 2 * R * Math.asin(Math.sqrt(a));
    }
    findAll(district, congestionLevel, lat, lng, radiusKm = 5) {
        const hasLat = lat !== undefined;
        const hasLng = lng !== undefined;
        if (hasLat !== hasLng) {
            throw new common_1.BadRequestException('ต้องส่ง lng มาคู่กับ lat เสมอ');
        }
        return this.mockData.bottlenecks
            .filter((item) => !district || item.district === district)
            .filter((item) => !congestionLevel ||
            item.congestionLevel === congestionLevel)
            .filter((item) => {
            if (lat === undefined || lng === undefined)
                return true;
            return this.distanceKm(lat, lng, item.lat, item.lng) <= radiusKm;
        });
    }
};
exports.BottlenecksService = BottlenecksService;
exports.BottlenecksService = BottlenecksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mock_data_service_1.MockDataService])
], BottlenecksService);
//# sourceMappingURL=bottlenecks.service.js.map