import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('availability')
export class Availability {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  tenantId: string;

  @Column('uuid')
  spaceId: string;

  @Column('int')
  weekday: number; // 1..7 (ISO)

  @Column('time')
  startTime: string; // '09:00:00'

  @Column('time')
  endTime: string; // '17:00:00'
}
