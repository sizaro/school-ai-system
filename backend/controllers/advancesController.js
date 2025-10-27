import { 
  saveAdvance, 
  fetchAllAdvances, 
  fetchAdvanceById, 
  UpdateAdvanceById, 
  DeleteAdvanceById 
} from "../models/advancesModel.js";

/**
 * Get all advances
 */
export const getAllAdvances = async (req, res) => {
  try {
    const advances = await fetchAllAdvances();
    res.status(200).json(advances);
  } catch (err) {
    console.error('Error fetching advances:', err);
    res.status(500).json({ error: 'Failed to fetch advances' });
  }
};

/**
 * Get advance by ID
 */
export const getAdvanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const advance = await fetchAdvanceById(id);
    if (!advance) {
      return res.status(404).json({ error: "Advance not found" });
    }
    res.status(200).json(advance);
  } catch (err) {
    console.error("Error fetching advance by ID:", err);
    res.status(500).json({ error: "Failed to fetch advance" });
  }
};

/**
 * Create new advance
 */
export const createAdvance = async (req, res) => {
  try {
    const { employee_id, amount, description } = req.body;

    console.log("Received new advance data:", req.body);

    const newAdvance = await saveAdvance({
      employee_id,
      amount,
      description,
    });

    res.status(201).json({ message: "Advance created successfully", data: newAdvance });
  } catch (err) {
    console.error("Error creating advance:", err);
    res.status(500).json({ error: "Failed to create advance" });
  }
};

/**
 * Update advance by ID
 */
export const updateAdvanceById = async (req, res) => {
  try {
    const { id, employee_id, amount, description, created_at } = req.body;

    if (!id) return res.status(400).json({ error: "Missing advance ID" });

    const updatedAdvance = await UpdateAdvanceById({
      id,
      employee_id,
      amount,
      description,
      created_at,
    });

    if (!updatedAdvance) {
      return res.status(404).json({ error: "Advance not found or not updated" });
    }

    res.status(200).json({ message: "Advance updated successfully", data: updatedAdvance });
  } catch (err) {
    console.error("Error updating advance:", err);
    res.status(500).json({ error: "Failed to update advance" });
  }
};

/**
 * Delete advance by ID
 */
export const deleteAdvanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DeleteAdvanceById(id);
    if (!deleted) return res.status(404).json({ error: "Advance not found" });
    res.status(200).json({ message: "Advance deleted successfully" });
  } catch (err) {
    console.error("Error deleting advance:", err);
    res.status(500).json({ error: "Failed to delete advance" });
  }
};

export default {
  getAllAdvances,
  getAdvanceById,
  createAdvance,
  updateAdvanceById,
  deleteAdvanceById
};
