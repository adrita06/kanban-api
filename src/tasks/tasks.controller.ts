import { Controller, Post, Param, Body, Patch, Delete } from '@nestjs/common';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MoveTaskDto } from './dto/move-task.dto';


@UseGuards(JwtAuthGuard)
@Controller()
export class TasksController {
    constructor(
        private readonly tasksService: TasksService,
    ) {}
    @Post('columns/:id/tasks')
        create(
        @Param('id') columnId: string,
        @Body() dto: CreateTaskDto,
        @GetUser() user: JwtPayload,
        ) {
        return this.tasksService.create(
            columnId,
            user.userId,
            dto,
        );
    }

    @Patch('tasks/:id')
update(
  @Param('id') id: string,
  @Body() dto: UpdateTaskDto,
  @GetUser() user: JwtPayload,
) {
  return this.tasksService.update(
    id,
    user.userId,
    dto,
  );
}

@Delete('tasks/:id')
remove(
  @Param('id') id: string,
  @GetUser() user: JwtPayload,
) {
  return this.tasksService.remove(
    id,
    user.userId,
  );
}

@Patch('tasks/:id/position')
    move(
    @Param('id') taskId: string,
    @Body() dto: MoveTaskDto,
    @GetUser() user: JwtPayload,
    ) {
    return this.tasksService.move(
        taskId,
        user.userId,
        dto,
    );
  }
}
