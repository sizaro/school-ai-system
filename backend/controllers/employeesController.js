import { 
  saveEmployee, 
  fetchAllEmployees, 
  fetchEmployeeById, 
  UpdateEmployeeById, 
  DeleteEmployeeById 
} from "../models/employeesModel.js";

/**
 * Get all employees
 */
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await fetchAllEmployees();
    res.status(200).json(employees);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id coming with update form", id)
    const employee = await fetchEmployeeById(id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (err) {
    console.error("Error fetching employee by ID:", err);
    res.status(500).json({ error: "Failed to fetch employee" });
  }
};

/**
 * Create new employee
 */
export const createEmployee = async (req, res) => {
  try {
    const { 
      first_name, 
      middle_name, 
      last_name, 
      phone, 
      next_of_kin, 
      next_of_kin_phone, 
      email, 
      password, 
      role 
    } = req.body;

    console.log("Received new employee data:", req.body);

    const newEmployee = await saveEmployee({
      first_name,
      middle_name,
      last_name,
      phone,
      next_of_kin,
      next_of_kin_phone,
      email,
      password,
      role
    });

    res.status(201).json({ message: "Employee created successfully", data: newEmployee });
  } catch (err) {
    console.error("Error creating employee:", err);
    res.status(500).json({ error: "Failed to create employee" });
  }
};

/**
 * Update employee by ID
 */
export const updateEmployeeById = async (req, res) => {
  try {
    const { 
      id,
      first_name, 
      middle_name, 
      last_name, 
      phone, 
      next_of_kin, 
      next_of_kin_phone, 
      email, 
      password, 
      role 
    } = req.body;

    if (!id) return res.status(400).json({ error: "Missing employee ID" });

    const updatedEmployee = await UpdateEmployeeById({
      id,
      first_name,
      middle_name,
      last_name,
      phone,
      next_of_kin,
      next_of_kin_phone,
      email,
      password,
      role
    });

    if (!updatedEmployee) {
      return res.status(404).json({ error: "Employee not found or not updated" });
    }

    res.status(200).json({ message: "Employee updated successfully", data: updatedEmployee });
  } catch (err) {
    console.error("Error updating employee:", err);
    res.status(500).json({ error: "Failed to update employee" });
  }
};

/**
 * Delete employee by ID
 */
export const deleteEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DeleteEmployeeById(id);
    if (!deleted) return res.status(404).json({ error: "Employee not found" });
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error("Error deleting employee:", err);
    res.status(500).json({ error: "Failed to delete employee" });
  }
};

export default {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployeeById,
  deleteEmployeeById
};
