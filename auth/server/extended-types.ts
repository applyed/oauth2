import { User } from '../models/user';

declare module 'express-session' {
  interface SessionData {
    loggedinUserId: number;
  }
}

declare global {
  //eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

export {};
