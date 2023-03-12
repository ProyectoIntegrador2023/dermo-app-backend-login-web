import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicDto } from '../dto/medic.dto';
import { MedicEntity } from '../entities/medic.entity';
import { LoginEntity } from '../../auth/entities/login.entity';

@Injectable()
export class MedicService {
  private readonly logger = new Logger(MedicService.name);

  @InjectRepository(MedicEntity)
  private readonly medicRepository: Repository<MedicEntity>;

  @InjectRepository(LoginEntity)
  private readonly loginRepository: Repository<LoginEntity>;

  async getPersonalProfile(email: string): Promise<MedicEntity> {
    this.logger.log('getPersonalProfile email', email);
    const loginTmp: LoginEntity = await this.getLoginByEmail(email);
    if (!loginTmp) {
      throw new HttpException('Medic Not Found', HttpStatus.NOT_FOUND);
    }
    const personalProfileTmp: MedicEntity = await this.getMedicById(
      loginTmp.id
    );

    if (!personalProfileTmp) {
      throw new HttpException('Medic profile Not Found', HttpStatus.NOT_FOUND);
    }

    return personalProfileTmp;
  }

  async registerPersonalProfile(body: MedicDto): Promise<MedicEntity> {
    this.logger.log('registerPersonalProfile body', JSON.stringify(body));

    const loginTmp: LoginEntity = await this.getLoginByEmail(body.email);

    if (!loginTmp) {
      throw new HttpException('Medic Not Found', HttpStatus.NOT_FOUND);
    }
    this.logger.log('Getting login from DB ', JSON.stringify(loginTmp));

    const medicTmp: MedicEntity = await this.getMedicById(loginTmp.id);
    this.logger.log('Getting medic data from DB ', JSON.stringify(medicTmp));

    if (medicTmp) {
      throw new HttpException(
        'Conflict Medic profile Already Exist in DB',
        HttpStatus.CONFLICT
      );
    }

    const medicProfile = new MedicEntity();
    medicProfile.name = body.name;
    medicProfile.age = body.age;
    medicProfile.country = body.country;
    medicProfile.city = body.city;
    medicProfile.login = loginTmp;

    return this.medicRepository.save(medicProfile);
  }

  async updatePersonalProfile(body: MedicDto): Promise<MedicEntity | never> {
    this.logger.log('updatePersonalProfile body', JSON.stringify(body));

    const loginTmp: LoginEntity = await this.getLoginByEmail(body.email);

    if (!loginTmp) {
      throw new HttpException('Medic Not Found', HttpStatus.NOT_FOUND);
    }
    this.logger.log('Getting login from DB ', JSON.stringify(loginTmp));

    const medicTmp: MedicEntity = await this.getMedicById(loginTmp.id);

    if (!medicTmp) {
      throw new HttpException('Medic profile Not Found', HttpStatus.NOT_FOUND);
    }
    this.logger.log('Getting medic from DB ', JSON.stringify(medicTmp));

    medicTmp.name = body.name;
    medicTmp.age = body.age;
    medicTmp.country = body.country;
    medicTmp.city = body.city;

    return this.medicRepository.save(medicTmp);
  }

  public async getLoginByEmail(email: string): Promise<LoginEntity> {
    return await this.loginRepository.findOne({
      where: { email },
    });
  }

  public async getMedicById(id: number): Promise<MedicEntity> {
    return await this.medicRepository.findOne({
      where: {
        login: {
          id,
        },
      },
    });
  }
}
