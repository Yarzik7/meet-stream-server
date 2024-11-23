import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { LogoutAuthDto } from './dto/logout-auth.dto';
import { User } from './models/user.schema';
import type { IUserResponse } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerAuthDto: RegisterAuthDto): Promise<User | IUserResponse> {
    return this.authService.register(registerAuthDto);
  }

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    const accessToken = await this.authService.login(loginAuthDto);
    return { accessToken };
  }

  @Post('logout')
  async logout(@Body() logoutAuthDto: LogoutAuthDto) {
    // await this.authService.logout(logoutAuthDto.user._id);
    await this.authService.logout(logoutAuthDto);
    return { message: 'Succes of logout' };
  }
}
