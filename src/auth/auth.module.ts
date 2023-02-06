import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport/dist';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MedicModule } from '../medic/medic.module';
import { MedicService } from '../medic/medic.service';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Login } from './login.entity';
import { Medic } from '../medic/medic.entity';
import { JwtStrategy } from './auth.strategy';
import { AuthHelper } from './auth.helper';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_KEY'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES') },
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
