import { NextFunction, Request, Response } from 'express';
import { User } from '../models/user';

export async function loadLoggedInUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.session.loggedinUserId) {
    return next();
  }

  const user = await User.findByPk(req.session.loggedinUserId);
  if (user === null) {
    // user deleted or somehow mocked session. Logout and continue...
    req.session.loggedinUserId = undefined;
  } else {
    req.user = user;
  }
  return next();
}
