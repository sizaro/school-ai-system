import {
  upsertTuition,
  getAllTuition,
  getTuitionByClassAndTerm,
} from "../models/tuitionModel.js";

// Create or update tuition
export const saveTuition = async (req, res) => {
  try {
    const { class_level, term_id, amount } = req.body;

    const result = await upsertTuition({
      class_level,
      term_id,
      amount,
      recorded_by: req.user?.id, // ✅ your rule
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all tuition
export const fetchTuition = async (req, res) => {
  try {
    const result = await getAllTuition();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get tuition for class + term
export const getTuition = async (req, res) => {
  try {
    const { class_level, term_id } = req.query;

    const result = await getTuitionByClassAndTerm(class_level, term_id);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};