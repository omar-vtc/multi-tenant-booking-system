/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import 'reflect-metadata';
import { AppDataSource } from '../database/datasource';
import { Tenant } from '../tenants/tenant.entity';
import { Admin } from '../admins/admin.entity';
import { Space } from '../spaces/space.entity';
import { Availability } from '../spaces/availability.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  await AppDataSource.initialize();
  console.log('DB connected');

  const tRepo = AppDataSource.getRepository(Tenant);
  const aRepo = AppDataSource.getRepository(Admin);
  const sRepo = AppDataSource.getRepository(Space);
  const avRepo = AppDataSource.getRepository(Availability);

  const tenant = await tRepo.save(tRepo.create({ name: 'Tenant A' }));
  const pass = await bcrypt.hash('Password123', 10);
  await aRepo.save(
    aRepo.create({
      email: 'admin@tenant-a.com',
      passwordHash: pass,
      tenantId: tenant.id,
    }),
  );

  const space = await sRepo.save(
    sRepo.create({
      name: 'Court 1',
      tenantId: tenant.id,
      slotDurationMinutes: 60,
    }),
  );

  for (let wd = 1; wd <= 5; wd++) {
    await avRepo.save(
      avRepo.create({
        tenantId: tenant.id,
        spaceId: space.id,
        weekday: wd,
        startTime: '09:00:00',
        endTime: '17:00:00',
      }),
    );
  }

  console.log('Seed done');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
