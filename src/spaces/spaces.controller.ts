/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { SpacesService } from './spaces.service';
// import { AuthGuard } from '@nestjs/passport';
// import { AdminGuard } from '../common/guards/admin.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
// import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller()
export class SpacesController {
  constructor(private svc: SpacesService) {}

  @Get('tenants/:tenantId/spaces')
  @UseGuards(TenantGuard)
  async list(@Param('tenantId') tenantId: string) {
    return this.svc.listSpaces(tenantId);
  }

  @Get('tenants/:tenantId/spaces/:spaceId/slots')
  @UseGuards(TenantGuard)
  async slots(
    @Param('tenantId') tenantId: string,
    @Param('spaceId') spaceId: string,
    @Query('date') dateStr: string,
  ) {
    const date = dateStr ? new Date(dateStr) : new Date();
    return this.svc.generateSlotsForDay(tenantId, spaceId, date);
  }

  @Post('admin/spaces')
  //   @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Request() req: any, @Body() body: any) {
    // Use a default tenantId while testing without auth
    console.log(req.body);
    const tenantId =
      req.user?.tenantId || 'a156463d-985b-449c-9bf7-9d88cbe0b0d5';
    console.log('tenantId being used:', tenantId);
    return this.svc.create(tenantId, body);
  }

  @Post('admin/spaces/:spaceId/availabilities')
  //   @UseGuards(AuthGuard('jwt'), AdminGuard)
  async createAvailability(
    @Request() req: any,
    @Param('spaceId') spaceId: string,
    @Body() body: any,
  ) {
    const tenantId =
      req.user?.tenantId || 'a156463d-985b-449c-9bf7-9d88cbe0b0d5';
    return this.svc.createAvailability(tenantId, spaceId, body);
  }
}
