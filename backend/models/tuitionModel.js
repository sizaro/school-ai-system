import db from "../db.js";

// Create or update tuition
export const upsertTuition = async (data) => {
  const { class_level, term_id, amount, recorded_by } = data;

  const result = await db.query(
    `INSERT INTO tuition_structures (class_level, term_id, amount, recorded_by)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (class_level, term_id)
     DO UPDATE SET amount = EXCLUDED.amount,
                   recorded_by = EXCLUDED.recorded_by
     RETURNING *`,
    [class_level, term_id, amount, recorded_by]
  );

  return result.rows[0];
};

// Get all tuition
export const getAllTuition = async () => {
  const result = await db.query(
    `SELECT t.*, terms.name as term_name, terms.academic_year
     FROM tuition_structures t
     JOIN terms ON t.term_id = terms.id
     ORDER BY t.id DESC`
  );

  return result.rows;
};

// Get tuition for a class + term
export const getTuitionByClassAndTerm = async (class_level, term_id) => {
  const result = await db.query(
    `SELECT * FROM tuition_structures
     WHERE class_level = $1 AND term_id = $2`,
    [class_level, term_id]
  );

  return result.rows[0];
};