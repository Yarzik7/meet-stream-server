import { Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { LogoutAuthDto } from './dto/logout-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './models/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async register(registerAuthDto: RegisterAuthDto): Promise<User> {
    const registeredUser = new this.userModel(registerAuthDto);
    return registeredUser.save();
  }

  login(loginAuthDto: LoginAuthDto) {
    return loginAuthDto;
  }

  logout(logoutAuthDto: LogoutAuthDto) {
    return logoutAuthDto;
  }
}
