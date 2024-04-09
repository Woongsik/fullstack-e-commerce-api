import { sendWelcomeEmail } from '../config/email';
import User, { UserDocument } from '../model/UserModel';

const getAllUsers = async (): Promise<UserDocument[]> => {
  return await User.find();
};

const getUserById = async (id: string): Promise<UserDocument | null> => {
  return await User.findById(id);
};

const createUser = async (user: UserDocument, plainPasswordForGoogleLogin: string | null = null): Promise<UserDocument | null> => {
  const newUser: UserDocument | null = await user.save();
  if (newUser) {
    // await sendWelcomeEmail(user, plainPasswordForGoogleLogin);
  }

  return newUser;
};

const deleteUser = async (id: string): Promise<UserDocument | null> => {
  return await User.findByIdAndDelete(id);
};

const updateUser = async (id: string, newInformation: Partial<UserDocument>): Promise<UserDocument | null> => {
  const updatedUser = await User.findByIdAndUpdate(id, newInformation, {
    new: true,
  });
  return updatedUser;
};

const findOrCreateUser = async (user: UserDocument, plainPasswordForGoogleLogin: string): Promise<UserDocument | null> => {
  const existedUser: UserDocument | null = await getUserByEmail(user.email);
  if (existedUser) {
    return existedUser;
  }
  
  return await createUser(user, plainPasswordForGoogleLogin);
}

const getUserByEmail = async (email: string): Promise<UserDocument | null> => {
  return await User.findOne({ email });
};

const resetPassword = async (user: UserDocument): Promise<UserDocument | null> => {
  return await user.save();
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
  resetPassword,
  getUserByEmail,
  findOrCreateUser
};
