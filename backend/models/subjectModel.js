import db from "../db.js";

// create subject
export const createSubject = async (name) => {
  const result = await db.query(
    `INSERT INTO subjects (name) VALUES ($1) RETURNING *`,
    [name]
  );
  return result.rows[0];
};

// assign subject to class
export const assignSubjectToClass = async (class_id, subject_id) => {
  const result = await db.query(
    `INSERT INTO class_subjects (class_id, subject_id)
     VALUES ($1,$2)
     ON CONFLICT DO NOTHING
     RETURNING *`,
    [class_id, subject_id]
  );
  return result.rows[0];
};

// get subjects for a class
export const getSubjectsByClass = async (class_id) => {
  const result = await db.query(
    `SELECT s.*
     FROM subjects s
     JOIN class_subjects cs ON cs.subject_id = s.id
     WHERE cs.class_id = $1`,
    [class_id]
  );
  return result.rows;
};