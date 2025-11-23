import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AppointmentStatus } from '@prisma/client';

export class CreateAppointmentDto {
  @ApiProperty({ example: '2025-05-18T14:00:00Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'Consulta geral' })
  @IsString()
  @IsNotEmpty()
  service: string;

  @ApiPropertyOptional({ example: 'Trazer exames anteriores' })
  @IsOptional()
  @IsString()
  observations?: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  petId: number;

  @ApiPropertyOptional({ enum: AppointmentStatus, example: AppointmentStatus.SCHEDULED })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}
