// models/UserModel.js
import db from './database.js';

export const findUserByEmail = async (email) => {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

export const findUserById = async (id) => {
  const result = await db.query(
    "SELECT id, first_name, last_name, email, role FROM users WHERE id=$1",
    [id]
  );
  return result.rows[0];
};
