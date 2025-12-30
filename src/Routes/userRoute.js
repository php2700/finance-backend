import { Router } from 'express';
import { authentication } from '../Middleware/authenticate.js';
// import { authorization } from "../Middleware/authorize.js";
import { AddExpense, AddIncome, AddSplit, dashboard, downloadCsv, getSplit, monthTransaction, transaction, updateSplit } from '../Controller/userController.js';
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
import { authorization } from '../Middleware/authorize.js';

const userRouter = Router();

userRouter.get('/download-csv/:userId',authentication,authorization(['user']),downloadCsv)
userRouter.get('/month-transaction/:userId',authentication,authorization(['user']),monthTransaction)
userRouter.get('/transaction/:userId',authentication,authorization(['user','admin']), transaction);
userRouter.get('/dashboard/:userId',authentication,authorization(['user']), dashboard);

/*income*/
userRouter.post(
  '/add-income',
  authentication,
  authorization(['user']),
  AddIncome
);

/*expense*/
userRouter.post(
  '/add-expense',
  authentication,
  authorization(['user']),
  AddExpense
);

/*split add*/
userRouter.get(
  '/split/:userId',
  authentication,
  authorization(['user', 'admin']),
  getSplit
);
userRouter.patch(
  '/split',
  authentication,
  authorization(['user', 'admin']),
  updateSplit
);
userRouter.post(
  '/split',
  authentication,
  authorization(['user', 'admin']),
  AddSplit
);

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
