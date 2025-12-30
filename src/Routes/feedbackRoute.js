import express from 'express';
import {
  createFeedback,
  getMyFeedbacks,
  getAllFeedbacks,
} from '../Controller/feedbackController.js';

import { authentication } from '../Middleware/authMiddleware.js';
import { authorizeRoles } from '../Middleware/roleMiddleware.js';

const router = express.Router();

/**
 * USER
 */
router.post('/', authentication, createFeedback);
router.get('/my', authentication, getMyFeedbacks);

/**
 * ADMIN
 */
router.get(
  '/',
authentication,
  authorization(['admin']), 
  getAllFeedbacks
);

export default router;
