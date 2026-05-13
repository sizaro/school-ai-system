import db from "./database.js";

/**
 * Create subject AND assign to class (transaction)
 */
export const createSubject = async ({ subject_name, class_id }) => {

  try {
    await db.query("BEGIN");

    // 1. create subject
    const subjectRes = await db.query(
      `INSERT INTO subjects (name)
       VALUES ($1)
       RETURNING *`,
      [subject_name]
    );

    const subject = subjectRes.rows[0];

    // 2. link subject to class
    await db.query(
      `INSERT INTO class_subjects (class_id, subject_id)
       VALUES ($1, $2)`,
      [class_id, subject.id]
    );

    await db.query("COMMIT");

    return subject;
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Create subject error:", err);
    throw err;
  }
};

/**
 * GET ALL SUBJECTS
 */

export const getSubjects = async () => {
  const result = await db.query(`
    SELECT 
      cs.id AS row_id,
      s.id AS id,
      s.name AS subject_name,
      c.id AS class_id,
      c.name AS class_name
    FROM class_subjects cs
    JOIN subjects s ON s.id = cs.subject_id
    JOIN classes c ON c.id = cs.class_id
    ORDER BY cs.id DESC
  `);

  return result.rows;
};

/**
 * GET SUBJECT BY ID
 */
export const getSubjectById = async (id) => {
  const result = await db.query(
    `SELECT * FROM subjects WHERE id = $1`,
    [id]
  );

  return result.rows[0];
};

/**
 * UPDATE SUBJECT
 */
export const updateSubject = async ({ id, subject_name }) => {
  try {
    const result = await db.query(
      `UPDATE subjects
       SET name = $1
       WHERE id = $2
       RETURNING *`,
      [subject_name, id]
    );

    return result.rows[0];
  } catch (err) {
    console.error("Update subject error:", err);
    throw err;
  }
};



/**
 * DELETE SUBJECT
 */
export const deleteSubject = async (id) => {
  await db.query(`DELETE FROM subjects WHERE id = $1`, [id]);

  return { message: "Subject deleted successfully" };
};