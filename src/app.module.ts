import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { getEnvPath } from './config/env.helper';
import { HealthModule } from './health/health.module';
import { MedicModule } from './medic/medic.module';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';

const envFilePath: string = getEnvPath(`${__dirname}/environments`);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    HttpModule,
    HealthModule,
    AuthModule,
    MedicModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
