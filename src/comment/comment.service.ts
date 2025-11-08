import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../database/schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const { userId, postId, body } = createCommentDto;

    const comment = new this.commentModel({ userId, postId, body });
    await comment.save();

    const populated = await this.commentModel
      .findById(comment._id)
      .populate({
        path: 'userId',
        select: 'username photo',
      });

    return populated;
  }

  async findByPostId(postId: string) {
    return this.commentModel
      .find({ postId })
      .populate({
        path: 'userId',
        select: 'username photo',
      });
  }
}
