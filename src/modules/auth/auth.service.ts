import { Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { LogoutAuthDto } from './dto/logout-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './models/user.schema';
import { Model } from 'mongoose';
import { compare } from 'bcryptjs';
import { assignToken } from 'src/utils/assignToken';

export interface IUserResponse {
  message: string;
}

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async register(registerAuthDto: RegisterAuthDto): Promise<User | IUserResponse> {
    const user = await this.userModel.findOne({ email: registerAuthDto.email });

    if (user) {
      console.log('This user is exist');
      return { message: 'This user is exist' };
    }

    const registeredUser = new this.userModel({
      ...registerAuthDto,
    });

    return registeredUser.save();
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.userModel.findOne({
      email: loginAuthDto.email,
    });

    if (!user) {
      console.log('User not found');
    }

    const isPasswordCorrect: boolean = await compare(loginAuthDto.password, user.password);

    if (!isPasswordCorrect) {
      console.log('Email or password is incorrect');
    }

    const { accessToken, refreshToken } = await assignToken(user);
    await this.userModel.findByIdAndUpdate(user._id, { refreshToken });

    return accessToken;
  }

  async logout(logoutAuthDto: LogoutAuthDto) {
    await this.userModel.findByIdAndUpdate(logoutAuthDto._id, {
      refreshToken: null,
    });
  }
}
