import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport/dist';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MedicModule } from '../medic/medic.module';
import { MedicService } from '../medic/medic.service';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Login } from './login.entity';
import { Medic } from '../medic/medic.entity';
import { JwtStrategy } from './services/auth.strategy';
import { AuthHelper } from './services/auth.helper';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: process.env.JWT_EXPIRES || config.get('JWT_KEY'),
        signOptions: {
          expiresIn: process.env.JWT_EXPIRES || config.get('JWT_EXPIRES'),
        },
      }),
    }),
    TypeOrmModule.forFeature([Login, Medic]),
    MedicModule,
  ],
  providers: [AuthService, MedicService, AuthHelper, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
