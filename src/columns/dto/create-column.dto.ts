import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateColumnDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsInt()
  order!: number;
}