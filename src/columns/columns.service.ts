import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BoardsService } from '../boards/boards.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Injectable()
export class ColumnsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly boardsService: BoardsService,
  ) {}

  async create(
    boardId: string,
    ownerId: string,
    dto: CreateColumnDto,
    ) {
    await this.boardsService.findOne(boardId, ownerId);

    return this.prisma.column.create({
        data: {
        title: dto.title,
        order: dto.order,
        boardId,
        },
    });
  }

  async findAll(boardId: string, ownerId: string) {
    await this.boardsService.findOne(boardId, ownerId);

    return this.prisma.column.findMany({
        where: {
        boardId,
        },
        orderBy: {
        order: 'asc',
        },
    });
  }

  async findOwnedColumn(
    columnId: string,
    ownerId: string,
    ) {
    const column = await this.prisma.column.findFirst({
        where: {
        id: columnId,
        board: {
            ownerId,
            deletedAt: null,
        },
        },
    });

    if (!column) {
        throw new NotFoundException('Column not found');
    }

    return column;
  }

    async update(
    columnId: string,
    ownerId: string,
    dto: UpdateColumnDto,
    ) {
    await this.findOwnedColumn(columnId, ownerId);

    return this.prisma.column.update({
        where: {
        id: columnId,
        },
        data: dto,
    });
  }
  
  async remove(
    columnId: string,
    ownerId: string,
    ) {
    await this.findOwnedColumn(columnId, ownerId);

    return this.prisma.column.delete({
        where: {
        id: columnId,
        },
    });
 }

 
}
