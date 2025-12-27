import express from 'express';
const router = express.Router();
import {
  createExpenseCategory,
  getExpenseCategories,
  updateExpenseCategory,
  deleteExpenseCategory,
} from '../Controller/expenseCategory.controller.js';

/* ================= ROUTES ================= */

// Create
router.post('/', createExpenseCategory);

// Read
router.get('/', getExpenseCategories);

// Update
router.put('/:id', updateExpenseCategory);

// Delete
router.delete('/:id', deleteExpenseCategory);

export default router;
