import request from 'supertest';

import connect, { MongoHelper } from '../db-helper';
import app from '../../src/app';
import { createUser, createUserAndLoginAndGetAccessToken, customerAuth, login, userInfo } from '../utils/testUtil';
import { User, UserRole } from '../../src/misc/types/User';

describe('user controller test', () => {
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

  it('should return list of user', async () => {
    await createUser(UserRole.Admin);
    await createUser(UserRole.Customer);

    const response = await request(app).get('/api/v1/users');

    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(2);
  });

  it('should return a user by session', async () => {
    const accessToken: string = await createUserAndLoginAndGetAccessToken(UserRole.Customer);
    const response = await request(app)
      .get(`/api/v1/users/session`)
      .set('Authorization', 'Bearer ' + accessToken);

    const user: User = response.body;
    expect(response.status).toBe(200);
    expect(user.email).toEqual(customerAuth.email);
  });

  it('should return a user by user id', async () => {
    const newUser = await createUser();    
    const response = await request(app).get(`/api/v1/users/${newUser.body._id}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toEqual(newUser.body._id);
    expect(response.body).toEqual(newUser.body);
  });

  it('should create a user', async () => {
    const response = await createUser();

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      ...userInfo,
      ...customerAuth,
      password: expect.any(String), // hashed
      role: UserRole.Customer,
      _id: expect.any(String),
      __v: expect.any(Number)
    });
  });

  it('should return error when same email check', async () => {
    await createUser();   
    const { email } = customerAuth;

    const response = await request(app)
      .post(`/api/v1/users/check-email`)
      .send({
        email
      });


    expect(response.status).toBe(400);
  });

  it('should return user info by login', async () => {
    const newUser = await createUser();   
    const response = await login(); 
        
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('tokens');
    expect(response.body).toHaveProperty('user');
    expect(response.body).toMatchObject({
      tokens: {
        accessToken: expect.any(String),
        refreshToken: expect.any(String)
      },
      user: newUser.body
    });
  });

  // it('should login with google, create or find user', async () => {
  //   const response = await request(app)
  //     .post(`/api/v1/users/google-login`)
  //     .send({
  //       id_token: 'something'
  //     });
      
  //   console.log('google-login', response);
  //   expect(response.status).toBe(200);
  // });

  it('should create new password when forget password', async () => {
    const user = await createUser(UserRole.Customer);
    
    const response = await request(app)
      .post(`/api/v1/users/forget-password`)
      .send({
        userEmail: user.body.email
      });
      
    expect(response.status).toBe(200);
    expect(response.body.passowrd).not.toBe(customerAuth.password);
  });

  it('should update user with update info', async () => {
    const accessToken = await createUserAndLoginAndGetAccessToken(UserRole.Customer);
    const updatedname: string = 'updatedName';
    const response = await request(app)
      .put(`/api/v1/users`)
      .set('Authorization', 'Bearer ' + accessToken
      ).send({
        username: updatedname
      });
        
    expect(response.status).toBe(200);
    expect(response.body.username).toBe(updatedname);
  });

  it('should update user password', async () => {
    const accessToken = await createUserAndLoginAndGetAccessToken(UserRole.Customer);
    
    const response = await request(app)
      .put(`/api/v1/users`)
      .set('Authorization', 'Bearer ' + accessToken
      ).send({
        oldPassword: customerAuth.password,
        newPassword: 'newPassword'
      });
        
    expect(response.status).toBe(200);
    expect(response.body.password).not.toBe(customerAuth.password);
  });

  it('should delete user when user is an admin', async () => {
    const accessToken: string = await createUserAndLoginAndGetAccessToken(UserRole.Admin);
    const customer = await createUser(UserRole.Customer);

    const response = await request(app)
      .delete(`/api/v1/users/${customer.body._id}`)
      .set('Authorization', 'Bearer ' + accessToken);
    
    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  
});
