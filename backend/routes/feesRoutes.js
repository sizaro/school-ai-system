import express from 'express';
const router = express.Router();

// Import controllers
import {
  getAllLateFees,
  getLateFeeById,
  createLateFee,
  updateLateFeeById,
  deleteLateFeeById
} from '../controllers/lateFeesController.js';

import {
  getAllTagFees,
  getTagFeeById,
  createTagFee,
  updateTagFeeById,
  deleteTagFeeById,
} from '../controllers/tagFeesController.js';

/* -------------------- LATE FEES ROUTES -------------------- */

// Get all late fees
router.get('/late', getAllLateFees);

// Get late fee by ID
router.get('/late/:id', getLateFeeById);

// Create new late fee
router.post('/late', createLateFee);

// Update late fee
router.put('/late/:id', updateLateFeeById);

// Delete late fee
router.delete('/late/:id', deleteLateFeeById);

/* -------------------- TAG FEES ROUTES -------------------- */

// Get all tag fees
router.get('/tag', getAllTagFees);

// Get tag fee by ID
router.get('/tag/:id', getTagFeeById);

// Create new tag fee
router.post('/tag', createTagFee);

// Update tag fee
router.put('/tag/:id', updateTagFeeById);

// Delete tag fee
router.delete('/tag/:id', deleteTagFeeById);

export default router;
