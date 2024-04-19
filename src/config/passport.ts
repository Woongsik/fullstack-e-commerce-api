import { ExtractJwt, Strategy as JwtStrategy, VerifiedCallback } from 'passport-jwt';
import GoogleTokenStrartegy from 'passport-google-id-token';
import dotenv from 'dotenv';

import { JwtPayload } from '../misc/types/JwtPayload';
import usersService from '../services/usersService';
import UserModel, { UserDocument } from '../model/UserModel';
import { NotFoundError } from '../errors/ApiError';
import { GoogleUserInfo, ParsedToken } from '../misc/types/GoogleCredential';
import { UserRole } from '../misc/types/User';
import AuthUtil from '../misc/utils/AuthUtil';

dotenv.config({ path: '.env' });

const JWT_SECRET: string = process.env.JWT_SECRET as string;

export const jwtStrategy: JwtStrategy = new JwtStrategy({
  secretOrKey: JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}, async (payload: JwtPayload, done: any) => {
  try {
    const userEmail: string = payload.email;
    const user: UserDocument = await usersService.getUserByEmail(userEmail);
    if (user && user.active) {
      return done(null, user);
    }

    throw new NotFoundError('User is inactive');
  } catch (e) {
    done(e, false); 
  }
});

const clientId: string = process.env.GOOGLE_CLIENT_ID as string;

export const googleStrategy = new GoogleTokenStrartegy({
  clientID: clientId
}, async function (parsedToken: ParsedToken, googleId: string, done: VerifiedCallback) {
  try {
    const googleInfo: GoogleUserInfo = parsedToken.payload;
    const plainPasswordForGoogleLogin = `${googleInfo.given_name}_${googleInfo.family_name}`;
    const passwordForGoogleLogin: string = await AuthUtil.getHashedAuth(plainPasswordForGoogleLogin);
    
    const userInfo: UserDocument = new UserModel({
      firstname: googleInfo.given_name,
      lastname: googleInfo.family_name,
      email: googleInfo.email,
      password: passwordForGoogleLogin,
      username: googleInfo.name,
      role: UserRole.Customer,
      avatar: googleInfo.picture,
      address: 'Please update address!' // Need to be updated
    });
  
    const user: UserDocument = await usersService.findOrCreateUser(userInfo, plainPasswordForGoogleLogin);
    return done(null, user);
  } catch (e) {
    done(e, false);
  }
});