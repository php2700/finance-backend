import { Router } from 'express';
import { authentication } from '../Middleware/authenticate.js';
// import { authorization } from "../Middleware/authorize.js";
import { AddTransction } from '../Controller/userController.js';
import { getAllUsers } from '../Controller/userController.js';
import upload from '../Middleware/upload.js';
import {
  sendOtp,
  verifyOtp,
  addUserName,
  updateMyProfile,
  getMyProfile,
  logoutUser,
} from '../Controller/userController.js';
import {
  getMyFeedbacks,
  createFeedback,
} from '../Controller/feedbackController.js';

const userRouter = Router();

userRouter.post('/add-transaction', AddTransction);

userRouter.get('/', getAllUsers);
userRouter.post('/send-otp', sendOtp);
userRouter.post('/verify-otp', verifyOtp);
userRouter.post('/add-name', authentication, addUserName);
userRouter.post('/logout', authentication, logoutUser);
userRouter.get('/my-profile', authentication, getMyProfile);
userRouter.put(
  '/my-profile',
  authentication,
  upload.single('profilePic'),
  updateMyProfile
);
// ✅ FEEDBACK ROUTES (USER SIDE)
userRouter.post('/feedback', authentication, createFeedback);

// USER seen own feedback
userRouter.get('/feedback', authentication, getMyFeedbacks);

export default userRouter;
