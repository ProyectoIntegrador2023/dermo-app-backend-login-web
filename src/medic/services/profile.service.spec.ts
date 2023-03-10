import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicEntity, MedicRepositoryFake } from '../entities/medic.entity';
import { HttpException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import {
  LoginEntity,
  LoginRepositoryFake,
} from '../../auth/entities/login.entity';
import {
  ProfileEntity,
  ProfileRepositoryFake,
} from '../entities/profile.entity';
import { ProfileService } from './profile.service';
import { MedicService } from './medic.service';
import { ProfileDto } from '../dto/profile.dto';

const loginMock = {
  email: faker.internet.email(),
  password: faker.internet.password(),
};

const savedLoginEntity = LoginEntity.of({
  id: Number(faker.random.numeric(2)),
  createdAt: new Date(),
  lastLoginAt: null,
  ...loginMock,
});

const medicMock = {
  name: faker.name.fullName(),
  age: faker.datatype.number({
    min: 18,
    max: 99,
  }),
  country: faker.address.country(),
  city: faker.address.cityName(),
};

const medicDTOMock = {
  ...medicMock,
  email: faker.internet.email(),
};

const savedMedicEntity = MedicEntity.of({
  id: Number(faker.random.numeric(2)),
  createdAt: new Date(),
  updatedAt: null,
  login: savedLoginEntity,
  ...medicMock,
});

const imageBase64Mock =
  'data:image/jpeg;base64,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';

const profileMedicMock = {
  specialty: faker.lorem.words(2),
  licenceId: faker.random.alphaNumeric(10),
  licenceValidityDate: faker.date.future(5),
  licenceImage: imageBase64Mock,
};

const profileDTOMock: ProfileDto = {
  ...profileMedicMock,
  email: medicDTOMock.email,
};

const savedProfileMedicEntity = ProfileEntity.of({
  id: Number(faker.random.numeric(2)),
  createdAt: new Date(),
  updatedAt: null,
  medic: savedMedicEntity,
  ...profileMedicMock,
});

describe('MedicService', () => {
  let profileService: ProfileService;
  let loginRepository: Repository<LoginEntity>;
  let medicRepository: Repository<MedicEntity>;
  let profileRepository: Repository<ProfileEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
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

    profileService = module.get<ProfileService>(ProfileService);
    loginRepository = module.get(getRepositoryToken(LoginEntity));
    medicRepository = module.get(getRepositoryToken(MedicEntity));
    profileRepository = module.get(getRepositoryToken(ProfileEntity));
  });

  it('should be defined', () => {
    expect(profileService).toBeDefined();
  });

  describe('getMedicProfile', () => {
    it('throws an error when no email is provided or email no exist.', async () => {
      try {
        await profileService.getMedicProfile('');
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Medic Not Found');
      }
    });

    it('throws an error when medic profile not found', async () => {
      jest
        .spyOn(loginRepository, 'findOne')
        .mockResolvedValue(savedLoginEntity);

      try {
        await profileService.getMedicProfile(loginMock.email);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Medic profile Not Found');
      }
    });

    it('calls the repository with correct paramaters', async () => {
      jest
        .spyOn(loginRepository, 'findOne')
        .mockResolvedValue(savedLoginEntity);
      jest
        .spyOn(medicRepository, 'findOne')
        .mockResolvedValue(savedMedicEntity);
      const profileRepositoryFindOneSpy = jest
        .spyOn(profileRepository, 'findOne')
        .mockResolvedValue(savedProfileMedicEntity);

      const result = await profileService.getMedicProfile(loginMock.email);

      expect(result).toBe(savedProfileMedicEntity);
      expect(profileRepositoryFindOneSpy).toHaveBeenCalled();
    });
  });

  describe('registerMedicProfile', () => {
    it('throws an error when no body is provided or email no exist.', async () => {
      try {
        await profileService.registerMedicProfile(new ProfileDto());
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Medic login Not Found');
      }
    });

    it('throws an error when medic profile not found', async () => {
      jest
        .spyOn(loginRepository, 'findOne')
        .mockResolvedValue(savedLoginEntity);

      try {
        await profileService.registerMedicProfile(profileDTOMock);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Conflict Medic  Not Found');
      }
    });

    it('throws an error when medic profile already exist', async () => {
      jest
        .spyOn(loginRepository, 'findOne')
        .mockResolvedValue(savedLoginEntity);
      jest
        .spyOn(medicRepository, 'findOne')
        .mockResolvedValue(savedMedicEntity);
      jest.spyOn(medicRepository, 'save').mockResolvedValue(savedMedicEntity);

      try {
        await profileService.registerMedicProfile(profileDTOMock);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Conflict Medic profile Already Exist in DB');
      }
    });

    it('calls the repository with correct paramaters', async () => {
      jest
        .spyOn(loginRepository, 'findOne')
        .mockResolvedValue(savedLoginEntity);
      jest
        .spyOn(medicRepository, 'findOne')
        .mockResolvedValue(savedMedicEntity);
      jest.spyOn(profileRepository, 'findOne').mockResolvedValue(null);
      const profileRepositorySaveSpy = jest
        .spyOn(profileRepository, 'save')
        .mockResolvedValue(savedProfileMedicEntity);

      const result = await profileService.registerMedicProfile(profileDTOMock);

      expect(profileRepositorySaveSpy).toBeCalled();
      expect(result).toEqual(savedProfileMedicEntity);
    });
  });

  describe('updateMedicProfile', () => {
    it('throws an error when no body is provided or email no exist.', async () => {
      try {
        await profileService.updateMedicProfile(new ProfileDto());
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Medic Not Found');
      }
    });

    it('throws an error when medic profile not found', async () => {
      jest
        .spyOn(loginRepository, 'findOne')
        .mockResolvedValue(savedLoginEntity);

      try {
        await profileService.updateMedicProfile(profileDTOMock);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Medic profile Not Found');
      }
    });

    it('throws an error when medic profile already exist', async () => {
      jest
        .spyOn(loginRepository, 'findOne')
        .mockResolvedValue(savedLoginEntity);
      jest
        .spyOn(medicRepository, 'findOne')
        .mockResolvedValue(savedMedicEntity);
      jest.spyOn(medicRepository, 'save').mockResolvedValue(savedMedicEntity);

      try {
        await profileService.updateMedicProfile(profileDTOMock);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Conflict Medic profile not found');
      }
    });

    it('calls the repository with correct paramaters', async () => {
      jest
        .spyOn(loginRepository, 'findOne')
        .mockResolvedValue(savedLoginEntity);
      jest
        .spyOn(medicRepository, 'findOne')
        .mockResolvedValue(savedMedicEntity);
      jest
        .spyOn(profileRepository, 'findOne')
        .mockResolvedValue(savedProfileMedicEntity);
      const profileRepositorySaveSpy = jest
        .spyOn(profileRepository, 'save')
        .mockResolvedValue(savedProfileMedicEntity);

      const result = await profileService.updateMedicProfile(profileDTOMock);

      expect(profileRepositorySaveSpy).toBeCalled();
      expect(result).toEqual(savedProfileMedicEntity);
    });
  });
});
