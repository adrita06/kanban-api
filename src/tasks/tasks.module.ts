import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { ColumnsModule } from '../columns/columns.module';

@Module({
  imports: [
    ColumnsModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
