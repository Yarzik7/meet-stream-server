import { sign } from 'jsonwebtoken';
import { TUserDocument } from 'src/types/User.types';
import { Schema } from 'mongoose';

interface IPayload {
  id: Schema.Types.ObjectId;
  email: string;
}

interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export const assignToken = async (user: TUserDocument): Promise<ITokens> => {
  const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES_IN } = process.env;

  const payload: IPayload = {
    id: user._id,
    email: user.email,
  };

  const accessToken = sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });

  const refreshToken = sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
};
