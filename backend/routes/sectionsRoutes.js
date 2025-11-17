import express from 'express';
const router = express.Router();

import {
  getSections,
  getSection,
  createSection,
  updateSection,
  deleteSection,
} from '../controllers/sectionsController.js';

// Fetch all sections
router.get('/', getSections);

// Fetch a single section by ID
router.get('/:id', getSection);

// Create a new section
router.post('/create', createSection);

// Update a section by ID
router.put('/:id', updateSection);

// Delete a section by ID
router.delete('/:id', deleteSection);

export default router;
