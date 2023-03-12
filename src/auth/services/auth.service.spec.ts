import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { LoginEntity, LoginRepositoryFake } from '../entities/login.entity';
import { AuthService } from './auth.service';
import { AuthHelper } from './auth.helper';
import { JwtService } from '@nestjs/jwt';

const registerDtoMock = {
  email: faker.internet.email(),
  password: faker.internet.password(),
};

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

describe('AuthService', () => {
  let authService: AuthService;
  let authHelperService: AuthHelper;
  let loginRepository: Repository<LoginEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        AuthService,
        AuthHelper,
        JwtService,
        {
          provide: getRepositoryToken(LoginEntity),
          useClass: LoginRepositoryFake,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authHelperService = module.get<AuthHelper>(AuthHelper);
    loginRepository = module.get(getRepositoryToken(LoginEntity));
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('throws an error when no body is provided.', async () => {
      jest
        .spyOn(loginRepository, 'findOne')
        .mockResolvedValue(savedLoginEntity);
      try {
        await authService.register(registerDtoMock);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Conflict');
      }
    });

    it('calls the repository with correct paramaters', async () => {
      jest.spyOn(loginRepository, 'findOne').mockResolvedValue(null);
      const loginRepositorySaveSpy = jest
        .spyOn(loginRepository, 'save')
        .mockResolvedValue(savedLoginEntity);

      const result = await authService.register(registerDtoMock);

      expect(loginRepositorySaveSpy).toBeCalled();
      expect(result).toEqual(savedLoginEntity);
    });
  });

  describe('login', () => {
    it('throws an error when login not exist.', async () => {
      jest.spyOn(loginRepository, 'findOne').mockResolvedValue(null);
      try {
        await authService.login(loginMock);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('No user found');
      }
    });

    it('throws an error when password is not valid', async () => {
      jest
        .spyOn(loginRepository, 'findOne')
        .mockResolvedValue(savedLoginEntity);
      jest.spyOn(loginRepository, 'update').mockResolvedValue(null);
      jest.spyOn(authHelperService, 'isPasswordValid').mockReturnValue(false);

      try {
        await authService.login(registerDtoMock);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('No user found');
      }
    });

    it('calls the repository with correct paramaters', async () => {
      jest
        .spyOn(loginRepository, 'findOne')
        .mockResolvedValue(savedLoginEntity);
      jest.spyOn(loginRepository, 'update').mockResolvedValue(null);
      jest.spyOn(authHelperService, 'isPasswordValid').mockReturnValue(true);
      jest.spyOn(authHelperService, 'generateToken').mockReturnValue('asdasd');

      const result = await authService.login(registerDtoMock);
      expect(result.email).toEqual(savedLoginEntity.email);
    });
  });
});
