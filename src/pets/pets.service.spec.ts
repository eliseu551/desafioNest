import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PetsService } from './pets.service';

describe('PetsService', () => {
  const prisma = {
    pet: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  } as any;

  let service: PetsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PetsService(prisma);
  });

  it('creates a pet for the owner', async () => {
    prisma.pet.create.mockResolvedValueOnce({ id: 1, name: 'Bolt' });
    const pet = await service.create(1, { name: 'Bolt', species: 'Dog' });
    expect(pet.id).toBe(1);
    expect(prisma.pet.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ ownerId: 1, name: 'Bolt' }),
    });
  });

  it('throws when pet is not found', async () => {
    prisma.pet.findFirst.mockResolvedValueOnce(null);
    await expect(service.findOne(1, 123)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('blocks updates for another user', async () => {
    prisma.pet.findUnique.mockResolvedValueOnce({ id: 5, ownerId: 2 });
    await expect(service.update(1, 5, { name: 'New' })).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });
});
