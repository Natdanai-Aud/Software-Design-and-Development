import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class MockAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
