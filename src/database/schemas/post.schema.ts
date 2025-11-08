import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop()
  image: string;

  @Prop()
  video: string;

  @Prop()
  body: string;

  @Prop({ default: Date.now })
  date: Date;

  @Prop({
    enum: ['PUBLIC', 'PRIVATE', 'FRIEND'],
    default: 'PUBLIC',
  })
  visibility: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  likes: MongooseSchema.Types.ObjectId[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  dislikes: MongooseSchema.Types.ObjectId[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
