import db from "./database.js";

/**
 * CREATE student performance record
 */
export const createPerformance = async (data) => {
  const {
    student_id,
    subject_id,
    class_id,
    term_id,
    academic_year,
    assessment_type,
    marks_obtained,
    marks_total,
    percentage,
    grade_id,
    remarks,
    file_url,
    recorded_by,
  } = data;

  const query = {
    text: `
      INSERT INTO student_performance (
        student_id,
        subject_id,
        class_id,
        term_id,
        academic_year,
        assessment_type,
        marks_obtained,
        marks_total,
        percentage,
        grade_id,
        remarks,
        file_url,
        recorded_by
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
      )
      RETURNING *
    `,
    values: [
      student_id,
      subject_id,
      class_id,
      term_id,
      academic_year,
      assessment_type,
      marks_obtained,
      marks_total,
      percentage,
      grade_id,
      remarks,
      file_url,
      recorded_by,
    ],
  };

  const result = await db.query(query);
  return result.rows[0];
};



export const getAllPerformance = async () => {
  const query = {
    text: `
      SELECT 
        sp.*,
        s.first_name || ' ' || s.last_name AS student_name,
        sub.name AS subject_name,
        c.name AS class_name,
        t.name AS term_name,
        g.grade AS grade_letter

      FROM student_performance sp

      JOIN students s ON s.id = sp.student_id
      JOIN subjects sub ON sub.id = sp.subject_id
      JOIN classes c ON c.id = sp.class_id
      JOIN terms t ON t.id = sp.term_id
      JOIN grades g ON g.id = sp.grade_id

      ORDER BY sp.created_at DESC
    `,
  };

  const result = await db.query(query);
  return result.rows;
};



export const getPerformanceByStudent = async (student_id) => {
  const query = {
    text: `
      SELECT 
        sp.*,
        sub.name AS subject_name,
        c.name AS class_name,
        t.name AS term_name,
        g.grade AS grade_letter

      FROM student_performance sp

      JOIN subjects sub ON sub.id = sp.subject_id
      JOIN classes c ON c.id = sp.class_id
      JOIN terms t ON t.id = sp.term_id
      JOIN grades g ON g.id = sp.grade_id

      WHERE sp.student_id = $1

      ORDER BY sp.created_at DESC
    `,
    values: [student_id],
  };

  const result = await db.query(query);
  return result.rows;
};


export const updatePerformance = async (id, data) => {
  const {
    assessment_type,
    marks_obtained,
    marks_total,
    percentage,
    grade_id,
    remarks,
    file_url,
  } = data;

  const query = {
    text: `
      UPDATE student_performance
      SET
        assessment_type = $1,
        marks_obtained = $2,
        marks_total = $3,
        percentage = $4,
        grade_id = $5,
        remarks = $6,
        file_url = $7
      WHERE id = $8
      RETURNING *
    `,
    values: [
      assessment_type,
      marks_obtained,
      marks_total,
      percentage,
      grade_id,
      remarks,
      file_url,
      id,
    ],
  };

  const result = await db.query(query);
  return result.rows[0];
};


export const deletePerformance = async (id) => {
  const query = {
    text: `DELETE FROM student_performance WHERE id = $1`,
    values: [id],
  };

  await db.query(query);
  return true;
};


export const getGradeByScore = async (
  percentage,
  class_id,
  term_id,
  academic_year
) => {
  const query = {
    text: `
      SELECT id, grade
      FROM grades
      WHERE 
        $1 BETWEEN min_score AND max_score
        AND class_id = $2
        AND term_id = $3
        AND academic_year = $4
      LIMIT 1
    `,
    values: [percentage, class_id, term_id, academic_year],
  };

  const result = await db.query(query);
  return result.rows[0];
};