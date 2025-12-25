import { Router } from 'express';
import { Login } from '../Controller/adminController.js';
import { authentication } from '../Middleware/authenticate.js';
import { authorization } from '../Middleware/authorize.js';

const adminRouter = Router();

adminRouter.post('/login', Login);

adminRouter.get(
  '/dashboard',
  authentication,
  authorization(['admin']),
  (req, res) => {
    res.json({ success: true, message: 'Admin Dashboard Accessed' });
  }
);

export default adminRouter;
