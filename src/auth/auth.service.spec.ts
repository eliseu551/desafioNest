import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  const usersService: Partial<UsersService> = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    sanitize: (user: any) => {
      if (!user) return null;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...rest } = user;
      return rest;
    },
  };

  const jwtService = {
    sign: jest.fn().mockReturnValue('token'),
  } as unknown as JwtService;

  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(
      usersService as UsersService,
      jwtService as JwtService,
    );
  });

  it('registers a new user', async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValueOnce(null);
    (usersService.create as jest.Mock).mockImplementation(async (data) => ({
      id: 1,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await service.register({
      email: 'new@user.com',
      name: 'New User',
      password: 'secret123',
    });

    expect(result.accessToken).toBe('token');
    expect(result.user.email).toBe('new@user.com');
    expect(usersService.create).toHaveBeenCalled();
  });

  it('rejects duplicate email on register', async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValueOnce({
      id: 1,
      email: 'taken@user.com',
    });

    await expect(
      service.register({
        email: 'taken@user.com',
        name: 'Taken',
        password: 'secret123',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('logs in with valid credentials', async () => {
    const hash = await bcrypt.hash('secret123', 10);
    (usersService.findByEmail as jest.Mock).mockResolvedValueOnce({
      id: 2,
      email: 'demo@pets.com',
      name: 'Demo',
      passwordHash: hash,
    });

    const result = await service.login({
      email: 'demo@pets.com',
      password: 'secret123',
    });

    expect(result.accessToken).toBe('token');
    expect(result.user.id).toBe(2);
  });

  it('rejects invalid login', async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValueOnce(null);

    await expect(
      service.login({ email: 'missing@user.com', password: 'x' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('returns profile without password', async () => {
    (usersService.findById as jest.Mock).mockResolvedValueOnce({
      id: 1,
      email: 'demo@pets.com',
      name: 'Demo',
      passwordHash: 'hash',
    });

    const result = await service.profile(1);
    expect(result).toEqual({
      id: 1,
      email: 'demo@pets.com',
      name: 'Demo',
    });
  });
});
