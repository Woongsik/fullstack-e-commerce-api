import request from 'supertest';

import connect, { MongoHelper } from '../db-helper';
import app from '../../src/app';
import { Product, ProductsList } from '../../src/misc/types/Product';
import { createUser, createUserAndLoginAndGetAccessToken } from '../utils/testUtil';
import { UserRole } from '../../src/misc/types/User';
import { ProductDocument } from '../../src/model/ProductModel';
import { createCategory } from './categoriesController.test';
import { Size } from '../../src/misc/types/Size';

export function getProductData(categoryId: string) {
  return {
    title: 'product1',
    sizes: [Size.Medium, Size.Large],
    price: 35,
    description: 'Product1 description',
    images: ['http://product1_image1.png', 'http://product1_image2.png'],
    category: categoryId, // backend ref
  };
}

async function createProduct(accessToken: string, categoryId: string) {
  const productNewData = getProductData(categoryId);
  const response = await request(app)
    .post('/api/v1/products')
    .set('Authorization', 'Bearer ' + accessToken)
    .send(productNewData);

  return response;
}

async function createProductAndCategoryWithAuth(role: UserRole = UserRole.Customer) {
  const accessToken: string = await createUserAndLoginAndGetAccessToken(
    role
  );

  const categoryData = await createCategory(accessToken);
  return await createProduct(accessToken, categoryData.body._id);
}

describe('product controller test', () => {
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

  it('should get all the products', async () => {
    // Check init
    const initResponse = await request(app).get('/api/v1/products');
    expect(initResponse.status).toBe(404);

    // Creat a product
    await createProductAndCategoryWithAuth(UserRole.Admin);
    
    // Request all products
    const response = await request(app).get('/api/v1/products');

    const productList: ProductsList = response.body;
    expect(productList).toHaveProperty('products');
    expect(productList).toHaveProperty('total');
    expect(productList).toHaveProperty('minMaxPrice');

    expect(productList.products.length).toBe(1);
    expect(productList.total).toBe(1);
    expect(productList.minMaxPrice).toEqual({
      min: expect.any(Number),
      max: expect.any(Number)
    });
  });

  it('should get a product by product id', async () => {
   // Creat a product
    const productRes = await createProductAndCategoryWithAuth(UserRole.Admin);
    const newProduct: ProductDocument = productRes.body;

    // Request all products
    const response = await request(app).get(`/api/v1/products/${newProduct._id}`);
    const product: ProductDocument = response.body;

    expect(response.status).toBe(200);
    expect(newProduct).toEqual(product);
  });

  it('should create a product if user is admin', async () => {
    const response = await createProductAndCategoryWithAuth(UserRole.Admin);
    const newProduct: ProductDocument = response.body;

    expect(response.status).toBe(201);
    expect(newProduct).toHaveProperty('title');

    const expectedProduct = getProductData('mockCategoryId');
    expect(newProduct.title).toBe(expectedProduct.title);
  });

  it('should not create a product if user is customer', async () => {
    const response = await createProductAndCategoryWithAuth(UserRole.Customer);
    expect(response.status).toBe(403);
  });

  it('should update a product if user is admin', async () => {
    const accessToken: string = await createUserAndLoginAndGetAccessToken(UserRole.Admin);
    const categoryData = await createCategory(accessToken);
    const productRes = await createProduct(
      accessToken,
      categoryData.body._id
    );
    const product: ProductDocument = productRes.body;

    const updateInfo: Partial<Product> = {
      title: 'Updated product',
      price: 50
    };

    const updatedProductRes = await request(app)
      .put(`/api/v1/products/${product._id}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send(updateInfo);

    const updatedProduct: ProductDocument = updatedProductRes.body;

    expect(updatedProductRes.status).toBe(200);
    expect(updatedProduct).toEqual({
      ...product,
      title: updateInfo.title,
      price: updateInfo.price
    });

  });

  it('should delete a product if user is admin', async () => {
    const accessToken: string = await createUserAndLoginAndGetAccessToken(UserRole.Admin);
    const categoryData = await createCategory(accessToken);
    const productRes = await createProduct(
      accessToken,
      categoryData.body._id
    );
    const product: ProductDocument = productRes.body;

    const deletedProductRes = await request(app)
      .delete(`/api/v1/products/${product._id}`)
      .set('Authorization', 'Bearer ' + accessToken);

    expect(deletedProductRes.status).toBe(204);
  });
});
