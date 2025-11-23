import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePetDto {
  @ApiProperty({ example: 'Bolt' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Dog' })
  @IsString()
  @IsNotEmpty()
  species: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  age?: number;

  @ApiPropertyOptional({ example: 12.5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({ example: 'Prefers soft food', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  observations?: string;
}
