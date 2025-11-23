import { AppointmentStatus } from '@prisma/client';
export declare class ListAppointmentsDto {
    date?: string;
    service?: string;
    status?: AppointmentStatus;
}
