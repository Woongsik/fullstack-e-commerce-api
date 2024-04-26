import connect, { MongoHelper } from '../db-helper';
import { ProductDocument } from '../../src/model/ProductModel';
import productsService from '../../src/services/productsService';
import {
  FilterProduct,
  Product,
  ProductsList,
} from '../../src/misc/types/Product';
import { Size } from '../../src/misc/types/Size';
import { createProductInService } from '../utils/serviceUtil';

const filterProducts: Partial<FilterProduct> = {
  title: 'Product1',
  size: Size.Medium
};

describe('Product service test', () => {
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

  it('should get all products without any filter', async () => {
    const product: ProductDocument = await createProductInService();
    const productList: ProductsList = await productsService.getAllProducts({});

    expect(productList).toHaveProperty('products');
    expect(productList).toHaveProperty('total');
    expect(productList).toHaveProperty('minMaxPrice');

    expect(productList.total).toBe(1);
    expect(productList.products.length).toBe(1);

    const matchedProduct: ProductDocument = productList.products[0];
    expect(matchedProduct).toEqual(matchedProduct);
  });

  it('should create a product', async () => {
    const product: ProductDocument = await createProductInService();

    expect(product).toHaveProperty('_id');
    expect(product).toHaveProperty('title');
    expect(product).toHaveProperty('sizes');
    expect(product).toHaveProperty('category');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('description');
    expect(product).toHaveProperty('images');
    expect(product).toHaveProperty('createdAt');
  });

  it('should get a product by product id', async () => {
    const product: ProductDocument = await createProductInService();

    const foundProduct: ProductDocument = await productsService.getProductById(
      product._id
    );

    expect(foundProduct._id).toEqual(product._id);
  });

  // update product by id
  it('should update a product by id', async () => {
    const product: ProductDocument = await createProductInService();

    const updateInfo: Partial<Product> = {
      title: 'updated product name',
      description: 'product1 new description',
    };

    const updatedProduct: ProductDocument = await productsService.updateProduct(
      product._id,
      updateInfo
    );
    expect(updatedProduct._id).toEqual(product._id);
    expect(updatedProduct.title).toBe(updateInfo.title);
    expect(updatedProduct.description).toBe(updateInfo.description);
  });

  // delete product by id
  it('should delete a product by id', async () => {
    const product: ProductDocument = await createProductInService();
    const deleteProduct = await productsService.deleteProductById(product._id);

    expect(deleteProduct._id).toEqual(product._id);
  });
});
