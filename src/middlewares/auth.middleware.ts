import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { decode, JwtPayload, TokenExpiredError, verify } from 'jsonwebtoken';
import { User } from 'src/modules/auth/models/user.schema';
import type { TUserDocument } from 'src/types/User.types';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { assignToken } from 'src/utils/assignToken';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer' || !token) {
      return next(new UnauthorizedException('Unauthorized'));
    }

    const payload: null | JwtPayload | string = decode(token);
    let fetchedUser: TUserDocument;

    try {
      fetchedUser = await this.userModel.findOne({ _id: payload.id });

      if (!fetchedUser || !fetchedUser.refreshToken) {
        return next(new UnauthorizedException('Unauthorized'));
      }

      verify(token, ACCESS_TOKEN_SECRET);
      req.user = fetchedUser;

      next();
    } catch (error) {
      if (!(error instanceof TokenExpiredError)) {
        return next(new UnauthorizedException('Unauthorized'));
      }

      try {
        verify(fetchedUser.refreshToken, REFRESH_TOKEN_SECRET);
        const { accessToken, refreshToken } = await assignToken(fetchedUser);

        await this.userModel.findByIdAndUpdate(fetchedUser._id, { refreshToken });

        res.json({ accessToken });
      } catch (error) {
        return next(new UnauthorizedException('Refresh token is expired'));
      }
    }
  }
}
