import {
  createFinanceStructure,
  getFinanceStructures,
  getByClassAndTerm,
  updateFinanceStructure,
  deleteFinanceStructure,
} from "../models/financeStructureModel.js";

// CREATE
export const createFinanceStructureController = async (req, res) => {
  try {
    const data = await createFinanceStructure(req.body);
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create finance structure" });
  }
};

// GET ALL
export const getFinanceStructuresController = async (req, res) => {
  try {
    const data = await getFinanceStructures();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch finance structures" });
  }
};

// GET BY CLASS + TERM (FOR YOUR DROPDOWN LOGIC)
export const getByClassAndTermController = async (req, res) => {
  try {
    const { class_id, term_id } = req.params;

    const data = await getByClassAndTerm(class_id, term_id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch structure" });
  }
};

// UPDATE
export const updateFinanceStructureController = async (req, res) => {
  try {
    const data = await updateFinanceStructure(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to update finance structure" });
  }
};

// DELETE (SOFT DELETE)
export const deleteFinanceStructureController = async (req, res) => {
  try {
    await deleteFinanceStructure(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" });
  }
};