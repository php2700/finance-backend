import express from 'express';
import {
  createFaq,
  getFaqs,
  getFaqById,
  updateFaq,
  deleteFaq,
} from '../Controller/faqController.js';
import { authentication } from '../Middleware/authenticate.js';
import { authorization } from '../Middleware/authorize.js';

const router = express.Router();

// Admin
router.post('/',authentication,
  authorization(['admin']),  createFaq);
router.put('/:id',authentication,
  authorization(['admin']),  updateFaq);
router.delete('/:id',authentication,
  authorization(['admin']), deleteFaq);

// User
router.get('/', getFaqs);
router.get('/:id', getFaqById);

export default router;
