import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { AuthHelper } from './auth.helper';
import { LoginEntity } from '../entities/login.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  @InjectRepository(LoginEntity)
  private readonly repository: Repository<LoginEntity>;

  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  public async register(body: RegisterDto): Promise<LoginEntity | never> {
    const { email, password }: RegisterDto = body;
    let login: LoginEntity = await this.findLogin(email);
    if (login) {
      throw new HttpException('Conflict', HttpStatus.CONFLICT);
    }

    login = new LoginEntity();
    login.email = email;
    login.password = this.helper.encodePassword(password);

    this.logger.log('register - login', JSON.stringify(login));

    return this.repository.save(login);
  }

  public async login(body: LoginDto): Promise<any | never> {
    const { email, password }: LoginDto = body;
    const login: LoginEntity = await this.findLogin(email);

    if (!login) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid: boolean = this.helper.isPasswordValid(
      password,
      login.password
    );

    if (!isPasswordValid) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }

    this.repository.update(login.id, { lastLoginAt: new Date() });
    const token = this.helper.generateToken(login);

    return {
      email: login.email,
      token,
    };
  }

  public async refresh(login: LoginEntity): Promise<any> {
    if (!login || !login.id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    this.repository.update(login.id, { lastLoginAt: new Date() });
    return {
      token: this.helper.generateToken(login),
    };
  }

  public async findLogin(email: string) {
    return await this.repository.findOne({ where: { email } });
  }
}
