import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginEntity } from 'src/auth/entities/login.entity';
import { MedicEntity } from './entities/medic.entity';
import { ProfileEntity } from './entities/profile.entity';
import { MedicService } from './medic.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  controllers: [ProfileController],
  providers: [MedicService, ProfileService],
  imports: [
    TypeOrmModule.forFeature([MedicEntity, LoginEntity, ProfileEntity]),
  ],
})
export class MedicModule {}
