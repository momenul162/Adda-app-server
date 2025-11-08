import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../database/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, email, phone, password, photo, country } = registerDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new this.userModel({
      username,
      email,
      phone,
      password: hash,
      photo,
      country,
    });

    await user.save();
    return user;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('Invalid Credential');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new BadRequestException('Invalid Credential');
    }

    const payload = {
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      photo: user.photo,
      country: user.country,
      isActive: user.isActive,
      currentCity: user.currentCity,
      dateOfBirth: user.dateOfBirth,
      occupation: user.occupation,
      friends: user.friends,
      friendRequests: user.friendRequests,
      sentRequests: user.sentRequests,
    };

    const token = this.jwtService.sign(payload);

    const populatedUser = await this.userModel
      .findById(user._id)
      .populate('friends', 'username email photo')
      .populate('friendRequests', 'username email photo')
      .populate('sentRequests', 'username email photo');

    return {
      user: populatedUser,
      token,
    };
  }
}
