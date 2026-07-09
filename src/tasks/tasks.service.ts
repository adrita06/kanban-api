import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ColumnsService } from '../columns/columns.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly columnsService: ColumnsService,
  ) {}

  async create(
    columnId: string,
    ownerId: string,
    dto: CreateTaskDto,
    ) {
    await this.columnsService.findOwnedColumn(
        columnId,
        ownerId,
    );

    const lastTask = await this.prisma.task.findFirst({
        where: {
        columnId,
        deletedAt: null,
        },
        orderBy: {
        position: 'desc',
        },
    });

    const position = lastTask
        ? lastTask.position + 1
        : 1;

    return this.prisma.task.create({
        data: {
        title: dto.title,
        description: dto.description,
        priority: dto.priority,
        dueDate: dto.dueDate
            ? new Date(dto.dueDate)
            : null,
        position,
        columnId,
        },
    });
    }

    private async findOwnedTask(
  taskId: string,
  ownerId: string,
) {
  const task = await this.prisma.task.findFirst({
    where: {
      id: taskId,
      deletedAt: null,
      column: {
        board: {
          ownerId,
          deletedAt: null,
        },
      },
    },
    include: {
      labels: true,
    },
  });

  if (!task) {
    throw new NotFoundException('Task not found');
  }

  return task;
}

async update(
  taskId: string,
  ownerId: string,
  dto: UpdateTaskDto,
) {
  await this.findOwnedTask(taskId, ownerId);

  return this.prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      title: dto.title,
      description: dto.description,
      priority: dto.priority,
      dueDate: dto.dueDate
        ? new Date(dto.dueDate)
        : undefined,
      assigneeId: dto.assigneeId,
      columnId: dto.columnId,
    },
  });
}

async remove(
  taskId: string,
  ownerId: string,
) {
  await this.findOwnedTask(taskId, ownerId);

  return this.prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      deletedAt: new Date(),
    },
  });
}

async move(
  taskId: string,
  ownerId: string,
  dto: MoveTaskDto,
) {
  const task = await this.findOwnedTask(taskId, ownerId);

  const oldColumnId = task.columnId;
  const newColumnId = dto.columnId;

  return this.prisma.$transaction(async (tx) => {
    // Moving within the same column
    if (oldColumnId === newColumnId) {
      if (dto.position > task.position) {
        // Moving down
        await tx.task.updateMany({
          where: {
            columnId: oldColumnId,
            deletedAt: null,
            position: {
              gt: task.position,
              lte: dto.position,
            },
          },
          data: {
            position: {
              decrement: 1,
            },
          },
        });
      } else if (dto.position < task.position) {
        // Moving up
        await tx.task.updateMany({
          where: {
            columnId: oldColumnId,
            deletedAt: null,
            position: {
              gte: dto.position,
              lt: task.position,
            },
          },
          data: {
            position: {
              increment: 1,
            },
          },
        });
      }
    }

    // Moving to another column
    else {
      // Close the gap in the old column
      await tx.task.updateMany({
        where: {
          columnId: oldColumnId,
          deletedAt: null,
          position: {
            gt: task.position,
          },
        },
        data: {
          position: {
            decrement: 1,
          },
        },
      });

      // Make room in the new column
      await tx.task.updateMany({
        where: {
          columnId: newColumnId,
          deletedAt: null,
          position: {
            gte: dto.position,
          },
        },
        data: {
          position: {
            increment: 1,
          },
        },
      });
    }

    // Update the moved task
    return tx.task.update({
      where: {
        id: taskId,
      },
      data: {
        columnId: newColumnId,
        position: dto.position,
      },
    });
  });
}

}
