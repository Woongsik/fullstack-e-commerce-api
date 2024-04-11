import { sendWelcomeEmail } from '../config/email';
import { InternalServerError, NotFoundError } from '../errors/ApiError';
import User, { UserDocument } from '../model/UserModel';

const getAllUsers = async (): Promise<UserDocument[]> => {
  const users: UserDocument[] = await User.find();

  if (users && users.length > 0) {
    return users;
  }

  throw new NotFoundError('No Users Found');
};

const getUserById = async (userId: string): Promise<UserDocument> => {
  const user: UserDocument | null = await User.findById(userId);
  if (user) {
    return user;
  }

  throw new NotFoundError('No matched user with the id');
};

const getUserByEmail = async (email: string): Promise<UserDocument> => {
  const user: UserDocument | null = await User.findOne({ email });
  if (user) {
    return user;
  }

  throw new NotFoundError('No matched user with the email');
};

const createUser = async (user: UserDocument, plainPasswordForGoogleLogin: string | null = null): Promise<UserDocument> => {
  const newUser: UserDocument | null = await user.save();
  if (newUser) {
    // await sendWelcomeEmail(user, plainPasswordForGoogleLogin);
    return newUser;
  }

  throw new InternalServerError('Cannot create a user in db');
};

const updateUser = async (userId: string, updateInfo: Partial<UserDocument>): Promise<UserDocument> => {
  const updatedUser: UserDocument | null = await User.findByIdAndUpdate(userId, updateInfo, {
    new: true,
  });

  if (updatedUser) {
    return updatedUser;
  }

  throw new InternalServerError('Cannot update user in db');
};

const deleteUser = async (userId: string): Promise<UserDocument> => {
  const deletedUser: UserDocument | null = await User.findByIdAndDelete(userId);
  if (deletedUser) {
    return deletedUser;
  }

  throw new InternalServerError('Cannot delete user in db');
};

const findOrCreateUser = async (user: UserDocument, plainPasswordForGoogleLogin: string): Promise<UserDocument> => {
  const existedUser: UserDocument | null = await User.findOne({ email: user.email });
  if (existedUser) {
    return existedUser;
  }
  
  return await createUser(user, plainPasswordForGoogleLogin);
}

const updatePassword = async (user: UserDocument): Promise<UserDocument> => {
  const updatedUser: UserDocument | null = await user.save();

  if (updatedUser) {
    return updatedUser;
  }

  throw new InternalServerError('Cannot reset the password in db');
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
  updatePassword,
  getUserByEmail,
  findOrCreateUser
};
