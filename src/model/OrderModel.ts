import mongoose, { Document, Schema } from 'mongoose';

import { Order } from '../misc/types/Order';
import { OrderItemSchema } from './OrderItemModel';

export type OrderDocument = Document & Order;

export const OrderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemIds: [{
    OrderItemSchema,
    required: true
  }],
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true
  },
  totalPrice: {
    type: Number,
    default: 0,
    required: true
  },
  shippingAddress: {
    type: String,
    required: true
  }
});

export default mongoose.model<OrderDocument>('Order', OrderSchema);
