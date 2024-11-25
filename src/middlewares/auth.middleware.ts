import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { decode, JwtPayload, TokenExpiredError, verify } from 'jsonwebtoken';
import { User } from 'src/modules/auth/models/user.schema';
import type { TUserDocument } from 'src/types/User.types';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { assignToken } from 'src/utils/assignToken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer' || !token) {
      return next(new Error('Unauthorized'));
    }

    const payload: JwtPayload = decode(token) as JwtPayload;
    let fetchedUser: TUserDocument;

    try {
      fetchedUser = await this.userModel.findOne({ _id: payload.id });

      if (!fetchedUser || !fetchedUser.refreshToken) {
        return next(new Error('Unauthorized'));
      }

      verify(token, ACCESS_TOKEN_SECRET);
      req.user = fetchedUser;

      next();
    } catch (error) {
      if (!(error instanceof TokenExpiredError)) {
        return next(new Error('401 Unauthorized'));
      }

      try {
        verify(fetchedUser.refreshToken, REFRESH_TOKEN_SECRET);
        const { accessToken, refreshToken } = await assignToken(fetchedUser);

        await this.userModel.findByIdAndUpdate(fetchedUser._id, { refreshToken });
        
        res.json({ accessToken });
      } catch (_) {
        return next(new Error('401 Refresh token is expired'));
      }
    }
  }
}
