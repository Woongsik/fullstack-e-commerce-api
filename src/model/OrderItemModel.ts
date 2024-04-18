import mongoose, { Document, Schema } from 'mongoose';

import { OrderItem } from '../misc/types/Order';
import { Size } from '../misc/types/Size';

export type OrderItemDocument = Document & OrderItem;

export const OrderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  size: {
    type: String,
    enum: Size,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  }
}); 

export default mongoose.model<OrderItemDocument>('OrderItem', OrderItemSchema);
