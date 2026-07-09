import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UpdateColumnDto } from './dto/update-column.dto';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';

@Controller()
@UseGuards(JwtAuthGuard)
export class ColumnsController {
  constructor(
    private readonly columnsService: ColumnsService,
  ) {}

  @Post('boards/:boardId/columns')
  create(
    @Param('boardId') boardId: string,
    @Body() dto: CreateColumnDto,
    @GetUser() user: any,
  ) {
    return this.columnsService.create(
      boardId,
      user.userId,
      dto,
    );
  }

  @Get('boards/:boardId/columns')
    findAll(
    @Param('boardId') boardId: string,
    @GetUser() user: any,
    ) {
    return this.columnsService.findAll(
        boardId,
        user.userId,
    );
  }

    @Patch('columns/:id')
    update(
    @Param('id') id: string,
    @Body() dto: UpdateColumnDto,
    @GetUser() user: JwtPayload,
    ) {
    return this.columnsService.update(
        id,
        user.userId,
        dto,
    );
    }

  @Delete('columns/:id')
    remove(
    @Param('id') id: string,
    @GetUser() user: JwtPayload,
    ) {
    return this.columnsService.remove(
        id,
        user.userId,
    );
  }
}
