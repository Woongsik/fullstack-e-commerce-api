import request from 'supertest';

import app from '../../src/app';
import { User, UserAuth, UserRole } from '../../src/misc/types/User';
import { JwtTokens } from '../../src/misc/types/JwtPayload';
import { Category } from '../../src/misc/types/Category';
import { Size } from '../../src/misc/types/Size';
import { Product } from '../../src/misc/types/Product';

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

export const getUserData = (role: UserRole = UserRole.Customer): Partial<User> => {
  let auth: UserAuth = customerAuth; 
  if (role === UserRole.Admin) {
    auth = adminAuth;
  }

  return { ...userInfo, ...auth }
}

export async function createUser(role: UserRole = UserRole.Customer) {
  const userInfo: Partial<User> = getUserData(role);

  return await request(app)
    .post('/api/v1/users')
    .send(userInfo);
};

export async function login(role: UserRole = UserRole.Customer) {
  let auth: UserAuth = customerAuth; 
  if (role === UserRole.Admin) {
    auth = adminAuth;
  }

  return await request(app)
    .post('/api/v1/users/login')
    .send(auth);
}

export async function createUserAndLoginAndGetAccessToken(role: UserRole = UserRole.Customer): Promise<string> {
  await createUser(role);
  const loggedinInfo = await login(role);
  const tokens: JwtTokens = loggedinInfo.body.tokens;

  return tokens.accessToken;
}

export async function createCategoryWithAcessToken(role: UserRole = UserRole.Customer) {
  const accessToken: string = await createUserAndLoginAndGetAccessToken(role);
  return createCategory(accessToken);
}

export async function createCategory(accessToken: string) {
  const categoryData: Category = getCategoryData();
  const response = await request(app)
    .post('/api/v1/categories')
    .set('Authorization', 'Bearer ' + accessToken)
    .send(categoryData);

  return response;
}

export function getCategoryData(title: string = 'category1'): Category {
  return {
    title: title,
    image: `http://${title}_image.png`,
  };
}

export function getProductData(categoryId: string): Partial<Product> {
  return {
    title: 'product1',
    sizes: [Size.Medium, Size.Large],
    price: 35,
    description: 'Product1 description',
    images: ['http://product1_image1.png', 'http://product1_image2.png'],
    category: categoryId, // backend category id ref
    // createdAt: Date ==> is missing here since backend generates
  };
}

export async function createProduct(accessToken: string, categoryId: string) {
  const productNewData = getProductData(categoryId);
  const response = await request(app)
    .post('/api/v1/products')
    .set('Authorization', 'Bearer ' + accessToken)
    .send(productNewData);

  return response;
}

export async function createProductAndCategoryWithAuth(role: UserRole = UserRole.Customer) {
  const accessToken: string = await createUserAndLoginAndGetAccessToken(role);

  const categoryData = await createCategory(accessToken);
  return await createProduct(accessToken, categoryData.body._id);
}