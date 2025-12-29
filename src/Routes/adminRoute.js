import { Router } from 'express';
import { Login } from '../Controller/adminController.js';
import { authentication } from '../Middleware/authenticate.js';
import { authorization } from '../Middleware/authorize.js';
import { getAllFeedbacks } from '../Controller/feedbackController.js';
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
// ✅ ADMIN → ALL USERS FEEDBACK
adminRouter.get('/feedback', getAllFeedbacks);
export default adminRouter;
