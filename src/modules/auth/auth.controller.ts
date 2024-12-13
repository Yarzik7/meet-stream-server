import { Controller, Post, Get, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { LogoutAuthDto } from './dto/logout-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerAuthDto: RegisterAuthDto) {
    const registeredUser = (await this.authService.register(registerAuthDto)).toObject();
    delete registeredUser.password;

    return registeredUser;
  }

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    const userData = await this.authService.login(loginAuthDto);
    delete userData.user.password;
    delete userData.user.refreshToken;
    return userData;
  }

  @Post('logout')
  async logout(@Req() logoutAuthDto: LogoutAuthDto) {
    await this.authService.logout(logoutAuthDto);
    return { message: 'Success of logout' };
  }

  @Get('current')
  async current(@Req() currentUserDto: LogoutAuthDto) {
    const currentUser = currentUserDto.user.toObject();

    delete currentUser.password;
    delete currentUser.refreshToken;

    return { user: currentUser };
  }
}
