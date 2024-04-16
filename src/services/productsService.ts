import mongoose, { FilterQuery } from 'mongoose';

import Product, { ProductDocument } from '../model/ProductModel';
import { FilterProduct, MinMaxPrice, ProductsList } from '../misc/types/Product';
import { InternalServerError, NotFoundError } from '../errors/ApiError';
import { SortCreated, SortPrice, SortTitle } from '../misc/types/Sort';

const getAllProducts = async (filterProduct: Partial<FilterProduct>): Promise<ProductsList> => {
  const {
    title,
    min_price,
    max_price,
    limit = 0,
    offset = 0,
    categoryId,
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

  if (categoryId) {
    query.category = categoryId;
  }

  if (size) {
    query.sizes = size;
  }

  const total: number = await Product.find(query).countDocuments();
  if (total === 0) {
    throw new NotFoundError('No matched products');
  }

  const sortQuery: any = {};
  if (sort_title) {
    sortQuery.title = (sort_title === SortTitle.ASC ? 1 : -1);
  }

  if (sort_created) {
    sortQuery.createdAt = (sort_created === SortCreated.ASC ? 1 : -1);
  }

  if (sort_price) {
    sortQuery.price = (sort_price === SortPrice.ASC ? 1 : -1);
  }

  const products: ProductDocument[] = await Product.find(query)
    .sort(sortQuery)
    .populate({ path: 'category' })
    .limit(limit)
    .skip(offset)
    .exec();

  if (categoryId) {
    query.category = new mongoose.Types.ObjectId(categoryId);
  }

  const minMaxPrice: MinMaxPrice = (await Product.aggregate([
    { $match: query },
    { $facet: {
      min: [{ $sort: { price: 1 } }, { $limit: 1 }],
      max: [{ $sort: { price: -1 } }, { $limit: 1 }]
    }},
    { $project: { min: { $first: "$min.price" }, max: { $first: "$max.price" } } }
  ]))[0];

  return {
    total,
    minMaxPrice,
    products,
  };
};

const getProductById = async (productId: string): Promise<ProductDocument> => {
  const product: ProductDocument | null = await Product.findById(productId)
    .populate({ path: 'category' });

  if (product) {
    return product;
  }

  throw new NotFoundError('No matched product with id');
};

const createNewProduct = async (product: ProductDocument): Promise<ProductDocument> => {
  const newProduct: ProductDocument | null = await (await product.save())
    .populate({
      path: 'category'
    });

  if (newProduct) {
    return newProduct;
  }

  throw new InternalServerError('Cannot create new proudct in db');

};

const updateProduct = async (productId: string, updateInfo: Partial<ProductDocument>): Promise<ProductDocument> => {
  const updatedProduct: ProductDocument | null = await Product.findByIdAndUpdate(productId, updateInfo, { 
    new: true 
  }).populate({
    path: 'category'
  });
  
  if (updatedProduct) {
    return updatedProduct;
  }

  throw new InternalServerError('Cannot update proudct in db');
};

const deleteProductById = async (productId: string): Promise<ProductDocument> => {
  const deletedProduct: ProductDocument | null = await Product.findByIdAndDelete(productId);
  if (deletedProduct) {
    return deletedProduct;
  }

  throw new InternalServerError('Cannot delete proudct in db');
};

export default {
  getAllProducts,
  createNewProduct,
  updateProduct,
  getProductById,
  deleteProductById,
};