import {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  removeClass,
} from "../models/classesModel.js";

// GET ALL
export const fetchClasses = async (req, res) => {
  try {
    const result = await getClasses();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ONE
export const fetchClassById = async (req, res) => {
  try {
    const result = await getClassById(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE
export const addClass = async (req, res) => {
  try {
    const result = await createClass(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const editClass = async (req, res) => {
  try {
    const result = await updateClass(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteClass = async (req, res) => {
  try {
    const result = await removeClass(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};