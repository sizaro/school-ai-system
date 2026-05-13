import {
  getAllFinanceTypesModel,
  createFinanceTypeModel,
  updateFinanceTypeModel,
  deleteFinanceTypeModel
} from "../models/financeTypeModel.js";

// GET ALL
export const getFinanceTypes = async (req, res) => {
  try {
    const data = await getAllFinanceTypesModel();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE
export const createFinanceType = async (req, res) => {
  try {
    const data = await createFinanceTypeModel(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateFinanceType = async (req, res) => {
  try {
    const data = await updateFinanceTypeModel(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteFinanceType = async (req, res) => {
  try {
    await deleteFinanceTypeModel(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};