import { Request } from 'express';

import { ForbiddenError } from "../errors/ApiError";
import { UserDocument } from "../model/UserModel";

export const getUserFromRequest = (req: Request): UserDocument => {
  const user = req.user as UserDocument | undefined;
  if (!user) {
    throw new ForbiddenError('User is not defined, need to login');
  }

  return user;
};