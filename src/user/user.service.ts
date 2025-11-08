import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../database/schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findAll() {
    return this.userModel
      .find()
      .populate('friends', 'username email photo')
      .populate('friendRequests', 'username email photo')
      .populate('sentRequests', 'username email photo');
  }

  async findById(id: string) {
    const user = await this.userModel
      .findById(id)
      .populate('friends', 'username email photo')
      .populate('friendRequests', 'username email photo')
      .populate('sentRequests', 'username email photo');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async sendFriendRequest(userId: string, friendId: string) {
    if (userId === friendId) {
      throw new BadRequestException("You can't send a request to yourself!");
    }

    const user = await this.userModel.findById(userId);
    const friend = await this.userModel.findById(friendId);

    if (!user || !friend) {
      throw new NotFoundException('User not found');
    }

    if (user.friends.includes(friendId as any)) {
      throw new BadRequestException('Already friend!');
    }

    if (user.sentRequests.includes(friendId as any)) {
      throw new BadRequestException('Request already sent!');
    }

    user.sentRequests.push(friendId as any);
    friend.friendRequests.push(userId as any);

    await user.save();
    await friend.save();

    const populatedUser = await this.findById(userId);
    const populatedFriend = await this.findById(friendId);

    return {
      message: 'Friend request sent',
      user: populatedUser,
      friend: populatedFriend,
    };
  }

  async acceptFriendRequest(userId: string, friendId: string) {
    const user = await this.userModel.findById(userId);
    const friend = await this.userModel.findById(friendId);

    if (!user || !friend) {
      throw new NotFoundException('User not found');
    }

    if (!user.friendRequests.includes(friendId as any)) {
      throw new BadRequestException('No friend request found!');
    }

    user.friends.push(friendId as any);
    (user.friendRequests as any).pull(friendId);
    friend.friends.push(userId as any);
    (friend.sentRequests as any).pull(userId);

    await user.save();
    await friend.save();

    const populatedUser = await this.findById(userId);
    const populatedFriend = await this.findById(friendId);

    return {
      message: 'Friend request accepted',
      user: populatedUser,
      friend: populatedFriend,
    };
  }

  async rejectFriendRequest(userId: string, friendId: string) {
    const user = await this.userModel.findById(userId);
    const friend = await this.userModel.findById(friendId);

    if (!user || !friend) {
      throw new NotFoundException('User not found');
    }

    if (!user.friendRequests.includes(friendId as any)) {
      throw new BadRequestException('No friend request found!');
    }

    (user.friendRequests as any).pull(friendId);
    (friend.sentRequests as any).pull(userId);

    await user.save();
    await friend.save();

    const populatedUser = await this.findById(userId);
    const populatedFriend = await this.findById(friendId);

    return {
      message: 'Friend request rejected',
      user: populatedUser,
      friend: populatedFriend,
    };
  }

  async cancelFriendRequest(userId: string, friendId: string) {
    const user = await this.userModel.findById(userId);
    const friend = await this.userModel.findById(friendId);

    if (!user || !friend) {
      throw new NotFoundException('User not found');
    }

    if (!user.sentRequests.includes(friendId as any)) {
      throw new BadRequestException('No friend request found!');
    }

    (user.sentRequests as any).pull(friendId);
    (friend.friendRequests as any).pull(userId);

    await user.save();
    await friend.save();

    const populatedUser = await this.findById(userId);
    const populatedFriend = await this.findById(friendId);

    return {
      message: 'Friend request cancelled',
      user: populatedUser,
      friend: populatedFriend,
    };
  }
}
