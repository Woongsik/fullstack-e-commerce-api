import { Request } from 'express';

import { ForbiddenError } from "../errors/ApiError";
import { UserDocument } from "../model/UserModel";
import { Size } from '../misc/types/Size';

export const getUserFromRequest = (req: Request): UserDocument => {
  const user = req.user as UserDocument | undefined;
  if (!user) {
    throw new ForbiddenError('User is not defined, need to login');
  }

  return user;
};

export const sortSizes = (sizes: Size[]) => {
  const scorer = {
    [Size.Small]: 0,
    [Size.Medium]: 1,
    [Size.Large]: 2,
    [Size.OneSize]: 3
 }
 
 const sortedSizes = sizes.sort((a: Size, b: Size) => {
    return scorer[a]-scorer[b];
 });

 return sortedSizes;
}