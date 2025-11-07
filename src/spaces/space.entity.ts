import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('space')
export class Space {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  tenantId: string;

  @Column()
  name: string;

  @Column({ default: 60 })
  slotDurationMinutes: number;

  @Column({ default: 0 })
  bufferBeforeMinutes: number;

  @Column({ default: 0 })
  bufferAfterMinutes: number;
}
