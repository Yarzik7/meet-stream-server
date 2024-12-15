import { Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { LogoutAuthDto } from './dto/logout-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './models/user.schema';
import { Model } from 'mongoose';
import { compare } from 'bcryptjs';
import { assignToken } from 'src/utils/assignToken';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { TUserDocument } from 'src/types/User.types';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async register(registerAuthDto: RegisterAuthDto) {
    const user = await this.userModel.findOne({
      $or: [{ email: registerAuthDto.email }, { username: registerAuthDto.username }],
    });

    if (user) {
      if (user.username === registerAuthDto.username) {
        throw new ConflictException('User with this username already exists!');
      }

      if (user.email === registerAuthDto.email) {
        throw new ConflictException('User with this email already exists!');
      }
    }

    const createdUser = new this.userModel(registerAuthDto);

    return createdUser.save();
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user: TUserDocument = await this.userModel.findOne({
      email: loginAuthDto.email,
    });

    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect!');
    }

    const isPasswordCorrect: boolean = await compare(loginAuthDto.password, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Email or password is incorrect!');
    }

    const { accessToken, refreshToken } = await assignToken(user);
    await this.userModel.findByIdAndUpdate(user._id, { refreshToken });

    return { user: user.toObject(), accessToken };
  }

  async logout(logoutAuthDto: LogoutAuthDto) {
    await this.userModel.findByIdAndUpdate(logoutAuthDto.user._id, {
      refreshToken: null,
    });
  }
}
