import {
  recordPerformance,
  getStudentPerformance
} from "../models/performanceModel.js";

export const addPerformance = async (req, res) => {
  try {
    const performance = await recordPerformance({
      ...req.body,
      recorded_by: req.body.recorded_by // 🔥 from frontend (your rule)
    });

    res.status(201).json(performance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const fetchPerformance = async (req, res) => {
  try {
    const { student_id, term_id } = req.params;

    const data = await getStudentPerformance(student_id, term_id);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};