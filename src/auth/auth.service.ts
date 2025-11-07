/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AdminsService } from '../admins/admins.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { Admin } from '../admins/admin.entity';

type Account = (User | Admin) & { role: 'user' | 'admin' };

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly adminsService: AdminsService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<Account> {
    console.log('AuthService validateUser:');
    // Try user first
    let account: User | Admin | null =
      await this.usersService.findByEmail(email);
    let role: 'user' | 'admin' = 'user';
    console.log('Validating user with email:', email);
    // If not user, check admin
    if (!account) {
      const admin = await this.adminsService.findByEmail(email);
      if (admin) {
        account = admin;
        role = 'admin';
      }
    }

    if (!account) throw new UnauthorizedException('Invalid credentials');

    // Validate password
    const isMatch = await bcrypt.compare(password, account.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return { ...account, role } as Account;
  }

  login(account: Account) {
    const payload = {
      email: account.email,
      sub: account.id,
      tenantId: account.tenantId,
      role: account.role,
    };
    return { access_token: this.jwtService.sign(payload) };
  }
}
