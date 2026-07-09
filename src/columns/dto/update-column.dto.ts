import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateColumnDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsInt()
  order?: number;
}