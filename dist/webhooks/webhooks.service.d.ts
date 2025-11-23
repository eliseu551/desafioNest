import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Appointment } from '@prisma/client';
export declare class WebhooksService {
    private readonly httpService;
    private readonly configService;
    private readonly logger;
    constructor(httpService: HttpService, configService: ConfigService);
    notifyAppointmentStatusChange(appointment: Appointment): Promise<void>;
}
