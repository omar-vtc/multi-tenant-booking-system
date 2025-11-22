/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';

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
      return await this.bookingRepo.manager.transaction(async (manager) => {
        // Check for overlapping bookings
        const overlaps = await manager.query(
          `SELECT id FROM booking WHERE space_id=$1 AND tsrange(start_at,end_at) && tsrange($2,$3) LIMIT 1`,
          [spaceId, startAt.toISOString(), endAt.toISOString()],
        );

        if (overlaps.length) throw new ConflictException('Slot already taken');

        await manager.insert('booking', {
          tenantId,
          spaceId,
          userId,
          startAt,
          endAt,
        });

        return { success: true };
      });
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
