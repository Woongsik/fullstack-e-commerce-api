import { JwtTokens } from "./JwtPayload";

export enum UserRole {
  Customer = 'customer',
  Admin = 'admin'
};

export type UserActiveAndRole = {
  role: UserRole,
  active: boolean
}

export type UserAuth = {
  email: string;
  password: string;
}

export type User = UserActiveAndRole & UserAuth & {
  firstname: string;
  lastname: string;
  username: string;
  address: string;
  avatar: string;
};

export type LoggedUserInfo = {
  tokens: JwtTokens,
  user: User
}