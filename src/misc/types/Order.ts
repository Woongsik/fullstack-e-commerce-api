import { Product } from "./Product";

export type OrderItem = {
  productId: string; // Product;
  quantity: number;
}

export enum OrderStatus {
  PrepareItem = 'prepare',
  Delivering = 'delivering',
  Delivered = 'delivered'
}

export type Order = {
  userId: string; // User id
  itemIds: string[]; // OrderItem id
  createdAt: string;
  totalPrice: number;
  shippingAddress: string;
  payment: string; // Payment id
  status: OrderStatus
}