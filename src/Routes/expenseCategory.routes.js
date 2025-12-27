import express from 'express';
import upload from '../Middleware/upload.js';
const router = express.Router();
import {
  createExpenseCategory,
  getExpenseCategories,
  updateExpenseCategory,
  deleteExpenseCategory,
} from '../Controller/expenseCategory.controller.js';

/* ================= ROUTES ================= */

// Create
router.post('/', upload.single('image'), createExpenseCategory);

// Read
router.get('/', getExpenseCategories);

// Update
router.put('/:id', upload.single('image'), updateExpenseCategory);

// Delete
router.delete('/:id', deleteExpenseCategory);

export default router;
