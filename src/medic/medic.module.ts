import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginEntity } from 'src/auth/entities/login.entity';
import { MedicEntity } from './entities/medic.entity';
import { MedicService } from './medic.service';
import { ProfileController } from './profile.controller';

@Module({
  controllers: [ProfileController],
  providers: [MedicService],
  imports: [TypeOrmModule.forFeature([MedicEntity, LoginEntity])],
})
export class MedicModule {}
