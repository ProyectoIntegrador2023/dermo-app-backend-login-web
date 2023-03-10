import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicEntity, MedicRepositoryFake } from '../entities/medic.entity';
import { MedicService } from './medic.service';
import { HttpException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import {
  LoginEntity,
  LoginRepositoryFake,
} from '../../auth/entities/login.entity';

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

describe('MedicService', () => {
  let medicService: MedicService;
  let loginRepository: Repository<LoginEntity>;
  let medicRepository: Repository<MedicEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        MedicService,
        {
          provide: getRepositoryToken(LoginEntity),
          useClass: LoginRepositoryFake,
        },
        {
          provide: getRepositoryToken(MedicEntity),
          useClass: MedicRepositoryFake,
        },
      ],
    }).compile();

    medicService = module.get<MedicService>(MedicService);
    loginRepository = module.get(getRepositoryToken(LoginEntity));
    medicRepository = module.get(getRepositoryToken(MedicEntity));
  });

  it('should be defined', () => {
    expect(medicService).toBeDefined();
  });

  describe('getPersonalProfile', () => {
    it('throws an error when no email is provided or email no exist.', async () => {
      try {
        await medicService.getPersonalProfile('');
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Medic Not Found');
      }
    });

    it('throws an error when medic profile nor found', async () => {
      jest
        .spyOn(loginRepository, 'findOne')
        .mockResolvedValue(savedLoginEntity);

      try {
        await medicService.getPersonalProfile(loginMock.email);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Medic profile Not Found');
      }
    });

    it('calls the repository with correct paramaters', async () => {
      jest
        .spyOn(loginRepository, 'findOne')
        .mockResolvedValue(savedLoginEntity);
      const medicRepositoryFindOneSpy = jest
        .spyOn(medicRepository, 'findOne')
        .mockResolvedValue(savedMedicEntity);

      const result = await medicService.getPersonalProfile(loginMock.email);

      expect(result).toBe(savedMedicEntity);
      expect(medicRepositoryFindOneSpy).toHaveBeenCalled();
    });
  });

  describe('registerPersonalProfile', () => {
    it('throws an error when no body is provided or email no exist.', async () => {
      try {
        await medicService.registerPersonalProfile({});
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
        await medicService.registerPersonalProfile(medicDTOMock);
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
        await medicService.registerPersonalProfile(medicDTOMock);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Conflict Medic profile Already Exist in DB');
      }
    });

    it('calls the repository with correct paramaters', async () => {
      jest
        .spyOn(loginRepository, 'findOne')
        .mockResolvedValue(savedLoginEntity);
      jest.spyOn(medicRepository, 'findOne').mockResolvedValue(null);
      const medicRepositorySaveSpy = jest
        .spyOn(medicRepository, 'save')
        .mockResolvedValue(savedMedicEntity);

      const result = await medicService.registerPersonalProfile(medicDTOMock);

      expect(medicRepositorySaveSpy).toBeCalled();
      expect(result).toEqual(savedMedicEntity);
    });
  });

  describe('updatePersonalProfile', () => {
    it('throws an error when no body is provided or email no exist.', async () => {
      try {
        await medicService.updatePersonalProfile({});
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
        await medicService.updatePersonalProfile(medicDTOMock);
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
        await medicService.updatePersonalProfile(medicDTOMock);
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
      const medicRepositorySaveSpy = jest
        .spyOn(medicRepository, 'save')
        .mockResolvedValue(savedMedicEntity);

      const result = await medicService.updatePersonalProfile(medicDTOMock);

      expect(medicRepositorySaveSpy).toBeCalled();
      expect(result).toEqual(savedMedicEntity);
    });
  });
});
