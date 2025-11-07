import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('admin')
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  passwordHash: string;

  @Column('uuid')
  tenantId: string;
}
