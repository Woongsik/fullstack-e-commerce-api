import request from 'supertest';

import connect, { MongoHelper } from '../db-helper';
import app from '../../src/app';
import { CategoryDocument } from '../../src/model/CategoryModel';
import { UserRole } from '../../src/misc/types/User';
import { Category } from '../../src/misc/types/Category';
import { createUser, createUserAndLoginAndGetAccessToken } from '../utils/testUtil';

export function getCategoryData(title: string = 'category1'): Category {
  return {
    title: title,
    image: `http://${title}_image.png`,
  };
}

export async function createCategory(accessToken: string) {
  const categoryData: Category = getCategoryData();
  const response = await request(app)
    .post('/api/v1/categories')
    .set('Authorization', 'Bearer ' + accessToken)
    .send(categoryData);

  return response;
}

export async function createCategoryWithAcessToken(role: UserRole = UserRole.Customer) {
  const accessToken: string = await createUserAndLoginAndGetAccessToken(
    role
  );

  return createCategory(accessToken);
}

describe('category controller test', () => {
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

  it('should return a list of categories', async () => {
    const response = await request(app).get('/api/v1/categories');
    expect(response.status).toBe(404);
  });

  it('should return a category with categoryId', async () => {    
    const categoryResponse = await createCategoryWithAcessToken(UserRole.Admin);
    const category: CategoryDocument = categoryResponse.body;

    const response = await request(app)
      .get(`/api/v1/categories/${category._id}`
    );
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(category);
  });

  it('should create a category if user is an admin', async () => {
    const categoryResponse = await createCategoryWithAcessToken(UserRole.Admin);
    const category: CategoryDocument = categoryResponse.body;

    expect(categoryResponse.status).toBe(201);
    expect(category).toMatchObject({
      title: category.title,
      image: category.image,
      _id: expect.any(String),
      __v: expect.any(Number)
    });
  });

  it('cannot create a category if user is a customer', async () => {
    const createCategoryResponse = await createCategoryWithAcessToken(UserRole.Customer);
    expect(createCategoryResponse.status).toBe(403); // Fobidden
  });

  it('should update a category', async () => {
    const accessToken: string = await createUserAndLoginAndGetAccessToken(UserRole.Admin);
    const categoryResponse = await createCategory(accessToken);
    const category: CategoryDocument = categoryResponse.body;

    const updateInfo: Partial<Category> = {
      title: 'updated title'
    };

    const response = await request(app)
      .put(`/api/v1/categories/${category._id}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send(updateInfo);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      _id: category._id,
      __v: category.__v,
      title: updateInfo.title,
      image: category.image
    });
  });

  it('should delete a category', async () => {
    const accessToken: string = await createUserAndLoginAndGetAccessToken(UserRole.Admin);
    const categoryResponse = await createCategory(accessToken);
    const category: CategoryDocument = categoryResponse.body;

    const response = await request(app)
      .delete(`/api/v1/categories/${category._id}`)
      .set('Authorization', 'Bearer ' + accessToken);

    expect(response.status).toBe(204);
  });
});
