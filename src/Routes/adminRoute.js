import { Router } from 'express';
import { Login } from '../Controller/adminController.js';
import { authentication } from '../Middleware/authenticate.js';
import { authorization } from '../Middleware/authorize.js';
import { aboutUs, count, getAboutUs, getAllFeedbacks, getPrivacyPolicy, privacyPolicy } from '../Controller/feedbackController.js';
const adminRouter = Router();

adminRouter.post('/login', Login);

adminRouter.get(
  '/dashboard',
  authentication,
  authorization(['admin']),
  count
);
// ✅ ADMIN → ALL USERS FEEDBACK



adminRouter.get('/about-us', getAboutUs)
adminRouter.post('/about-us', authentication,
  authorization(['admin']), aboutUs)

adminRouter.get('/privacy-policy', getPrivacyPolicy)
adminRouter.post('/privacy-policy', authentication,
  authorization(['admin']), privacyPolicy)

adminRouter.get('/feedback', getAllFeedbacks);
export default adminRouter;
