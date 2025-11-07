/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    console.log('AdminGuard request.user:');
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    if (!user) throw new UnauthorizedException('No user found in request');
    if (user.role !== 'admin')
      throw new UnauthorizedException('Admin access required');

    return true;
  }
}
