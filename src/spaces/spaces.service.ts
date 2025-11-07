import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Space } from './space.entity';
import { Availability } from './availability.entity';
import { addMinutes, set } from 'date-fns';

@Injectable()
export class SpacesService {
  constructor(
    @InjectRepository(Space) private spaceRepo: Repository<Space>,
    @InjectRepository(Availability)
    private availabilityRepo: Repository<Availability>,
  ) {}

  async create(tenantId: string, dto: Partial<Space>) {
    const space = this.spaceRepo.create({ ...dto, tenantId });
    return this.spaceRepo.save(space);
  }

  async createAvailability(
    tenantId: string,
    spaceId: string,
    dto: Partial<Availability>,
  ) {
    const av = this.availabilityRepo.create({ ...dto, tenantId, spaceId });
    return this.availabilityRepo.save(av);
  }

  async listSpaces(tenantId: string) {
    return this.spaceRepo.find({ where: { tenantId } });
  }

  async getAvailabilitiesForWeekday(spaceId: string, weekday: number) {
    return this.availabilityRepo.find({ where: { spaceId, weekday } });
  }

  // Slot generation for a single day
  async generateSlotsForDay(tenantId: string, spaceId: string, date: Date) {
    const space = await this.spaceRepo.findOne({
      where: { id: spaceId, tenantId },
    });
    if (!space) return [];
    const weekday = getISOWeekday(date);
    const availabilities = await this.availabilityRepo.find({
      where: { spaceId, weekday },
    });

    const slots: Array<{ start: Date; end: Date }> = [];
    for (const av of availabilities) {
      const [sh, sm] = av.startTime.split(':').map(Number);
      const [eh, em] = av.endTime.split(':').map(Number);
      let cursor = set(date, {
        hours: sh,
        minutes: sm,
        seconds: 0,
        milliseconds: 0,
      });
      const intervalEnd = set(date, {
        hours: eh,
        minutes: em,
        seconds: 0,
        milliseconds: 0,
      });
      while (cursor < intervalEnd) {
        const slotStart = cursor;
        const slotEnd = addMinutes(slotStart, space.slotDurationMinutes);
        if (slotEnd > intervalEnd) break;
        slots.push({ start: slotStart, end: slotEnd });
        cursor = slotEnd;
      }
    }
    return slots;
  }
}

function getISOWeekday(d: Date) {
  const day = d.getDay();
  return day === 0 ? 7 : day;
}
