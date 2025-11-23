import { AppointmentStatus } from '@prisma/client';
export declare class CreateAppointmentDto {
    date: string;
    service: string;
    observations?: string;
    petId: number;
    status?: AppointmentStatus;
}
