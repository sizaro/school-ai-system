import express from 'express';
const router = express.Router();

import { 
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployeeById,
  deleteEmployeeById
} from '../controllers/employeesController.js';

// GET all employees
router.get('/', getAllEmployees);

router.get('/:id', getEmployeeById);

// POST create a new employee
router.post('/', createEmployee);

// PUT update an existing employee by ID
router.put('/:id', updateEmployeeById);

// DELETE remove an employee by ID
router.delete('/:id', deleteEmployeeById);

export default router;
