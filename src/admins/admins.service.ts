/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async findByEmail(email: string): Promise<Admin | null> {
    return this.adminRepository.findOne({ where: { email } });
  }

  async createAdmin(
    email: string,
    password: string,
    tenantId: string,
  ): Promise<Admin> {
    const passwordHash = await bcrypt.hash(password, 10);
    const admin = this.adminRepository.create({
      email,
      passwordHash,
      tenantId,
    });
    return this.adminRepository.save(admin);
  }
}
