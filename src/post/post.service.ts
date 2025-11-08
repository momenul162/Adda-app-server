import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from '../database/schemas/post.schema';
import { User, UserDocument } from '../database/schemas/user.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ReactionDto } from './dto/reaction.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  async create(createPostDto: CreatePostDto) {
    const { userId, image, video, body, visibility } = createPostDto;

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('Unauthorized');
    }

    const newPost = new this.postModel({ userId, image, video, body, visibility });
    await newPost.save();

    const populated = await this.postModel
      .findById(newPost._id)
      .populate({
        path: 'userId',
        select: 'username photo country',
      });

    return populated;
  }

  async findAll() {
    const posts = await this.postModel
      .find()
      .populate({
        path: 'userId',
        select: 'username photo country',
      });
    return this.shuffleArray(posts);
  }

  async findOne(id: string) {
    const post = await this.postModel
      .findById(id)
      .populate({
        path: 'userId',
        select: 'username photo country',
      });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.postModel.findById(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (updatePostDto.body !== undefined) post.body = updatePostDto.body;
    if (updatePostDto.visibility !== undefined) post.visibility = updatePostDto.visibility;
    if (updatePostDto.image !== undefined) post.image = updatePostDto.image;
    if (updatePostDto.video !== undefined) post.video = updatePostDto.video;

    await post.save();

    const populated = await this.postModel
      .findById(id)
      .populate({
        path: 'userId',
        select: 'username photo country',
      });

    return populated;
  }

  async remove(id: string) {
    const post = await this.postModel.findById(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await post.deleteOne();
    return { message: 'Post deleted successfully' };
  }

  async handleReaction(id: string, reactionDto: ReactionDto) {
    const { userId, type } = reactionDto;

    const post = await this.postModel
      .findById(id)
      .populate('userId', 'username photo country');

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (type !== 'like' && type !== 'dislike') {
      throw new BadRequestException("Invalid reaction type. Must be 'like' or 'dislike'");
    }

    const userIdObjectId = new Types.ObjectId(userId);

    const existLike = post.likes.some((id) => (id as any).equals(userIdObjectId));
    const existDislike = post.dislikes.some((id) => (id as any).equals(userIdObjectId));

    if (type === 'like') {
      if (existLike) {
        post.likes = post.likes.filter((id) => !(id as any).equals(userIdObjectId));
      } else {
        post.likes.push(userIdObjectId as any);
        if (existDislike) {
          post.dislikes = post.dislikes.filter((id) => !(id as any).equals(userIdObjectId));
        }
      }
    } else if (type === 'dislike') {
      if (existDislike) {
        post.dislikes = post.dislikes.filter((id) => !(id as any).equals(userIdObjectId));
      } else {
        post.dislikes.push(userIdObjectId as any);
        if (existLike) {
          post.likes = post.likes.filter((id) => !(id as any).equals(userIdObjectId));
        }
      }
    }

    await post.save();
    return post;
  }
}
