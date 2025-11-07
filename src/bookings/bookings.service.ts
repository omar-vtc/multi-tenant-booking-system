/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { AppDataSource } from '../database/datasource';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
  ) {}

  async create(
    tenantId: string,
    spaceId: string,
    userId: string,
    startAt: Date,
    endAt: Date,
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await AppDataSource.transaction(async (manager) => {
        const overlaps = await manager.query(
          `SELECT id FROM booking WHERE space_id=$1 AND tsrange(start_at,end_at) && tsrange($2,$3) LIMIT 1`,
          [spaceId, startAt.toISOString(), endAt.toISOString()],
        );
        if (overlaps.length) throw new ConflictException('Slot already taken');

        const insert = await manager.insert('booking', {
          tenant_id: tenantId,
          space_id: spaceId,
          user_id: userId,
          start_at: startAt,
          end_at: endAt,
        });
        return insert;
      });
      return { success: true };
    } catch (err: any) {
      if (err.code === '23P01' || err.message?.includes('booking_no_overlap')) {
        throw new ConflictException('Slot already booked');
      }
      throw err;
    }
  }

  async listForUser(userId: string) {
    return this.bookingRepo.find({ where: { userId } });
  }
}
