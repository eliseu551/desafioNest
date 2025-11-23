"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AppointmentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const webhooks_service_1 = require("../webhooks/webhooks.service");
let AppointmentsService = AppointmentsService_1 = class AppointmentsService {
    constructor(prisma, webhooksService) {
        this.prisma = prisma;
        this.webhooksService = webhooksService;
        this.logger = new common_1.Logger(AppointmentsService_1.name);
    }
    async create(userId, dto) {
        await this.ensurePetOwnership(userId, dto.petId);
        return this.prisma.appointment.create({
            data: {
                petId: dto.petId,
                service: dto.service,
                observations: dto.observations,
                status: dto.status ?? client_1.AppointmentStatus.SCHEDULED,
                date: new Date(dto.date),
            },
        });
    }
    findAll(userId, filters) {
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
    async findOne(userId, id) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id },
            include: { pet: true },
        });
        if (!appointment)
            throw new common_1.NotFoundException('Agendamento não encontrado.');
        if (appointment.pet.ownerId !== userId) {
            throw new common_1.ForbiddenException('Você não tem acesso a este agendamento.');
        }
        return appointment;
    }
    async update(userId, id, dto) {
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
            }
            catch (error) {
                this.logger.warn(`Webhook falhou: ${error?.message ?? error}`);
            }
        }
        return updated;
    }
    async remove(userId, id) {
        await this.ensureOwnership(userId, id);
        await this.prisma.appointment.delete({ where: { id } });
        return { deleted: true };
    }
    async ensureOwnership(userId, appointmentId) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: { pet: true },
        });
        if (!appointment)
            throw new common_1.NotFoundException('Agendamento não encontrado.');
        if (appointment.pet.ownerId !== userId) {
            throw new common_1.ForbiddenException('Você não tem acesso a este agendamento.');
        }
        return appointment;
    }
    async ensurePetOwnership(userId, petId) {
        const pet = await this.prisma.pet.findUnique({ where: { id: petId } });
        if (!pet)
            throw new common_1.NotFoundException('Pet não encontrado para agendar.');
        if (pet.ownerId !== userId) {
            throw new common_1.ForbiddenException('Você não pode agendar para este pet.');
        }
    }
    buildDateRange(dateString) {
        const date = new Date(dateString);
        const start = new Date(date);
        start.setUTCHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setUTCHours(23, 59, 59, 999);
        return { gte: start, lte: end };
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = AppointmentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        webhooks_service_1.WebhooksService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map