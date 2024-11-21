import { Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { LogoutAuthDto } from './dto/logout-auth.dto';

@Injectable()
export class AuthService {
  register(registerAuthDto: RegisterAuthDto) {
    return registerAuthDto;
  }

  login(loginAuthDto: LoginAuthDto) {
    return loginAuthDto;
  }

  logout(logoutAuthDto: LogoutAuthDto) {
    return logoutAuthDto;
  }
}
