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
  weekday: number;

  @Column('time')
  startTime: string;

  @Column('time')
  endTime: string;
}
