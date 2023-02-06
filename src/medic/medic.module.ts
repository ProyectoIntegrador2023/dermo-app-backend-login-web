import { Module } from '@nestjs/common';
import { MedicService } from './medic.service';

@Module({
  providers: [MedicService],
})
export class MedicModule {}
