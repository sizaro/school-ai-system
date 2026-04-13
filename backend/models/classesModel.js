import db from "./database.js";

// CREATE CLASS
export const createClass = async (data) => {
  const { name } = data;

  const result = await db.query(
    `INSERT INTO classes (name)
     VALUES ($1)
     RETURNING *`,
    [name]
  );

  return result.rows[0];
};

// GET ALL CLASSES
export const getClasses = async () => {
  const result = await db.query(
    `SELECT * FROM classes ORDER BY id ASC`
  );
  return result.rows;
};

// GET ONE CLASS
export const getClassById = async (id) => {
  const result = await db.query(
    `SELECT * FROM classes WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

// UPDATE CLASS
export const updateClass = async (id, data) => {
  const { name } = data;

  const result = await db.query(
    `UPDATE classes
     SET name = $1
     WHERE id = $2
     RETURNING *`,
    [name, id]
  );

  return result.rows[0];
};

// DELETE CLASS
export const removeClass = async (id) => {
  const result = await db.query(
    `DELETE FROM classes WHERE id = $1 RETURNING *`,
    [id]
  );

  return result.rows[0];
};