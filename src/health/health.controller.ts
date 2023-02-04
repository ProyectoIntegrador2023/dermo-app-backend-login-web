import { Controller, Get, Logger } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const healthCheck = this.health.check([
      () => this.http.pingCheck('Basic Check', 'http://localhost:3000'),
    ]);
    this.logger.log(`HealthCheck`);
    return healthCheck;
  }
}
