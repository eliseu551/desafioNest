import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Appointment } from '@prisma/client';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async notifyAppointmentStatusChange(appointment: Appointment) {
    const url = this.configService.get<string>('WEBHOOK_URL');
    if (!url) return;

    const payload = {
      id: appointment.id,
      petId: appointment.petId,
      service: appointment.service,
      status: appointment.status,
      date: appointment.date,
      updatedAt: appointment.updatedAt,
    };

    const request$ = this.httpService.post(url, payload);
    try {
      await lastValueFrom(request$);
    } catch (error) {
      this.logger.warn(
        `Webhook request failed for appointment ${appointment.id}: ${
          error?.message ?? error
        }`,
      );
    }
  }
}
