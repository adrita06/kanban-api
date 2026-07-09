import { IsInt, IsString, Min } from 'class-validator';

export class MoveTaskDto {
  @IsString()
  columnId!: string;

  @IsInt()
  @Min(1)
  position!: number;
}