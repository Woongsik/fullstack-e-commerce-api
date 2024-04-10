import mongoose, { Document, Schema } from 'mongoose';

import { OrderItem } from '../misc/types/Order';

export type OrderItemDocument = Document & OrderItem;

export const OrderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  }
}); 

export default mongoose.model<OrderItemDocument>('OrderItem', OrderItemSchema);
