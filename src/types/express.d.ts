import type { TUserDocument } from './User.types';

declare global {
  namespace Express {
    interface Request {
      user?: TUserDocument;
    }
  }
}
