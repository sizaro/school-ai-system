import db from "./database.js";

// ================= GET ALL =================
export async function getGrades() {
  const result = await db.query(`
    SELECT 
      g.*,
      c.name AS class_name,
      t.name AS term_name
    FROM grades g
    LEFT JOIN classes c ON g.class_id = c.id
    LEFT JOIN terms t ON g.term_id = t.id
    ORDER BY c.name, g.academic_year DESC, t.id
  `);

  return result.rows;
}

// ================= CREATE =================
export async function createGrade(data) {
  const {
    class_id,
    term_id,
    academic_year,
    grade,
    min_score,
    max_score,
    remarks,
  } = data;

  const result = await db.query(
    `
    INSERT INTO grades (
      class_id,
      term_id,
      academic_year,
      grade,
      min_score,
      max_score,
      remarks
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
    `,
    [
      class_id,
      term_id,
      academic_year,
      grade,
      min_score,
      max_score,
      remarks,
    ]
  );

  return result.rows[0];
}

// ================= UPDATE =================
export async function updateGrade(id, data) {
  const {
    class_id,
    term_id,
    academic_year,
    grade,
    min_score,
    max_score,
    remarks,
  } = data;

  const result = await db.query(
    `
    UPDATE grades
    SET
      class_id = $1,
      term_id = $2,
      academic_year = $3,
      grade = $4,
      min_score = $5,
      max_score = $6,
      remarks = $7
    WHERE id = $8
    RETURNING *
    `,
    [
      class_id,
      term_id,
      academic_year,
      grade,
      min_score,
      max_score,
      remarks,
      id,
    ]
  );

  return result.rows[0];
}

// ================= DELETE =================
export async function deleteGrade(id) {
  await db.query(
    `
    DELETE FROM grades
    WHERE id = $1
    `,
    [id]
  );

  return true;
}