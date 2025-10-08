import { 
  saveExpense, 
  fetchAllExpenses, 
  fetchExpenseById, 
  UpdateExpenseById, 
  DeleteExpenseById 
} from "../models/expensesModel.js";

/**
 * Get all expenses
 */
export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await fetchAllExpenses();
    res.status(200).json(expenses);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};

/**
 * Get expense by ID
 */
export const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await fetchExpenseById(id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(200).json(expense);
  } catch (err) {
    console.error("Error fetching expense by ID:", err);
    res.status(500).json({ error: "Failed to fetch expense" });
  }
};

/**
 * Create new expense
 */
export const createExpense = async (req, res) => {
  try {
    const { name, amount, description } = req.body;

    console.log("Received new expense data:", req.body);

    const newExpense = await saveExpense({ name, amount,description });

    res.status(201).json({ message: "Expense created successfully", data: newExpense });
  } catch (err) {
    console.error("Error creating expense:", err);
    res.status(500).json({ error: "Failed to create expense" });
  }
};

/**
 * Update expense by ID
 */
export const updateExpenseById = async (req, res) => {
  try {
    const { id, name, amount, description } = req.body;

    if (!id) return res.status(400).json({ error: "Missing expense ID" });

    const updatedExpense = await UpdateExpenseById({ id, name, amount, description });

    if (!updatedExpense) {
      return res.status(404).json({ error: "Expense not found or not updated" });
    }

    res.status(200).json({ message: "Expense updated successfully", data: updatedExpense });
  } catch (err) {
    console.error("Error updating expense:", err);
    res.status(500).json({ error: "Failed to update expense" });
  }
};

/**
 * Delete expense by ID
 */
export const deleteExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DeleteExpenseById(id);
    if (!deleted) return res.status(404).json({ error: "Expense not found" });
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).json({ error: "Failed to delete expense" });
  }
};

export default {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpenseById,
  deleteExpenseById
};
