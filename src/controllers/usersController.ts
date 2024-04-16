import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import usersService from '../services/usersService';
import {
  ApiError,
  BadRequest,
  ForbiddenError,
  InternalServerError,
  NotFoundError
} from '../errors/ApiError';
import { PasswordReset, PasswordUpdte } from '../misc/types/Password';
import UserModel, { UserDocument } from '../model/UserModel';
import AuthUtil from '../misc/utils/AuthUtil';
import { JwtTokens } from '../misc/types/JwtPayload';
import { User, UserRole } from '../misc/types/User';
import { getUserFromRequest } from './controllerUtil';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users: UserDocument[] = await usersService.getAllUsers();
    return res.status(200).json(users);
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
    const user: UserDocument = await usersService.getUserById(userId);
    
    return res.status(200).json(user);
  } catch (e) {
    if (e instanceof mongoose.Error) {
      return next(new BadRequest(e.message ?? 'Wrong id format'));
    } else if (e instanceof ApiError) {
      return next(e);
    }

    return next(new InternalServerError('Unknown error to get a user by id'));
  }
};

export const getUserSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: UserDocument = getUserFromRequest(req);
    if (user) {
      return res.status(200).json(user);
    } 

    throw new ForbiddenError('You need to login!');
  } catch (e) {
     if (e instanceof ApiError) {
      return next(e);
    }
    return next(new InternalServerError('Unknown error to check session'));
  }
}

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userInfo: User = req.body;

      // Check the admin mail, otherwise set Customer role
      // Admin can switch the role later
      userInfo.role = UserRole.Customer;
      if (userInfo.email === 'admin@mail.com') {
        userInfo.role = UserRole.Admin;
      }
  
      userInfo.password = await AuthUtil.getHashedAuth(userInfo.password as string);
      const user: UserDocument = new UserModel(userInfo);
      const newUser: UserDocument = await usersService.createUser(user);
      
      return res.status(201).json(newUser);
    } catch (e) {
      console.log(e);
      if (e instanceof mongoose.Error) { // from mongoose
        return next(new BadRequest(e.message ??'Wrong data format to create'));
      } else if (e instanceof ApiError) {
        return next(e);
      }
      return next(new InternalServerError('Unknown error to create a user'));
    }
  };

export const updateUser = async (req: Request,res: Response, next: NextFunction) => {
  try {
    const user: UserDocument = getUserFromRequest(req);
    const updatedUser: UserDocument = await usersService.updateUser(user._id, req.body);
    
    return res.status(200).json(updatedUser);
  } catch (e) {
    if (e instanceof mongoose.Error) { // from mongoose
      return next(new BadRequest(e.message ?? 'Wrong data format to udpate'));
    } else if (e instanceof ApiError) {
      return next(e);
    }

    return next(new InternalServerError('Internal Server Error'));
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId: string = req.params.userId;
    const deletedUser: UserDocument = await usersService.deleteUser(userId);
    
    return res.sendStatus(204);
  } catch (e) {
    if (e instanceof mongoose.Error) { // from mongoose
      return next(new BadRequest(e.message ?? 'Wrong data format to delete'));
    } else if (e instanceof ApiError) {
      return next(e);
    }

    return next(new InternalServerError('Internal Server Error'));
  }
};

export const checkEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const existedUser: UserDocument = await usersService.getUserByEmail(email);
    if (existedUser) {
      throw new BadRequest('The email is already in use');
    }
  } catch (e) {
    if (e instanceof mongoose.Error) { // from mongoose
      return next(new BadRequest(e.message ?? 'Wrong data format to check email'));
    } else if (e instanceof NotFoundError) { // If not found, email is good to use
      return res.status(200).json({ 
        message: 'The email is good to go, not in use!'
      });
    }
    else if (e instanceof ApiError) {
      return next(e);
    }

    return next(new InternalServerError('Unknown error to check email in use'));
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user: UserDocument = await usersService.getUserByEmail(email);
    const isMatched: boolean = await AuthUtil.comparePlainAndHashed(password, user.password);
    if (!isMatched) {
      throw new BadRequest("Password didn't match");
    }

    const tokens: JwtTokens = await AuthUtil.generateTokens(user);
    return res.status(200).json({ tokens, user });
  } catch (e) {
    console.log(e);
    if (e instanceof mongoose.Error) { // from mongoose
      return next(new BadRequest(e.message ?? 'Wrong data format to login'));
    } else if (e instanceof ApiError) {
      return next(e);
    }

    return next(new InternalServerError('Unknown error to login'));
  }
};

export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: UserDocument = getUserFromRequest(req);
    const tokens: JwtTokens = await AuthUtil.generateTokens(user);
    
    return res.status(200).json({ tokens, user });
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
    const user: UserDocument = await usersService.getUserByEmail(
      resetPasswordInfo.userEmail
    );

    // TODO send email one time password to reset password
    const plainPasswordToReset: string = `tempPasswordToReset_${user.firstname}`;
    const hashedPassword: string = await AuthUtil.getHashedAuth(plainPasswordToReset);
    user.password = hashedPassword;
    console.log('Temp passowrd:', plainPasswordToReset);
    const updatedUser: UserDocument = await usersService.updatePassword(user);
  
    return res.status(200).json(updatedUser);
  } catch (e) {
    if (e instanceof mongoose.Error) { // from mongoose
      return next(new BadRequest(e.message ?? 'Wrong format to reset password'));
    } else if (e instanceof ApiError) {
      return next(e);
    }

    return next(new InternalServerError('Unknwon error to reset the password'));
  }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: UserDocument = getUserFromRequest(req);
    const updateInfo: PasswordUpdte = req.body;
    const passwordMatched: boolean = await AuthUtil.comparePlainAndHashed(
      updateInfo.oldPassword,
      user.password
    );

    if (!passwordMatched) {
      throw new BadRequest('The passowrd is not matched');
    }

    user.password = await AuthUtil.getHashedAuth(updateInfo.newPassword);
    const updatedUser: UserDocument = await usersService.updatePassword(user);
    
    return res.status(200).json(updatedUser);
  } catch (e) {
    if (e instanceof mongoose.Error) { // from mongoose
      return next(new BadRequest(e.message ?? 'Wrong data provided to reset password'));
    } else if (e instanceof ApiError) {
      return next(e);
    }

    return next(new InternalServerError('Rest password failed with unknown error'));
  }
};