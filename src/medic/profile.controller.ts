import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MedicDto } from './dto/medic.dto';
import { ProfileDto } from './dto/profile.dto';
import { MedicEntity } from './entities/medic.entity';
import { ProfileEntity } from './entities/profile.entity';
import { MedicService } from './services/medic.service';
import { ProfileService } from './services/profile.service';

@Controller('profile')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  @Inject(MedicService)
  private readonly medicService: MedicService;

  @Inject(ProfileService)
  private readonly profileService: ProfileService;

  @Get('personal/:email')
  private getPersonalProfile(
    @Param('email') email: string
  ): Promise<MedicEntity | never> {
    return this.medicService.getPersonalProfile(email);
  }

  @Post('personal')
  private registerPersonalProfile(
    @Body() body: MedicDto
  ): Promise<MedicEntity> {
    return this.medicService.registerPersonalProfile(body);
  }

  @Put('personal')
  private updatePersonalProfile(@Body() body: MedicDto): Promise<MedicEntity> {
    return this.medicService.updatePersonalProfile(body);
  }

  @Get('medic/:email')
  private getMedicProfile(
    @Param('email') email: string
  ): Promise<ProfileEntity | never> {
    return this.profileService.getMedicProfile(email);
  }

  @Post('medic')
  private registerMedicProfile(
    @Body() body: ProfileDto
  ): Promise<ProfileEntity> {
    return this.profileService.registerMedicProfile(body);
  }

  @Put('medic')
  private updateMedicProfile(@Body() body: ProfileDto): Promise<ProfileEntity> {
    return this.profileService.updateMedicProfile(body);
  }
}
