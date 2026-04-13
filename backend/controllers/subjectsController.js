import {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} from "../models/subjectsModel.js";

/**
 * CREATE
 */
export const addSubject = async (req, res) => {
  try {
    const result = await createSubject(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error("Create subject error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET ALL
 */
export const fetchSubjects = async (req, res) => {
  try {
    const result = await getSubjects();
    console.log("subjects in controller from models", result)
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET ONE
 */
export const fetchSubjectById = async (req, res) => {
  try {
    const result = await getSubjectById(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * UPDATE
 */
export const editSubject = async (req, res) => {
  try {
    const result = await updateSubject(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE
 */
export const removeSubject = async (req, res) => {
  try {
    const result = await deleteSubject(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};