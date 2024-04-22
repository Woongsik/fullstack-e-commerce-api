import request from 'supertest';

import app from '../../src/app';
import { User, UserAuth, UserRole } from '../../src/misc/types/User';
import { JwtTokens } from '../../src/misc/types/JwtPayload';

export const customerAuth: UserAuth = {
  email: 'user1@mail.com',
  password: 'customer',
};

export const adminAuth: UserAuth = {
  email: 'admin@mail.com',
  password: 'adminPassword',
};

export const userInfo: Partial<User> = {
  firstname: 'firstname',
  lastname: 'lastname',
  username: 'username',
  avatar: 'http://avatar.png',
  address: 'address',
  active: true
};

export async function createUser(role: UserRole = UserRole.Customer) {
  let auth: UserAuth = customerAuth; 
  if (role === UserRole.Admin) {
    auth = adminAuth;
  }

  return await request(app).post('/api/v1/users').send({ ...userInfo, ...auth });
};

export async function login(role: UserRole = UserRole.Customer) {
  let auth: UserAuth = customerAuth; 
  if (role === UserRole.Admin) {
    auth = adminAuth;
  }

  return await request(app).post('/api/v1/users/login').send(auth);
}

export async function createUserAndLoginAndGetAccessToken(role: UserRole = UserRole.Customer): Promise<string> {
  await createUser(role);
  const loggedinInfo = await login(role);
  const tokens: JwtTokens = loggedinInfo.body.tokens;

  return tokens.accessToken;
}