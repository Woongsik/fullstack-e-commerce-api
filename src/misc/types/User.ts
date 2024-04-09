export enum UserRole {
  Customer = 'customer',
  Admin = 'admin'
};

export type UserActiveAndRole = {
  role: UserRole,
  active: boolean
}

export type User = UserActiveAndRole & {
  firstname: string;
  lastname: string;
  username: string;
  address: string;
  avatar: string;
  email: string;
  password: string;
};