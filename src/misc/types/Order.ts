import { Product } from "./Product";
import { Size } from "./Size";

export type OrderItem = {
  product: string; // ProductId;
  size: Size;
  quantity: number;
}

export enum OrderStatus {
  Prepare = 'prepare',
  OnDelivery = 'delivering',
  Delivered = 'delivered'
}

export type Address = {
  street: string;
  city: string;
  postnumber: string;
  country: string;
}

export type Order = {
  user: string; // User id
  items: string[]; // OrderItem id
  createdAt: Date;
  totalPrice: number;
  shippingAddress: Address;
  payment: boolean;
  status: OrderStatus
}