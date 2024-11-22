import { IUser } from 'src/types/IUser.interface';

export class RegisterAuthDto implements Partial<IUser> {
  name: string;
  username: string;
  password: string;
  email: string;
}
