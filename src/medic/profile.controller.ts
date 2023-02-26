import { Body, Controller, Inject, Logger, Post, Put } from '@nestjs/common';
import { MedicDto } from './dto/medic.dto';
import { MedicEntity } from './entities/medic.entity';
import { MedicService } from './medic.service';

@Controller('profile')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  @Inject(MedicService)
  private readonly service: MedicService;

  @Post('personal')
  private registerDiagnostic(@Body() body: MedicDto): Promise<MedicEntity> {
    return this.service.registerPersonalProfile(body);
  }

  @Put('personal')
  private updateDiagnostic(@Body() body: MedicDto): Promise<MedicEntity> {
    return this.service.updatePersonalProfile(body);
  }
}
