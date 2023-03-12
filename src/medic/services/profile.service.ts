import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginEntity } from '../../auth/entities/login.entity';
import { Repository } from 'typeorm';
import { ProfileDto } from '../dto/profile.dto';
import { MedicEntity } from '../entities/medic.entity';
import { ProfileEntity } from '../entities/profile.entity';
import { MedicService } from './medic.service';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  @Inject(MedicService)
  private readonly medicService: MedicService;

  @InjectRepository(ProfileEntity)
  private readonly profileRepository: Repository<ProfileEntity>;

  async getMedicProfile(email: string): Promise<ProfileEntity> {
    this.logger.log('getPersonalProfile email', email);
    const loginTmp: LoginEntity = await this.medicService.getLoginByEmail(
      email
    );
    if (!loginTmp) {
      throw new HttpException('Medic Not Found', HttpStatus.NOT_FOUND);
    }
    const medicTmp: MedicEntity = await this.medicService.getMedicById(
      loginTmp.id
    );

    if (!medicTmp) {
      throw new HttpException('Medic profile Not Found', HttpStatus.NOT_FOUND);
    }
    this.logger.log('Getting medic from DB ', JSON.stringify(medicTmp));

    const medicProfileTmp: ProfileEntity = await this.getMedicProfileByMedicId(
      medicTmp.id
    );

    if (!medicProfileTmp) {
      throw new HttpException('Medic profile Not Found', HttpStatus.NOT_FOUND);
    }
    return medicProfileTmp;
  }

  async registerMedicProfile(body: ProfileDto): Promise<ProfileEntity> {
    this.logger.log('registerMedicProfile body', JSON.stringify(body));

    const loginTmp: LoginEntity = await this.medicService.getLoginByEmail(
      body.email
    );

    if (!loginTmp) {
      throw new HttpException('Medic login Not Found', HttpStatus.NOT_FOUND);
    }
    this.logger.log('Getting login from DB ', JSON.stringify(loginTmp));

    const medicTmp: MedicEntity = await this.medicService.getMedicById(
      loginTmp.id
    );
    this.logger.log('Getting medic from DB ', JSON.stringify(medicTmp));

    if (!medicTmp) {
      throw new HttpException('Conflict Medic  Not Found', HttpStatus.CONFLICT);
    }

    const profileTmp: ProfileEntity = await this.profileRepository.findOne({
      where: {
        medic: {
          id: medicTmp.id,
        },
      },
    });
    this.logger.log('Getting profile from DB ', JSON.stringify(profileTmp));

    if (profileTmp) {
      throw new HttpException(
        'Conflict Medic profile Already Exist in DB',
        HttpStatus.CONFLICT
      );
    }

    const medicProfile = new ProfileEntity();
    medicProfile.specialty = body.specialty;
    medicProfile.licenceId = body.licenceId;
    medicProfile.licenceValidityDate = body.licenceValidityDate;
    medicProfile.licenceImage = body.licenceImage;
    medicProfile.medic = medicTmp;

    return this.profileRepository.save(medicProfile);
  }

  async updateMedicProfile(body: ProfileDto): Promise<ProfileEntity | never> {
    this.logger.log('updateMedicProfile body', JSON.stringify(body));

    const loginTmp: LoginEntity = await this.medicService.getLoginByEmail(
      body.email
    );

    if (!loginTmp) {
      throw new HttpException('Medic Not Found', HttpStatus.NOT_FOUND);
    }
    this.logger.log('Getting login from DB ', JSON.stringify(loginTmp));

    const medicTmp: MedicEntity = await this.medicService.getMedicById(
      loginTmp.id
    );

    if (!medicTmp) {
      throw new HttpException('Medic profile Not Found', HttpStatus.NOT_FOUND);
    }
    this.logger.log('Getting medic from DB ', JSON.stringify(medicTmp));

    const profileTmp: ProfileEntity = await this.getMedicProfileByMedicId(
      medicTmp.id
    );
    this.logger.log('Getting profile from DB ', JSON.stringify(profileTmp));

    if (!profileTmp) {
      throw new HttpException(
        'Conflict Medic profile not found',
        HttpStatus.CONFLICT
      );
    }

    profileTmp.specialty = body.specialty;
    profileTmp.licenceId = body.licenceId;
    profileTmp.licenceValidityDate = body.licenceValidityDate;
    profileTmp.licenceImage = body.licenceImage;

    return this.profileRepository.save(profileTmp);
  }

  private async getMedicProfileByMedicId(
    medicId: number
  ): Promise<ProfileEntity> {
    return await this.profileRepository.findOne({
      where: {
        medic: {
          id: medicId,
        },
      },
    });
  }
}
