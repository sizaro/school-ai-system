import db from "./database.js";

// GET ALL
export const getAllFinanceTypesModel = async () => {
  const { rows } = await db.query(
    "SELECT * FROM finance_types ORDER BY id ASC"
  );
  return rows;
};

// CREATE
export const createFinanceTypeModel = async (data) => {
  const { name, description } = data;

  const { rows } = await db.query(
    `INSERT INTO finance_types (name, description)
     VALUES ($1, $2)
     RETURNING *`,
    [name, description]
  );

  return rows[0];
};

// UPDATE
export const updateFinanceTypeModel = async (id, data) => {
  const { name, description, is_active } = data;

  const { rows } = await db.query(
    `UPDATE finance_types
     SET name = $1,
         description = $2,
         is_active = $3
     WHERE id = $4
     RETURNING *`,
    [name, description, is_active, id]
  );

  return rows[0];
};

// DELETE
export const deleteFinanceTypeModel = async (id) => {
  await db.query("DELETE FROM finance_types WHERE id = $1", [id]);
};