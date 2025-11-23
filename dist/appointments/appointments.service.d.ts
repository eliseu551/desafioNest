import { PrismaService } from '../prisma/prisma.service';
import { WebhooksService } from '../webhooks/webhooks.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ListAppointmentsDto } from './dto/list-appointments.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
export declare class AppointmentsService {
    private readonly prisma;
    private readonly webhooksService;
    private readonly logger;
    constructor(prisma: PrismaService, webhooksService: WebhooksService);
    create(userId: number, dto: CreateAppointmentDto): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        observations: string | null;
        date: Date;
        service: string;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        petId: number;
    }>;
    findAll(userId: number, filters: ListAppointmentsDto): import(".prisma/client").Prisma.PrismaPromise<({
        pet: {
            name: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            species: string;
            age: number | null;
            weight: number | null;
            observations: string | null;
            ownerId: number;
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        observations: string | null;
        date: Date;
        service: string;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        petId: number;
    })[]>;
    findOne(userId: number, id: number): Promise<{
        pet: {
            name: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            species: string;
            age: number | null;
            weight: number | null;
            observations: string | null;
            ownerId: number;
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        observations: string | null;
        date: Date;
        service: string;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        petId: number;
    }>;
    update(userId: number, id: number, dto: UpdateAppointmentDto): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        observations: string | null;
        date: Date;
        service: string;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        petId: number;
    }>;
    remove(userId: number, id: number): Promise<{
        deleted: boolean;
    }>;
    private ensureOwnership;
    private ensurePetOwnership;
    private buildDateRange;
}
