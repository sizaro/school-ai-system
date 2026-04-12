import db from "../db.js";

export const recordPerformance = async (data) => {
  const {
    student_id,
    subject_id,
    term_id,
    assessment_type,
    marks_obtained,
    marks_total,
    grade,
    remarks,
    recorded_by
  } = data;

  const result = await db.query(
    `INSERT INTO student_performance
     (student_id, subject_id, term_id, assessment_type,
      marks_obtained, marks_total, grade, remarks, recorded_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING *`,
    [
      student_id,
      subject_id,
      term_id,
      assessment_type,
      marks_obtained,
      marks_total,
      grade,
      remarks,
      recorded_by
    ]
  );

  return result.rows[0];
};

// get performance per student per term
export const getStudentPerformance = async (student_id, term_id) => {
  const result = await db.query(
    `SELECT sp.*, s.name as subject
     FROM student_performance sp
     JOIN subjects s ON s.id = sp.subject_id
     WHERE sp.student_id = $1 AND sp.term_id = $2`,
    [student_id, term_id]
  );

  return result.rows;
};