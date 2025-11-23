import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Appointment, AppointmentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { WebhooksService } from '../webhooks/webhooks.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ListAppointmentsDto } from './dto/list-appointments.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly webhooksService: WebhooksService,
  ) {}

  async create(userId: number, dto: CreateAppointmentDto) {
    await this.ensurePetOwnership(userId, dto.petId);
    return this.prisma.appointment.create({
      data: {
        petId: dto.petId,
        service: dto.service,
        observations: dto.observations,
        status: dto.status ?? AppointmentStatus.SCHEDULED,
        date: new Date(dto.date),
      },
    });
  }

  findAll(userId: number, filters: ListAppointmentsDto) {
    const dateRange = filters.date ? this.buildDateRange(filters.date) : undefined;

    return this.prisma.appointment.findMany({
      where: {
        pet: { ownerId: userId },
        date: dateRange,
        service: filters.service ? { contains: filters.service } : undefined,
        status: filters.status,
      },
      include: { pet: true },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(userId: number, id: number) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: { pet: true },
    });
    if (!appointment) throw new NotFoundException('Agendamento não encontrado.');
    if (appointment.pet.ownerId !== userId) {
      throw new ForbiddenException('Você não tem acesso a este agendamento.');
    }
    return appointment;
  }

  async update(userId: number, id: number, dto: UpdateAppointmentDto) {
    const appointment = await this.ensureOwnership(userId, id);
    if (dto.petId) {
      await this.ensurePetOwnership(userId, dto.petId);
    }

    const updated = await this.prisma.appointment.update({
      where: { id },
      data: {
        ...dto,
        date: dto.date ? new Date(dto.date) : undefined,
      },
    });

    if (dto.status && dto.status !== appointment.status) {
      try {
        await this.webhooksService.notifyAppointmentStatusChange(updated);
      } catch (error) {
        this.logger.warn(`Webhook falhou: ${error?.message ?? error}`);
      }
    }

    return updated;
  }

  async remove(userId: number, id: number) {
    await this.ensureOwnership(userId, id);
    await this.prisma.appointment.delete({ where: { id } });
    return { deleted: true };
  }

  private async ensureOwnership(userId: number, appointmentId: number) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { pet: true },
    });
    if (!appointment) throw new NotFoundException('Agendamento não encontrado.');
    if (appointment.pet.ownerId !== userId) {
      throw new ForbiddenException('Você não tem acesso a este agendamento.');
    }
    return appointment;
  }

  private async ensurePetOwnership(userId: number, petId: number) {
    const pet = await this.prisma.pet.findUnique({ where: { id: petId } });
    if (!pet) throw new NotFoundException('Pet não encontrado para agendar.');
    if (pet.ownerId !== userId) {
      throw new ForbiddenException('Você não pode agendar para este pet.');
    }
  }

  private buildDateRange(dateString: string) {
    const date = new Date(dateString);
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);
    return { gte: start, lte: end };
  }
}
