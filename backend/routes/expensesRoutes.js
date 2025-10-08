import express from 'express';
const router = express.Router();

import {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpenseById,
  deleteExpenseById,
} from '../controllers/expensesController.js';

// GET all expenses
router.get('/', getAllExpenses);

// GET single expense by ID
router.get('/:id', getExpenseById);

// POST create new expense
router.post('/', createExpense);

// PUT update expense by ID
router.put('/:id', updateExpenseById);

// DELETE remove expense by ID
router.delete('/:id', deleteExpenseById);

export default router;
