import { Router } from 'express';
import { Login } from '../Controller/adminController.js';
import { authentication } from '../Middleware/authentication.js';
import { authorization } from '../Middleware/authorization.js';

const adminRouter = Router();
//admin login route
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
