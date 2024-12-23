import { IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  room_name: string;
}
