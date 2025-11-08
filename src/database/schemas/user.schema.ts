import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, minlength: 3 })
  username: string;

  @Prop({
    required: true,
    unique: true,
    validate: {
      validator: function (v: string) {
        return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v);
      },
      message: (prop) => `Invalid email: ${prop.value}`,
    },
  })
  email: string;

  @Prop()
  photo: string;

  @Prop()
  coverPhoto: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  country: string;

  @Prop({ maxlength: 250, default: '' })
  bio: string;

  @Prop({
    required: true,
    minlength: [6, 'Password is too short']
  })
  password: string;

  @Prop()
  currentCity: string;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  occupation: string;

  @Prop({
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'INACTIVE'
  })
  isActive: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  friends: MongooseSchema.Types.ObjectId[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  friendRequests: MongooseSchema.Types.ObjectId[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  sentRequests: MongooseSchema.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
