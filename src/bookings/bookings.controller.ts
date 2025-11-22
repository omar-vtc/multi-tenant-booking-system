/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Post, Request, Body, Get } from '@nestjs/common';
import { BookingsService } from './bookings.service';
// import { AuthGuard } from '@nestjs/passport';

@Controller()
export class BookingsController {
  constructor(private svc: BookingsService) {}

  @Post('tenants/:tenantId/spaces/:spaceId/bookings')
  //   @UseGuards(AuthGuard('jwt'))
  async create(
    @Request() req: any,
    @Body() body: { startAt: string; endAt: string },
  ) {
    const tenantId = req.params?.tenantId || req.user.tenantId;
    const spaceId = req.params?.spaceId;
    const userId = '3cfdfb8f-4d37-48da-bbfa-49ded1b47e7b'; //req.user.userId || req.user.sub;
    const startAt = new Date(body.startAt);
    const endAt = new Date(body.endAt);

    return this.svc.create(tenantId, spaceId, userId, startAt, endAt);
  }

  @Get('users/me/bookings')
  //   @UseGuards(AuthGuard('jwt'))
  async me(@Request() req: any) {
    return this.svc.listForUser(req.user.userId || req.user.sub);
  }
}
