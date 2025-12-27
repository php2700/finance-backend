import { Router } from 'express';
import { authentication } from '../Middleware/authenticate.js';
// import { authorization } from "../Middleware/authorize.js";
import { AddExpense, AddIncome, AddSplit, dashboard, getSplit } from '../Controller/userController.js';
import { getAllUsers } from '../Controller/userController.js';
import {
  sendOtp,
  verifyOtp,
  addUserName,
  logoutUser,
} from '../Controller/userController.js';
import { authorization } from '../Middleware/authorize.js';

const userRouter = Router();


userRouter.get('/dashboard/:userId',authentication,authorization(['user']), dashboard);

/*income*/
userRouter.post('/add-income',authentication,authorization(['user']), AddIncome);

/*expense*/
userRouter.post('/add-expense',authentication,authorization(['user']), AddExpense);

/*split add*/
userRouter.get('/split',authentication,authorization(['user']), getSplit);
userRouter.post('/split',authentication,authorization(['user']), AddSplit);


userRouter.get('/', getAllUsers);
userRouter.post('/send-otp', sendOtp);
userRouter.post('/verify-otp', verifyOtp);
userRouter.post('/add-name', authentication, addUserName);
userRouter.post('/logout', authentication, logoutUser);
export default userRouter;
