import {
  createPerformance,
  getAllPerformance,
  getPerformanceByStudent,
  updatePerformance,
  deletePerformance,
  getGradeByScore,
} from "../models/studentPerformanceModel.js";

/**
 * CREATE performance
 */
export const addPerformance = async (req, res) => {
  try {
    const data = req.body;

    // 1. Calculate percentage
    const percentage =
      (Number(data.marks_obtained) / Number(data.marks_total)) * 100;

    // 2. Get grade from MODEL
    const grade = await getGradeByScore(
      percentage,
      data.class_id,
      data.term_id,
      data.academic_year
    );

    if (!grade) {
      return res.status(400).json({
        message: "No grade range found for this score",
      });
    }

    // 3. Optional file upload
    const file_url = req.file
      ? `/uploads/performance/${req.file.filename}`
      : null;

    // 4. Create record
    const result = await createPerformance({
      ...data,
      percentage,
      grade_id: grade.id,
      file_url,
      recorded_by: req.user?.id || data.recorded_by,
    });

    res.status(201).json(result);
  } catch (err) {
    console.error("CREATE PERFORMANCE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET ALL performance
 */
export const fetchAllPerformance = async (req, res) => {
  try {
    const result = await getAllPerformance();
    res.json(result);
  } catch (err) {
    console.error("FETCH ALL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET performance by student
 */
export const fetchStudentPerformance = async (req, res) => {
  try {
    const { student_id } = req.params;

    const result = await getPerformanceByStudent(student_id);
    res.json(result);
  } catch (err) {
    console.error("FETCH STUDENT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * UPDATE performance
 */
export const editPerformance = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Recalculate percentage if marks changed
    const percentage =
      (Number(data.marks_obtained) / Number(data.marks_total)) * 100;

    const grade = await getGradeByScore(
      percentage,
      data.class_id,
      data.term_id,
      data.academic_year
    );

    const file_url = req.file
      ? `/uploads/performance/${req.file.filename}`
      : data.file_url;

    const result = await updatePerformance(id, {
      ...data,
      percentage,
      grade_id: grade?.id,
      file_url,
    });

    res.json(result);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE performance
 */
export const removePerformance = async (req, res) => {
  try {
    const { id } = req.params;

    await deletePerformance(id);

    res.json({ message: "Performance deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};