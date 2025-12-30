import express from 'express';
import upload from '../Middleware/upload.js';
const router = express.Router();
import {
  createExpenseCategory,
  getExpenseCategories,
  updateExpenseCategory,
  deleteExpenseCategory,
} from '../Controller/expenseCategory.controller.js';
import { authentication } from '../Middleware/authenticate.js';
import { authorization } from '../Middleware/authorize.js';

/* ================= ROUTES ================= */

// Create
router.post('/',authentication,
  authorization(['admin']),  upload.single('image'), createExpenseCategory);

// Read
router.get('/', getExpenseCategories);

// Update
router.put('/:id',authentication,
  authorization(['admin']),  upload.single('image'), updateExpenseCategory);

// Delete
router.delete('/:id',authentication,
  authorization(['admin']),  deleteExpenseCategory);

export default router;
