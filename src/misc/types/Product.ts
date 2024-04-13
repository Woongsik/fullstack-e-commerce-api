import { ProductDocument } from '../../model/ProductModel';
import { Size } from './Size';
import { SortCreated, SortPrice, SortTitle } from './Sort';

export type ProductBase = {
  title: string;
}
export type Product = ProductBase & {
  sizes: Size[];
  category: string;
  price: number;
  description: string;
  images: string[];
  createdAt: Date;
};

export type FilterProduct = ProductBase & {
  size: Size,
  categoryId: string;
  min_price: number;
  max_price: number;
  sort_created: SortCreated;
  sort_title: SortTitle;
  sort_price: SortPrice;
  limit: number;
  offset: number;
};

export type MinMaxPrice = {
  min: number;
  max: number;
}

export type ProductsList = {
  total: number;
  products: ProductDocument[];
  minMaxPrice: MinMaxPrice;
};
