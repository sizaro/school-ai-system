import db from "./database.js";

// Create term
export const createTerm = async (data) => {
  try {
    const {
      name,
      academic_year,
      start_date,
      end_date,
      recorded_by,
    } = data;

    console.log("data in the models", name, academic_year, start_date, end_date, recorded_by )

    const result = await db.query(
      `INSERT INTO terms (name, academic_year, start_date, end_date, recorded_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, academic_year, start_date, end_date, recorded_by]
    );

    return result.rows[0];
  } catch (err) {
    console.error("❌ createTerm DB error:", {
      message: err.message,
      code: err.code,
      detail: err.detail,
      hint: err.hint,
    });

    // rethrow so controller handles response
    throw err;
  }
};

// Get all terms
export const getTerms = async () => {
  const result = await db.query(`SELECT * FROM terms ORDER BY id DESC`);
  return result.rows;
};

// Set active term
export const setActiveTerm = async (termId) => {
  await db.query(`UPDATE terms SET is_active = false`);

  const result = await db.query(
    `UPDATE terms SET is_active = true WHERE id = $1 RETURNING *`,
    [termId]
  );

  return result.rows[0];
};

// Update term (IMPORTANT for editing dates)
export const updateTerm = async (id, data) => {
  const { name, academic_year, start_date, end_date } = data;

  const result = await db.query(
    `UPDATE terms
     SET name = $1,
         academic_year = $2,
         start_date = $3,
         end_date = $4
     WHERE id = $5
     RETURNING *`,
    [name, academic_year, start_date, end_date, id]
  );

  return result.rows[0];
};

// End term manually
export const endTerm = async (id) => {
  const result = await db.query(
    `UPDATE terms
     SET is_active = false,
         end_date = NOW()
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
};

// Delete term
export const deleteTermModel = async (id) => {
  const result = await db.query(
    `DELETE FROM terms WHERE id = $1 RETURNING *`,
    [id]
  );

  return result.rows[0];
};