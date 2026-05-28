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
    console.log("contrl perfmc data: ", req.body)
  try {
    const {
      student_id,
      subject_id,
      class_id,
      term_id,
      academic_year,
      assessment_type,
      marks_obtained,
      marks_total,
      remarks,
    } = req.body;

    // 1. percentage
    const percentage =
      (Number(marks_obtained) / Number(marks_total)) * 100;

    // 2. grade lookup
    const grade = await getGradeByScore(
      percentage,
      class_id,
      term_id,
      academic_year
    );

    // 3. file handling (THIS FIXES YOUR BUG)
    let file_url = null;

    if (req.file) {
      file_url = req.file.path; // or req.file.filename
    }

    // 4. recorded_by (TEMP FIX)
    const recorded_by = req.user?.id || 1;

    const data = {
      student_id,
      subject_id,
      class_id,
      term_id,
      academic_year,
      assessment_type,
      marks_obtained,
      marks_total,
      percentage,
      grade_id: grade?.id || null,
      remarks,
      file_url,
      recorded_by,
    };

    const result = await createPerformance(data);

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create performance" });
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
    console.log("request", req.params)

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
        console.log("controller params: ", req.params)
    const data = req.body;
        console.log("controller data: ", data)

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