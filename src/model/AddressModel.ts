import mongoose, { Document, Schema } from 'mongoose';

import { Address } from '../misc/types/Order';

export type AddressDocument = Document & Address;

export const AddressSchema = new Schema({
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  postnumber: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  }
}); 

export default mongoose.model<AddressDocument>('Address', AddressSchema);
