import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto, RegisterDto } from './auth.dto';
import { AuthHelper } from './auth.helper';
import { Login } from './login.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  @InjectRepository(Login)
  private readonly repository: Repository<Login>;

  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  public async register(body: RegisterDto): Promise<Login | never> {
    const { email, password }: RegisterDto = body;
    let login: Login = await this.repository.findOne({ where: { email } });
    if (login) {
      throw new HttpException('Conflict', HttpStatus.CONFLICT);
    }

    login = new Login();
    login.email = email;
    login.password = this.helper.encodePassword(password);

    this.logger.log('register - login', login);

    return this.repository.save(login);
  }

  public async login(body: LoginDto): Promise<any | never> {
    const { email, password }: LoginDto = body;
    const login: Login = await this.repository.findOne({ where: { email } });

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

  public async refresh(login: Login): Promise<any> {
    if (!login || !login.id) {
      throw new HttpException('Forbidden', HttpStatus.UNAUTHORIZED);
      return;
    }
    this.repository.update(login.id, { lastLoginAt: new Date() });
    return {
      token: this.helper.generateToken(login),
    };
  }
}
