"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockAdminGuard = void 0;
const common_1 = require("@nestjs/common");
let MockAdminGuard = class MockAdminGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const auth = request.headers.authorization;
        if (!auth?.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('กรุณาเข้าสู่ระบบก่อนใช้งาน');
        }
        const token = auth.substring('Bearer '.length).trim();
        const expected = process.env.ADMIN_MOCK_TOKEN ?? 'mock-admin-token';
        if (!token || token !== expected) {
            throw new common_1.UnauthorizedException('โทเคนไม่ถูกต้องหรือหมดอายุ');
        }
        return true;
    }
};
exports.MockAdminGuard = MockAdminGuard;
exports.MockAdminGuard = MockAdminGuard = __decorate([
    (0, common_1.Injectable)()
], MockAdminGuard);
//# sourceMappingURL=mock-admin.guard.js.map