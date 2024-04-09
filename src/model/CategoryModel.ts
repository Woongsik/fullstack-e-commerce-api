import mongoose, { Document } from 'mongoose';

import { Category } from '../misc/types/Category';

export type CategoryDocument = Document & Category;

export const CategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    required: true
  }
});

export default mongoose.model<CategoryDocument>('Category', CategorySchema);
