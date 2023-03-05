import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthHelper } from './auth.helper';
import { AuthValidateDto } from '../dto/auth-validate.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  constructor(@Inject(ConfigService) config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_KEY'),
      ignoreExpiration: false,
    });
  }

  private async validate(payload: string): Promise<AuthValidateDto | never> {
    const user = await this.helper.validateUser(payload);

    if (!user) {
      throw new UnauthorizedException();
    }

    const validateDto = new AuthValidateDto();
    validateDto.id = user.id;
    validateDto.email = user.email;
    validateDto.valid = true;

    return validateDto;
  }
}
