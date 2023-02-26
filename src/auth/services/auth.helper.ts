import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Login } from '../login.entity';

@Injectable()
export class AuthHelper {
  private readonly logger = new Logger(AuthHelper.name);

  @InjectRepository(Login)
  private readonly repository: Repository<Login>;

  constructor(private jwtService: JwtService) {}

  // Decoding the JWT Token
  public async decode(token: string): Promise<unknown> {
    return this.jwtService.decode(token, null);
  }

  // Get User by User ID we get from decode()
  public async validateUser(decoded: any): Promise<Login> {
    return this.repository.findOne({ where: { id: decoded.id } });
  }

  // Generate JWT Token
  public generateToken(login: Login): string {
    return this.jwtService.sign({ id: login.id, email: login.email });
  }

  // Validate User's password
  public isPasswordValid(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }

  // Encode User's password
  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }
}
