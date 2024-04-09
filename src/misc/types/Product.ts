import { ProductDocument } from '../../model/ProductModel';
import { Size } from './Size';

export type Product = {
  title: string;
  price: number;
  description: string;
  images: string[];
  sizes: Size[];
  categoryIds: string[]; // [1,2,3]
};

export type FilterProduct = {
  title: string;
  limit: number;
  offset: number;
  min_price: number;
  max_price: number;
  sizes: string; // L, M, S
  categoryIds: string; // 1,2,3
};

export type ProductsList = {
  total: number;
  products: ProductDocument[];
};
