import { Schema } from 'mongoose';

interface ITokenPayload {
  id: Schema.Types.ObjectId;
  email: string;
}

interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export { ITokenPayload, ITokens };
