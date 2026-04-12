import {
  createSubject,
  assignSubjectToClass,
  getSubjectsByClass
} from "../models/subjectModel.js";

export const addSubject = async (req, res) => {
  try {
    const { name } = req.body;
    const subject = await createSubject(name);
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const linkSubjectToClass = async (req, res) => {
  try {
    const { class_id, subject_id } = req.body;
    const result = await assignSubjectToClass(class_id, subject_id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const fetchClassSubjects = async (req, res) => {
  try {
    const class_id = req.params.class_id;
    const subjects = await getSubjectsByClass(class_id);
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};