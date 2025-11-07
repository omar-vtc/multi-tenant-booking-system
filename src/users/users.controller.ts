/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signup(
    @Body()
    body: {
      email: string;
      password: string;
      tenantId: string;
      name?: string;
    },
  ) {
    const user = await this.usersService.createUser(
      body.email,
      body.password,
      body.tenantId,
      body.name,
    );

    // Normal users only → role = 'user'
    return this.authService.login({ ...user, role: 'user' });
  }
}
