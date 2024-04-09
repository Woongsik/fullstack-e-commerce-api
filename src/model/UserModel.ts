import mongoose, { Document } from 'mongoose';

import { User, UserRole } from '../misc/types/User';

export type UserDocument = Document & User;

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: UserRole,
    default: UserRole.Customer  
  },
  active: {
    type: Boolean,
    default: true
  }
});

export default mongoose.model<UserDocument>('User', UserSchema);
