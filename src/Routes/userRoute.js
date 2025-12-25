import { Router } from 'express';
// import { authentication } from "../Middleware/authenticate.js";
// import { authorization } from "../Middleware/authorize.js";
import { AddTransction } from '../Controller/userController.js';
import {
  sendOtp,
  verifyOtp,
  addUserName,
} from '../Controller/userController.js';

const userRouter = Router();

userRouter.post('/add-transaction', AddTransction);

userRouter.post('/send-otp', sendOtp);
userRouter.post('/verify-otp', verifyOtp);
userRouter.post('/add-name', addUserName);

export default userRouter;
