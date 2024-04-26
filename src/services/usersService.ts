import { sendWelcomeEmail, sendForgetPasswordEmail } from '../config/email';
import { BadRequest, ForbiddenError, InternalServerError, NotFoundError } from '../errors/ApiError';
import AuthUtil from '../misc/utils/AuthUtil';
import User, { UserDocument } from '../model/UserModel';

const getAllUsers = async (): Promise<UserDocument[]> => {
  const users: UserDocument[] = await User.find({});

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
  // Check if email is in use
  const existedUser: UserDocument | null = await User.findOne({ email: user.email });
  if (existedUser) {
    throw new BadRequest(`${user.email} is already in use!`);
  }
  
  const newUser: UserDocument | null = await user.save();
  if (newUser) {
    if (plainPasswordForGoogleLogin) {
     await sendWelcomeEmail(user, plainPasswordForGoogleLogin);
    }
    
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
    if (!existedUser.active) {
      throw new ForbiddenError('User is inactive, please contact support team!');
    }

    return existedUser;
  }
  
  return await createUser(user, plainPasswordForGoogleLogin);
}

const updatePassword = async (user: UserDocument, sendEmail: boolean = false): Promise<UserDocument> => {
  const plainPasswordToReset: string = `temp&${user.firstname}&1347`;
  const hashedPassword: string = await AuthUtil.getHashedAuth(plainPasswordToReset);
  user.password = hashedPassword;
  
  const updatedUser: UserDocument | null = await user.save();
  if (updatedUser) {
    if (sendEmail) {
      await sendForgetPasswordEmail(user, plainPasswordToReset);
    }
    
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
