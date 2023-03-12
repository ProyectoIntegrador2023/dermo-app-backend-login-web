import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  LoginEntity,
  LoginRepositoryFake,
} from '../auth/entities/login.entity';
import { MedicEntity, MedicRepositoryFake } from './entities/medic.entity';
import {
  ProfileEntity,
  ProfileRepositoryFake,
} from './entities/profile.entity';
import { ProfileController } from './profile.controller';
import { MedicService } from './services/medic.service';
import { ProfileService } from './services/profile.service';

describe('ProfileController', () => {
  let profileController: ProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        MedicService,
        ProfileService,
        {
          provide: getRepositoryToken(LoginEntity),
          useClass: LoginRepositoryFake,
        },
        {
          provide: getRepositoryToken(MedicEntity),
          useClass: MedicRepositoryFake,
        },
        {
          provide: getRepositoryToken(ProfileEntity),
          useClass: ProfileRepositoryFake,
        },
      ],
    }).compile();

    profileController = module.get<ProfileController>(ProfileController);
  });

  it('should be defined', () => {
    expect(profileController).toBeDefined();
  });
});
