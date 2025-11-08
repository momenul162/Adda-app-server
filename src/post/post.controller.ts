import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ReactionDto } from './dto/reaction.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() createPostDto: CreatePostDto) {
    const post = await this.postService.create(createPostDto);
    return { message: 'Uploaded successfully', post };
  }

  @Get()
  async findAll() {
    return this.postService.findAll();
  }

  @Get(':postId')
  async findOne(@Param('postId') postId: string) {
    return this.postService.findOne(postId);
  }

  @Patch(':postId')
  async update(@Param('postId') postId: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(postId, updatePostDto);
  }

  @Delete(':postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('postId') postId: string) {
    return this.postService.remove(postId);
  }

  @Patch(':postId/reaction')
  async handleReaction(@Param('postId') postId: string, @Body() reactionDto: ReactionDto) {
    return this.postService.handleReaction(postId, reactionDto);
  }
}
