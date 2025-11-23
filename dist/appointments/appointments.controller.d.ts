import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ListAppointmentsDto } from './dto/list-appointments.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(user: any, dto: CreateAppointmentDto): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        observations: string | null;
        date: Date;
        service: string;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        petId: number;
    }>;
    findAll(user: any, filters: ListAppointmentsDto): import(".prisma/client").Prisma.PrismaPromise<({
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
    findOne(user: any, id: number): Promise<{
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
    update(user: any, id: number, dto: UpdateAppointmentDto): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        observations: string | null;
        date: Date;
        service: string;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        petId: number;
    }>;
    remove(user: any, id: number): Promise<{
        deleted: boolean;
    }>;
}
