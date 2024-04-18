import mongoose, { Document, Schema } from 'mongoose';

import { Order, OrderStatus } from '../misc/types/Order';
import { OrderItemSchema } from './OrderItemModel';
import { AddressSchema } from './AddressModel';

export type OrderDocument = Document & Order;

export const OrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    type: OrderItemSchema,
    required: true
  }],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  totalPrice: {
    type: Number,
    default: 0,
    required: true
  },
  shippingAddress: {
    type: AddressSchema,
    required: true
  },
  status: {
    type: String,
    enum: OrderStatus,
    default: OrderStatus.Prepare
  },
  payment: {
    type: Boolean,
    required: true
  }
});

export default mongoose.model<OrderDocument>('Order', OrderSchema);
