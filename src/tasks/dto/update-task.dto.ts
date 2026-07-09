import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsArray,
} from 'class-validator';
import { Priority } from '@prisma/client';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  assigneeId?: string;

  @IsOptional()
  @IsArray()
  labels?: {
    name: string;
    color: string;
  }[];

  @IsOptional()
  @IsString()
  columnId?: string;
}