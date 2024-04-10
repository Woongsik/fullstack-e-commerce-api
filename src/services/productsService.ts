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
    category,
    size,
    sort_created,
    sort_price,
    sort_title
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

  if (category) {
    query.categories = category;
  }

  if (size) {
    query.sizes = size;
  }

  const total: number = await Product.find(query).countDocuments();
  const products: ProductDocument[] = await Product.find(query)
    .sort({ 
      title: 1, 
      createdAt: 1, 
      price: 1 
    }).populate({ path: 'categories' })
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
    path: 'categories'
  });
};

const updateProduct = async (productId: string, updatedProduct: Partial<ProductDocument>): Promise<ProductDocument | null> => {
  return await Product.findByIdAndUpdate(productId, updatedProduct, { new: true });
};

const getProductById = async (productId: string): Promise<ProductDocument | null> => {
  return await Product.findById(productId)
    .populate({ path: 'categories' });
};

const deleteProductById = async (productId: string): Promise<ProductDocument | null> => {
  return await Product.findByIdAndDelete(productId);
};

export default {
  getAllProducts,
  createNewProduct,
  updateProduct,
  getProductById,
  deleteProductById,
};