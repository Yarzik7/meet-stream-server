import { Schema } from 'mongoose';

export interface IUser {
  _id: Schema.Types.ObjectId;
  name: string;
  username: string;
  email: string;
  password: string;
  refreshToken?: string;
}
