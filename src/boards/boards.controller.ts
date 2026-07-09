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

import { BoardsService } from './boards.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('boards')
@UseGuards(JwtAuthGuard)
export class BoardsController {
  constructor(
    private readonly boardsService: BoardsService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateBoardDto,
    @GetUser() user: any,
  ) {
    return this.boardsService.create(
      dto.title,
      user.userId,
    );
  }

  @Get()
    findAll(@GetUser() user: any) {
    return this.boardsService.findAll(user.userId);
 }

 @Get(':id')
    findOne(
    @Param('id') id: string,
    @GetUser() user: any,
    ) {
    return this.boardsService.findOne(
        id,
        user.userId,
    );
  }

  @Patch(':id')
    update(
    @Param('id') id: string,
    @Body() dto: UpdateBoardDto,
    @GetUser() user: any,
    ) {
    return this.boardsService.update(
        id,
        user.userId,
        dto,
    );
  }

  @Delete(':id')
    remove(
    @Param('id') id: string,
    @GetUser() user: any,
    ) {
    return this.boardsService.remove(
        id,
        user.userId,
    );
  }
}