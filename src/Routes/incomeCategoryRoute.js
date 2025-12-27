import express from 'express';
import upload from '../Middleware/upload.js';
import {
  createIncomeCategory,
  getIncomeCategories,
  getIncomeCategoryById,
  updateIncomeCategory,
  deleteIncomeCategory,
} from '../Controller/incomeCategoryController.js';

const router = express.Router();
router.post('/', upload.single('image'), createIncomeCategory); // Admin create
router.get('/', getIncomeCategories); // Admin list
router.get('/:id', getIncomeCategoryById); // Admin list
router.put('/:id', upload.single('image'), updateIncomeCategory); // Admin edit
router.delete('/:id', deleteIncomeCategory); // Admin delete

export default router;
