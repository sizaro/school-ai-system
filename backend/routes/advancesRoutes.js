import express from 'express';
const router = express.Router();

import {
  getAllAdvances,
  getAdvanceById,
  createAdvance,
  updateAdvanceById,
  deleteAdvanceById,
} from '../controllers/advancesController.js';

// GET all advances
router.get('/', getAllAdvances);

// GET single advance by ID
router.get('/:id', getAdvanceById);

// POST create new advance
router.post('/', createAdvance);

// PUT update advance by ID
router.put('/:id', updateAdvanceById);

// DELETE remove advance by ID
router.delete('/:id', deleteAdvanceById);

export default router;
