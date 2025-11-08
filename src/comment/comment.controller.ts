import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() createCommentDto: CreateCommentDto) {
    const comment = await this.commentService.create(createCommentDto);
    return { message: 'Commented successfully', comment };
  }

  @Get('post/:postId')
  async findByPostId(@Param('postId') postId: string) {
    return this.commentService.findByPostId(postId);
  }
}
