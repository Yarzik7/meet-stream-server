import { Schema, Document } from 'mongoose';

interface IRoom {
  _id: Schema.Types.ObjectId;
  owner: string;
}

type TRoomDocument = IRoom & Document;

export { IRoom, TRoomDocument };
