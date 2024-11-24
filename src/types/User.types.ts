import { Schema, Document } from 'mongoose';

interface IUser {
  _id: Schema.Types.ObjectId;
  name: string;
  username: string;
  email: string;
  password: string;
  refreshToken?: string;
}

type TUserDocument = IUser & Document;

export { IUser, TUserDocument };
