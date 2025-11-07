import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [
    __dirname + '/../tenants/*.entity.ts',
    __dirname + '/../admins/*.entity.ts',
    __dirname + '/../spaces/*.entity.ts',
    __dirname + '/../bookings/*.entity.ts', // if you have a bookings folder
    __dirname + '/../users/*.entity.ts',
  ],
  migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
});
