import express from 'express';
import {
  createFaq,
  getFaqs,
  getFaqById,
  updateFaq,
  deleteFaq,
} from '../Controller/faqController.js';

const router = express.Router();

// Admin
router.post('/', createFaq);
router.put('/:id', updateFaq);
router.delete('/:id', deleteFaq);

// User
router.get('/', getFaqs);
router.get('/:id', getFaqById);

export default router;
