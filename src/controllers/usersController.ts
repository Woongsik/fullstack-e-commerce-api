import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import usersService from '../services/usersService';
import {
  ApiError,
  BadRequest,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from '../errors/ApiError';
import { PasswordReset, PasswordUpdte } from '../misc/types/Password';
import User, { UserDocument } from '../model/UserModel';
import AuthUtil from '../misc/utils/AuthUtil';
import { JwtTokens } from '../misc/types/JwtPayload';
import { UserRole } from '../misc/types/User';

const getUserFromRequest = (req: Request): UserDocument => {
  const user = req.user as UserDocument | undefined;
  if (!user) {
    throw new ForbiddenError('User is not defined, need to login');
  }

  return user;
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users: UserDocument[] = await usersService.getAllUsers();
    if (users && users.length > 0) {
      return res.status(200).json(users);
    }

    throw new NotFoundError('No Users Found');
  } catch (e) {
    if (e instanceof mongoose.Error) {
      return next(new BadRequest(e.message ?? 'Wrong format to get Users'));
    } else if (e instanceof ApiError) {
      return next(e);
    }

    return next(new InternalServerError('Unknown error to get all users'));
  }
};

export const getUserById = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const userId: string = req.params.userId;
    const user: UserDocument | null = await usersService.getUserById(userId);
    if (user) {
      return res.status(200).json(user);
    }

    throw new NotFoundError('No matched user with the id');
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new BadRequest('Wrong id format'));
    } else if (error instanceof ApiError) {
      return next(error);
    }

    return next(new InternalServerError('Unknown error to get a user by id'));
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      // Check the admin mail, otherwise set Customer role
      // Admin can switch the role later
      let role: UserRole = UserRole.Customer;
      if (email === 'admin@mail.com') {
        role = UserRole.Admin;
      }
  
      const hashedPassword = await AuthUtil.getHashedAuth(password);
      const data = new User({
        ...req.body,
        password: hashedPassword,
        role: role,
      });
  
      const userData: UserDocument | null = await usersService.createUser(data);
      if (userData) {
        return res.status(201).json(userData);
      }
  
      throw new InternalServerError('Unknown error when saving new user');
    } catch (e) {
      if (e instanceof mongoose.Error) { // from mongoose
        return next(new BadRequest(e.message ??'Wrong data format to create'));
      } else if (e instanceof ApiError) {
        return next(e);
      }
      return next(new InternalServerError('Unknown error to create a user'));
    }
  };

export const checkEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const existedUser: UserDocument | null = await usersService.getUserByEmail(email);
    if (existedUser) {
      throw new BadRequest('The email is already in use');
    }

    return res.status(200).json({
      message: 'The email is good to go, not in use!'
    });
  } catch (e) {
    if (e instanceof mongoose.Error) { // from mongoose
      return next(new BadRequest(e.message ?? 'Wrong data format to check email'));
    } else if (e instanceof ApiError) {
      return next(e);
    }

    return next(new InternalServerError('Unknown error to check email in use'));
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user: UserDocument | null = await usersService.getUserByEmail(email);
    if (user) {
      const isMatched: boolean = await AuthUtil.comparePlainAndHashed(password,user.password);
      if (!isMatched) {
        throw new BadRequest("Password didn't match");
      }

      const tokens: JwtTokens = await AuthUtil.generateTokens(user);
      return res.status(200).json({ tokens, user });
    }

    throw new NotFoundError('User Not Found with the email');
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) { // from mongoose
      return next(new BadRequest('Wrong data format to login'));
    } else if (e instanceof ApiError) {
      return next(e);
    }

    return next(new InternalServerError('Unknown error to login'));
  }
};

export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: UserDocument = getUserFromRequest(req);
    if (user) {
      const tokens: JwtTokens = await AuthUtil.generateTokens(user);
      return res.status(200).json({ tokens, user });
    }

    throw new BadRequest('Something went wrong from your request');
  } catch (e) {
    if (e instanceof mongoose.Error) { // from mongoose
      return next(new BadRequest(e.message ?? 'Wrong format to login with google'));
    } else if (e instanceof ApiError) {
      return next(e);
    }

    return next(new InternalServerError('Unknown error to login with google'));
  }
};

export const forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resetPasswordInfo: PasswordReset = req.body;
    const matchedUser: UserDocument | null = await usersService.getUserByEmail(
      resetPasswordInfo.userEmail
    );

    if (!matchedUser) {
      throw new NotFoundError(
        `User not found with email ${resetPasswordInfo.userEmail}`
      );
    }

    // TODO send email one time password to reset password

    const plainPasswordToReset: string = `tempPasswordToReset_${matchedUser.firstname}`;
    const hashedPassword: string = await AuthUtil.getHashedAuth(plainPasswordToReset);
    matchedUser.password = hashedPassword;
    console.log('Temp passowrd:', plainPasswordToReset);

    const updatedUser: UserDocument | null = await usersService.resetPassword(matchedUser);
    if (updatedUser) {
      return res.status(200).json(updatedUser);
    }

    throw new ForbiddenError('Not allowed to reset the password');
  } catch (e) {
    if (e instanceof mongoose.Error) { // from mongoose
      return next(new BadRequest(e.message ?? 'Wrong format to reset password'));
    } else if (e instanceof ApiError) {
      return next(e);
    }

    return next(new InternalServerError('Unknwon error to reset the password'));
  }
};

export const updateUser = async (req: Request,res: Response, next: NextFunction) => {
  try {
    const user: UserDocument = getUserFromRequest(req);
    const updatedUser: UserDocument | null = await usersService.updateUser(user._id, req.body);
    if (updatedUser) {
      return res.status(200).json(updatedUser);
    }

    throw new ForbiddenError('Updating user is not allowed');
  } catch (e) {
    if (e instanceof mongoose.Error) { // from mongoose
      return next(new BadRequest(e.message ?? 'Wrong data format to udpate'));
    } else if (e instanceof ApiError) {
      return next(e);
    }

    return next(new InternalServerError('Internal Server Error'));
  }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updateInfo: PasswordUpdte = req.body;
    const user: UserDocument = getUserFromRequest(req);
    const passwordMatched: boolean = await AuthUtil.comparePlainAndHashed(
      updateInfo.oldPassword,
      user.password
    );
    if (!passwordMatched) {
      throw new BadRequest('The passowrd is not matched');
    }

    user.password = await AuthUtil.getHashedAuth(updateInfo.newPassword);
    const updatedUser: UserDocument | null = await usersService.updateUser(user._id, user);
    if (updatedUser) {
      return res.status(200).json(updatedUser);
    }

    throw new InternalServerError('Saving updated password failed');
  } catch (e) {
    if (e instanceof mongoose.Error) { // from mongoose
      return next(new BadRequest(e.message ?? 'Wrong data provided to reset password'));
    } else if (e instanceof ApiError) {
      return next(e);
    }

    return next(new InternalServerError('Rest password failed with unknown error'));
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId: string = req.params.userId;
    const deletedUser = await usersService.deleteUser(userId);
    if (deletedUser) {
      return res.sendStatus(204);
    }

    throw new ForbiddenError('Delete User is not allowed');
  } catch (e) {
    if (e instanceof mongoose.Error) { // from mongoose
      return next(new BadRequest(e.message ?? 'Wrong data format to delete'));
    } else if (e instanceof ApiError) {
      return next(e);
    }

    return next(new InternalServerError('Internal Server Error'));
  }
};