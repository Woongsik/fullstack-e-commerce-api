import { Product } from "./Product";

export type OrderItem = {
  product: string; // ProductId;
  quantity: number;
}

export enum OrderStatus {
  Prepare = 'prepare',
  OnDelivery = 'delivering',
  Delivered = 'delivered'
}

export type Order = {
  user: string; // User id
  items: string[]; // OrderItem id
  createdAt: Date;
  totalPrice: number;
  shippingAddress: string;
  payment: string; // Payment id
  status: OrderStatus
}