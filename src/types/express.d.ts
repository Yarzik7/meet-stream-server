import type { UserDocument } from 'src/modules/auth/models/user.schema';

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}
