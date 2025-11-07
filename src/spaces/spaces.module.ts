import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Space } from './space.entity';
import { Availability } from './availability.entity';
import { SpacesService } from './spaces.service';
import { SpacesController } from './spaces.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Space, Availability]), AuthModule],
  providers: [SpacesService],
  controllers: [SpacesController],
})
export class SpacesModule {}
