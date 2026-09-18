import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class MockAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const auth = request.headers.authorization;

    if (!auth?.startsWith('Bearer ')) {
      throw new UnauthorizedException('กรุณาเข้าสู่ระบบก่อนใช้งาน');
    }

    const token = auth.substring('Bearer '.length).trim();
    const expected = process.env.ADMIN_MOCK_TOKEN;

    if (!expected) {
      throw new UnauthorizedException('ไม่พบการตั้งค่า ADMIN_MOCK_TOKEN ในระบบ');
    }

    if (!token || token !== expected) {
      throw new UnauthorizedException('โทเคนไม่ถูกต้องหรือหมดอายุ');
    }

    return true;
  }
}
