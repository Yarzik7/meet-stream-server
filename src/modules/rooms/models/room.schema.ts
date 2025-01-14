import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RoomDocument = HydratedDocument<Room>;

@Schema({ versionKey: false })
class Room {
  @Prop({ required: true })
  owner: string;
}

const RoomSchema = SchemaFactory.createForClass(Room);

export { Room, RoomSchema };
