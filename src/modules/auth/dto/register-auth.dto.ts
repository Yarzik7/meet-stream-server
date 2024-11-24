import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { IUser } from 'src/types/User.types';

export class RegisterAuthDto implements Omit<IUser, '_id' | 'refreshToken'> {
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, { message: 'Name must only contain letters' })
  name: string;

  @IsString()
  username: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  password: string;
}
