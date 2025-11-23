import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { AppointmentStatus } from '@prisma/client';
import { AppointmentsService } from './appointments.service';

describe('AppointmentsService', () => {
  const prisma = {
    appointment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    pet: {
      findUnique: jest.fn(),
    },
  } as any;

  const webhooksService = {
    notifyAppointmentStatusChange: jest.fn(),
  } as any;

  let service: AppointmentsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AppointmentsService(prisma, webhooksService);
  });

  it('creates an appointment when pet belongs to user', async () => {
    prisma.pet.findUnique.mockResolvedValueOnce({ id: 1, ownerId: 1 });
    prisma.appointment.create.mockResolvedValueOnce({ id: 10 });

    const appointment = await service.create(1, {
      petId: 1,
      service: 'Vacina',
      date: new Date().toISOString(),
    });

    expect(appointment.id).toBe(10);
    expect(prisma.appointment.create).toHaveBeenCalled();
  });

  it('rejects creation for pets of another user', async () => {
    prisma.pet.findUnique.mockResolvedValueOnce({ id: 1, ownerId: 2 });
    await expect(
      service.create(1, {
        petId: 1,
        service: 'Vacina',
        date: new Date().toISOString(),
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('filters by date when listing', async () => {
    prisma.appointment.findMany.mockResolvedValueOnce([]);
    await service.findAll(1, { date: '2025-05-18', service: 'Vacina' });

    const call = prisma.appointment.findMany.mock.calls[0][0];
    expect(call.where.pet.ownerId).toBe(1);
    expect(call.where.date.gte).toBeInstanceOf(Date);
    expect(call.where.service).toEqual({ contains: 'Vacina' });
  });

  it('notifies webhook on status change', async () => {
    const existing = {
      id: 1,
      petId: 1,
      service: 'Vacina',
      status: AppointmentStatus.SCHEDULED,
      pet: { ownerId: 1 },
    };
    prisma.appointment.findUnique.mockResolvedValue(existing);
    prisma.appointment.update.mockResolvedValue({
      ...existing,
      status: AppointmentStatus.CONFIRMED,
    });

    await service.update(1, 1, { status: AppointmentStatus.CONFIRMED });

    expect(webhooksService.notifyAppointmentStatusChange).toHaveBeenCalled();
  });

  it('throws when trying to remove appointment from another user', async () => {
    prisma.appointment.findUnique.mockResolvedValueOnce({
      id: 1,
      pet: { ownerId: 2 },
    });

    await expect(service.remove(1, 1)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('throws when appointment not found', async () => {
    prisma.appointment.findUnique.mockResolvedValueOnce(null);
    await expect(service.findOne(1, 999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
