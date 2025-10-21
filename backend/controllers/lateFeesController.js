import { 
  saveLateFee, 
  fetchAllLateFees, 
  fetchLateFeeById, 
  UpdateLateFeeById,
  DeleteLateFeeById 
} from "../models/lateFeesModel.js";

/**
 * Get all late fees
 */
export const getAllLateFees = async (req, res) => {
  try {
    const lateFees = await fetchAllLateFees();
    res.status(200).json(lateFees);
  } catch (err) {
    console.error('Error fetching late fees:', err);
    res.status(500).json({ error: 'Failed to fetch late fees' });
  }
};

/**
 * Get late fee by ID
 */
export const getLateFeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const lateFee = await fetchLateFeeById(id);
    if (!lateFee) {
      return res.status(404).json({ error: "Late fee not found" });
    }
    res.status(200).json(lateFee);
  } catch (err) {
    console.error("Error fetching late fee by ID:", err);
    res.status(500).json({ error: "Failed to fetch late fee" });
  }
};

/**
 * Create new late fee
 */
export const createLateFee = async (req, res) => {
  try {
    const { employee_id } = req.body; // fee amount handled in model logic

    console.log("Received new late fee data:", req.body);

    const newLateFee = await saveLateFee({ employee_id });

    res.status(201).json({ message: "Late fee created successfully", data: newLateFee });
  } catch (err) {
    console.error("Error creating late fee:", err);
    res.status(500).json({ error: "Failed to create late fee" });
  }
};

/**
 * Update late fee by ID
 */
export const updateLateFeeById = async (req, res) => {
  try {
    const { id, employee_id, created_at } = req.body;
    if (!id) return res.status(400).json({ error: "Missing late fee ID" });

    const updatedLateFee = await UpdateLateFeeById({ id, employee_id, created_at });

    if (!updatedLateFee) {
      return res.status(404).json({ error: "Late fee not found or not updated" });
    }

    res.status(200).json({ message: "Late fee updated successfully", data: updatedLateFee });
  } catch (err) {
    console.error("Error updating late fee:", err);
    res.status(500).json({ error: "Failed to update late fee" });
  }
};

/**
 * Delete late fee by ID
 */
export const deleteLateFeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DeleteLateFeeById(id);
    if (!deleted) return res.status(404).json({ error: "Late fee not found" });
    res.status(200).json({ message: "Late fee deleted successfully" });
  } catch (err) {
    console.error("Error deleting late fee:", err);
    res.status(500).json({ error: "Failed to delete late fee" });
  }
};

export default {
  getAllLateFees,
  getLateFeeById,
  createLateFee,
  updateLateFeeById,
  deleteLateFeeById
};
