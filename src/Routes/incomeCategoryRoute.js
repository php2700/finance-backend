import express from 'express';
import upload from '../Middleware/upload.js';
import {
  createIncomeCategory,
  getIncomeCategories,
  getIncomeCategoryById,
  updateIncomeCategory,
  deleteIncomeCategory,
} from '../Controller/incomeCategoryController.js';
import { authentication } from '../Middleware/authenticate.js';
import { authorization } from '../Middleware/authorize.js';

const router = express.Router();
router.post('/', authentication,
  authorization(['admin']), upload.single('image'), createIncomeCategory); // Admin create
router.get('/', getIncomeCategories); // Admin list
router.get('/:id', getIncomeCategoryById); // Admin list
router.put('/:id', authentication,
  authorization(['admin']), upload.single('image'), updateIncomeCategory); // Admin edit
router.delete('/:id', authentication,
  authorization(['admin']), deleteIncomeCategory); // Admin delete

export default router;
