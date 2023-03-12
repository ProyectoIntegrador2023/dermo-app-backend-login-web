import {
  HealthCheckService,
  HttpHealthIndicator,
  TerminusModule,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: {
            get: jest.fn().mockResolvedValue('some result'),
          },
        },
        {
          provide: HttpHealthIndicator,
          useValue: {
            get: jest.fn().mockResolvedValue('some result'),
          },
        },
        {
          provide: TypeOrmHealthIndicator,
          useValue: {
            get: jest.fn().mockResolvedValue('some result'),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
