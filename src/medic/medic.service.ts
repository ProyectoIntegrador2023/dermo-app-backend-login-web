import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginEntity } from 'src/auth/entities/login.entity';
import { Repository } from 'typeorm';
import { MedicDto } from './dto/medic.dto';
import { MedicEntity } from './entities/medic.entity';

@Injectable()
export class MedicService {
  private readonly logger = new Logger(MedicService.name);

  @InjectRepository(MedicEntity)
  private readonly medicRepository: Repository<MedicEntity>;

  @InjectRepository(LoginEntity)
  private readonly loginRepository: Repository<LoginEntity>;

  async registerPersonalProfile(body: MedicDto): Promise<MedicEntity> {
    this.logger.log('registerPersonalProfile body', JSON.stringify(body));

    const loginTmp: LoginEntity = await this.loginRepository.findOne({
      where: { email: body.email },
    });

    if (!loginTmp) {
      throw new HttpException('Medic Not Found', HttpStatus.NOT_FOUND);
    }
    this.logger.log('Getting login from DB ', JSON.stringify(loginTmp));

    const medicTmp: MedicEntity = await this.medicRepository.findOne({
      where: {
        login: {
          id: loginTmp.id,
        },
      },
    });
    this.logger.log('Getting data from DB ', JSON.stringify(medicTmp));

    if (medicTmp) {
      throw new HttpException(
        'Conflict Medic profile Already Exist in DB',
        HttpStatus.CONFLICT
      );
    }

    const medicProfile = new MedicEntity();
    medicProfile.name = body.name;
    medicProfile.age = body.age;
    medicProfile.countryId = body.countryId;
    medicProfile.cityId = body.cityId;
    medicProfile.login = loginTmp;

    return this.medicRepository.save(medicProfile);
  }

  async updatePersonalProfile(body: MedicDto): Promise<MedicEntity | never> {
    this.logger.log('updatePersonalProfile body', JSON.stringify(body));

    const loginTmp: LoginEntity = await this.loginRepository.findOne({
      where: { email: body.email },
    });

    if (!loginTmp) {
      throw new HttpException('Medic Not Found', HttpStatus.NOT_FOUND);
    }
    this.logger.log('Getting login from DB ', JSON.stringify(loginTmp));

    const medicTmp: MedicEntity = await this.medicRepository.findOne({
      where: {
        login: {
          id: loginTmp.id,
        },
      },
    });

    if (!medicTmp) {
      throw new HttpException('Medic profile Not Found', HttpStatus.NOT_FOUND);
    }
    this.logger.log('Getting medic from DB ', JSON.stringify(medicTmp));

    medicTmp.name = body.name;
    medicTmp.age = body.age;
    medicTmp.countryId = body.countryId;
    medicTmp.cityId = body.cityId;

    return this.medicRepository.save(medicTmp);
  }
}
