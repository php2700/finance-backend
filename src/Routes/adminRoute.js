import { Router } from 'express';
import { Login } from '../Controller/adminController.js';

const adminRouter = Router();
//admin login route
adminRouter.post('/login', Login);

export default adminRouter;
