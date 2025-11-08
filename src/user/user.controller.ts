import { Controller, Get, Patch, Post, Param, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserDocument } from '../database/schemas/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() user: UserDocument) {
    return this.userService.findById(user._id.toString());
  }

  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    return this.userService.findById(userId);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async update(@CurrentUser() user: UserDocument, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(user._id.toString(), updateUserDto);
  }

  @Post('friend-request/:friendId')
  @UseGuards(JwtAuthGuard)
  async sendFriendRequest(@CurrentUser() user: UserDocument, @Param('friendId') friendId: string) {
    return this.userService.sendFriendRequest(user._id.toString(), friendId);
  }

  @Post('accept-request/:friendId')
  @UseGuards(JwtAuthGuard)
  async acceptFriendRequest(@CurrentUser() user: UserDocument, @Param('friendId') friendId: string) {
    return this.userService.acceptFriendRequest(user._id.toString(), friendId);
  }

  @Post('reject-request/:friendId')
  @UseGuards(JwtAuthGuard)
  async rejectFriendRequest(@CurrentUser() user: UserDocument, @Param('friendId') friendId: string) {
    return this.userService.rejectFriendRequest(user._id.toString(), friendId);
  }

  @Post('cancel-request/:friendId')
  @UseGuards(JwtAuthGuard)
  async cancelFriendRequest(@CurrentUser() user: UserDocument, @Param('friendId') friendId: string) {
    return this.userService.cancelFriendRequest(user._id.toString(), friendId);
  }
}
