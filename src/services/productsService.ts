import { FilterQuery } from 'mongoose';

import Product, { ProductDocument } from '../model/ProductModel';
import { FilterProduct, ProductsList } from '../misc/types/Product';

const getAllProducts = async (filterProduct: Partial<FilterProduct>): Promise<ProductsList> => {
  const {
    title,
    min_price,
    max_price,
    limit = 0,
    offset = 0,
    categoryId,
    size
  } = filterProduct;

  const query: FilterQuery<ProductDocument> = {};

  if (title && title.trim().length > 0) {
    query.title = { $regex: title, $options: 'i' };
  }

  if (min_price) {
    query.price = { $gte: min_price };
  }

  if (max_price) {
    query.price = { ...query.price, $lte: max_price };
  }

  if (categoryId) {
    query.categoryIds = categoryId;
  }

  if (size) {
    query.sizes = size;
  }

  const total: number = await Product.find(query).countDocuments();
  const products: ProductDocument[] = await Product.find(query)
    .sort({ title: 1 }) // shows product with name in ascending order
    .populate({ path: 'categoryIds' })
    .limit(limit)
    .skip(offset)
    .exec();

  return {
    total,
    products,
  };
};

const createNewProduct = async (product: ProductDocument): Promise<ProductDocument | null> => {
  return (await product.save()).populate({
    path: 'categoryIds'
  });
};

const updateProduct = async (id: string, updatedProduct: Partial<ProductDocument>): Promise<ProductDocument | null> => {
  return await Product.findByIdAndUpdate(
    id,
    updatedProduct,
    { new: true }
  );
};

const getProductById = async (id: string): Promise<ProductDocument | null> => {
  return await Product.findById(id).populate(
    { path: 'categoryIds' }
  );
};

const deleteProductById = async (id: string): Promise<ProductDocument | null> => {
  return await Product.findByIdAndDelete(id);
};

export default {
  getAllProducts,
  createNewProduct,
  updateProduct,
  getProductById,
  deleteProductById,
};