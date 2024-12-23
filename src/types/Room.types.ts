import { Schema, Document } from 'mongoose';

interface IRoom {
  _id: Schema.Types.ObjectId;
  room_name: string;
}

type TRoomDocument = IRoom & Document;

export { IRoom, TRoomDocument };
