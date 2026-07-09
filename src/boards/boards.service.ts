import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(title: string, ownerId: string) {
    return this.prisma.board.create({
        data: {
        title,
        ownerId,
        },
    });
  }

  async findAll(ownerId: string) {
    return this.prisma.board.findMany({
        where: {
        ownerId,
        deletedAt: null,
        },
        orderBy: {
        createdAt: 'desc',
        },
    });
   }

    async findOne(id: string, ownerId: string) {
        const board = await this.prisma.board.findFirst({
            where: {
            id,
            ownerId,
            deletedAt: null,
            },
            include: {
            columns: {
                orderBy: {
                order: 'asc',
                },
                include: {
                tasks: {
                    where: {
                    deletedAt: null,
                    },
                    orderBy: {
                    position: 'asc',
                    },
                    include: {
                    assignee: {
                        select: {
                        id: true,
                        name: true,
                        email: true,
                        },
                    },
                    labels: true,
                    },
                },
                },
            },
            },
        });

        if (!board) {
            throw new NotFoundException('Board not found');
        }

        return board;
    }

    async update(
        id: string,
        ownerId: string,
        dto: UpdateBoardDto,
        ) {
        await this.findOne(id, ownerId);

        return this.prisma.board.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string, ownerId: string) {
        await this.findOne(id, ownerId);

        return this.prisma.board.update({
            where: {
            id,
            },
            data: {
            deletedAt: new Date(),
            },
        });
    }
}