/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    console.log('TenantGuard canActivate called');
    const req = context.switchToHttp().getRequest();
    req.tenantId =
      req.params.tenantId ||
      (req.user && req.user.tenantId) ||
      req.headers['x-tenant-id'];
    return !!req.tenantId;
  }
}
