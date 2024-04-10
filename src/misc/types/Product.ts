import { ProductDocument } from '../../model/ProductModel';
import { Size } from './Size';
import { SortCreated, SortPrice, SortTitle } from './Sort';

export type ProductBase = {
  title: string;
}
export type Product = ProductBase & {
  sizes: Size[];
  categories: string[];
  price: number;
  description: string;
  images: string[];
  createdAt: Date;
};

export type FilterProduct = ProductBase & {
  size: Size,
  category: string;
  limit: number;
  offset: number;
  min_price: number;
  max_price: number;
  sort_created: SortCreated;
  sort_title: SortTitle;
  sort_price: SortPrice;
};

export type ProductsList = {
  total: number;
  products: ProductDocument[];
};
