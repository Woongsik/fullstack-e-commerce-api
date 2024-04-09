import mongoose, { Document, Schema } from 'mongoose';

import { Product } from '../misc/types/Product';
import { Size } from '../misc/types/Size';

export type ProductDocument = Document & Product;

export const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    required: true
  },
  sizes: {
    type: [String],
    enum: [Size.Small, Size.Medium, Size.Large, Size.OneSize],
    required: true  
  },
  categoryIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }]
});

export default mongoose.model<ProductDocument>('Product', ProductSchema);
