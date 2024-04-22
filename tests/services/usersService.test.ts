import request from 'supertest';

import connect, { MongoHelper } from '../db-helper';
import usersService from '../../src/services/usersService';
import { User, UserRole } from '../../src/misc/types/User';
import { createUserInService } from '../utils/serviceUtil';
import UserModel, { UserDocument } from '../../src/model/UserModel';
import { getUserData } from '../utils/controllerUtil';
import { PasswordUpdte } from '../../src/misc/types/Password';

// tear down
describe('user controller test', () => {
  // connect db
  let mongoHelper: MongoHelper;

  beforeAll(async () => {
    mongoHelper = await connect();
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });

  afterEach(async () => {
    await mongoHelper.clearDatabase();
  });

  it('should get a list of users', async () => {
    const admin: UserDocument = await createUserInService(UserRole.Admin);
    const customer: UserDocument = await createUserInService(UserRole.Customer);

    const users: UserDocument[] = await usersService.getAllUsers();
    expect(users.length).toEqual(2);
    expect(users[0]._id).toEqual(admin._id);
    expect(users[1]._id).toEqual(customer._id);
  });

  it('should get a user by user id', async () => {
    const customer: UserDocument = await createUserInService(UserRole.Customer);
    const foundUser: UserDocument = await usersService.getUserById(customer._id);

    expect(foundUser._id).toEqual(customer._id);
  });

  it('should get a user by email', async () => {
    const customer: UserDocument = await createUserInService(UserRole.Customer);
    const foundUser: UserDocument = await usersService.getUserByEmail(customer.email);
    
    expect(foundUser._id).toEqual(customer._id);
    expect(foundUser.email).toEqual(customer.email);
  });

  it('should create a user', async () => {
    const user: UserDocument = await createUserInService(UserRole.Customer);

    expect(user).toHaveProperty('_id');
    expect(user).toHaveProperty('firstname');
    expect(user).toHaveProperty('lastname');
    expect(user).toHaveProperty('username');
    expect(user).toHaveProperty('address');
    expect(user).toHaveProperty('avatar');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('password');
    expect(user).toHaveProperty('role');
    expect(user).toHaveProperty('active');
  });

  it('should update user', async () => {
    const user: UserDocument = await createUserInService(UserRole.Customer);

    const updateInfo: Partial<User> = {
      username: 'Updated name'
    }

    const updatedUser: UserDocument = await usersService.updateUser(user._id, updateInfo);

    expect(updatedUser._id).toEqual(user._id);
    expect(updatedUser.username).toBe(updateInfo.username);
  });

  it('should delete a user by user id', async () => {
    const user: UserDocument = await createUserInService(UserRole.Customer);
    const deletedUser: UserDocument = await usersService.deleteUser(user._id);
    
    expect(deletedUser._id).toEqual(user._id);
  });

  it('should create a new user if not found', async () => {
    const user: UserDocument = await createUserInService(UserRole.Customer);
    const adminInfo: Partial<User> = getUserData(UserRole.Admin);
    const adminUser: UserDocument = new UserModel(adminInfo);

    // Check with registered user 
    const existedUser: UserDocument = await usersService.findOrCreateUser(user, '');
    expect(existedUser.email).toBe(user.email);

    // Check with newly created user
    const expectedNewUser: UserDocument = await usersService.findOrCreateUser(adminUser, '');
    expect(expectedNewUser.email).toBe(adminUser.email);
  });

  it('should update user password', async () => {
    const user: UserDocument = await createUserInService(UserRole.Customer);
    const passwordInfo: PasswordUpdte = {
      oldPassword: user.password,
      newPassword: 'updatedPassword'
    };

    user.password = passwordInfo.newPassword;
    const updatedUser: UserDocument = await usersService.updatePassword(user);

    expect(user.password).toBe(updatedUser.password);
  });
});
