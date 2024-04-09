import express from 'express';

import {
  createUser,
  deleteUser,
  forgetPassword,
  updatePassword,
  getAllUsers,
  updateUser,
  getUserById,
  login,
  googleLogin,
  checkEmail
} from '../controllers/usersController';
import { passportAuthenticate } from '../misc/utils/AuthUtil';
import { PassportMethod } from '../misc/types/Passport';
import adminCheck from '../middlewares/adminCheck';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:userId', getUserById);

router.post('/', createUser);
router.post('/check-email', checkEmail);
router.post('/login', login);
router.post('/google-login', passportAuthenticate(PassportMethod.GOOGLE_ID), googleLogin);
router.post('/forget-password', forgetPassword);

router.put('/', passportAuthenticate(), updateUser);
router.put('/update-password', passportAuthenticate(), updatePassword);

router.delete('/:userId', passportAuthenticate(), adminCheck, deleteUser);

export default router;
