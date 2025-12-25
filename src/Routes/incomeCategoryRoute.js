import express from 'express';
import {
  createIncomeCategory,
  getIncomeCategories,
  getIncomeCategoryById,
  updateIncomeCategory,
  deleteIncomeCategory,
} from '../Controller/incomeCategoryController.js';

const router = express.Router();

router.post('/', createIncomeCategory); // Admin create
router.get('/', getIncomeCategories); // Admin list
router.get('/:id', getIncomeCategoryById); // Admin list
router.put('/:id', updateIncomeCategory); // Admin edit
router.delete('/:id', deleteIncomeCategory); // Admin delete

export default router;
