import express from 'express';
const router = express.Router();

import { 
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById
} from '../controllers/usersController.js';

import upload from "../middleware/upload.js";

// GET all users
router.get('/', getAllUsers);

// GET single user by ID
router.get('/:id', getUserById);

// POST create a new user
router.post('/', upload.single("image_url"), createUser);

// PUT update an existing user by ID
router.put('/:id', upload.single("image_url"),  updateUserById);

// DELETE remove a user by ID
router.delete('/:id', deleteUserById);

export default router;
