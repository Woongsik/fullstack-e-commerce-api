import { ProductDocument } from '../../model/ProductModel';
import { Size } from './Size';

export type ProductBase = {
  title: string;
}
export type Product = ProductBase & {
  sizes: Size[];
  categoryIds: string[];
  price: number;
  description: string;
  images: string[];
};

export type FilterProduct = ProductBase & {
  size: Size,
  categoryId: string;
  limit: number;
  offset: number;
  min_price: number;
  max_price: number;
};

export type ProductsList = {
  total: number;
  products: ProductDocument[];
};
