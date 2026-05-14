import db from "./database.js";

// CREATE finance structure rule
export const createFinanceStructure = async (data) => {
  const { class_id, term_id, finance_type_id, amount } = data;

  const result = await db.query(
    `INSERT INTO finance_structures
     (class_id, term_id, finance_type_id, amount)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [class_id, term_id, finance_type_id, amount]
  );

  return result.rows[0];
};

// GET ALL STRUCTURES
export const getFinanceStructures = async () => {
  const result = await db.query(`
    SELECT fs.*,
           c.name AS class_name,
           t.name AS term_name,
           ft.name AS finance_type_name
    FROM finance_structures fs
    JOIN classes c ON c.id = fs.class_id
    JOIN terms t ON t.id = fs.term_id
    JOIN finance_types ft ON ft.id = fs.finance_type_id
    WHERE fs.is_active = true
    ORDER BY fs.id DESC
  `);

  return result.rows;
};

// GET BY CLASS + TERM (VERY IMPORTANT FOR DROPDOWN)
export const getByClassAndTerm = async (class_id, term_id) => {
  const result = await db.query(
    `SELECT fs.id,
            fs.amount,
            ft.id AS finance_type_id,
            ft.name AS finance_type_name
     FROM finance_structures fs
     JOIN finance_types ft ON ft.id = fs.finance_type_id
     WHERE fs.class_id = $1
     AND fs.term_id = $2
     AND fs.is_active = true`,
    [class_id, term_id]
  );

  return result.rows;
};

// UPDATE
export const updateFinanceStructure = async (id, data) => {
  const { class_id, term_id, finance_type_id, amount } = data;

  const result = await db.query(
    `UPDATE finance_structures
     SET class_id = $1,
         term_id = $2,
         finance_type_id = $3,
         amount = $4
     WHERE id = $5
     RETURNING *`,
    [class_id, term_id, finance_type_id, amount, id]
  );

  return result.rows[0];
};

// SOFT DELETE (IMPORTANT)
export const deleteFinanceStructure = async (id) => {
  const result = await db.query(
    `UPDATE finance_structures
     SET is_active = false
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
};