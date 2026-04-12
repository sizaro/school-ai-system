import {
  createTerm,
  getTerms,
  setActiveTerm,
  updateTerm,
  endTerm,
} from "../models/termsModel.js";

// Create term
export const addTerm = async (req, res) => {
  try {
    const data = req.body;
    const result = await createTerm({
      ...data,
      recorded_by: req.user?.id,
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all terms
export const fetchTerms = async (req, res) => {
  try {
    const result = await getTerms();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Set active term
export const activateTerm = async (req, res) => {
  try {
    const result = await setActiveTerm(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update term
export const editTerm = async (req, res) => {
  try {
    const result = await updateTerm(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// End term
export const closeTerm = async (req, res) => {
  try {
    const result = await endTerm(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};