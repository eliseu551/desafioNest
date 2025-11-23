import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebhooksService } from './webhooks.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [WebhooksService],
  exports: [WebhooksService],
})
export class WebhooksModule {}
