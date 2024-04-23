import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import passport from 'passport';

import { UserDocument } from '../../model/UserModel';
import { PassportMethod } from '../types/Passport';
import { JwtTokens } from '../types/JwtPayload';

export const comparePlainAndHashed = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const getHashedAuth = async (plainPassword: string): Promise<string> => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(plainPassword, salt);
};

export const generateTokens = async (user: UserDocument): Promise<JwtTokens> => {
  const JWT_SECRET = process.env.JWT_SECRET as string;
  const accessToken = jwt.sign(
    {
      email: user.email,
      _id: user._id,
      firstName: user.firstname
    },
    JWT_SECRET,
    {
      expiresIn: '3h',
    }
  );

  const refreshToken = jwt.sign(
    {
      email: user.email,
      _id: user._id,
      firstName: user.firstname
    },
    JWT_SECRET,
    {
      expiresIn: '10d',
    }
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const passportAuthenticate = (method: PassportMethod = PassportMethod.JWT) => passport.authenticate(method, { session: false });

export default { comparePlainAndHashed, getHashedAuth, generateTokens };
