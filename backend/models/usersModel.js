import db from './database.js';

/**
 * Fetch all users
 */
export const fetchAllUsers = async () => {
  const query = `
    SELECT u.*,
           (u.created_at AT TIME ZONE 'Africa/Kampala') AS user_time
    FROM users u
    ORDER BY u.id ASC;
  `;
  const result = await db.query(query);
  console.log("Fetched all users:", result.rows);
  return result.rows;
};

/**
 * Fetch single user by ID
 */
export const fetchUserById = async (id) => {
  const query = `SELECT * FROM users WHERE id = $1;`;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

/**
 * Save new user
 */
export const saveUser = async ({
  first_name,
  middle_name,
  last_name,
  phone,
  next_of_kin,
  next_of_kin_phone,
  email,
  password,
  role
}) => {
  const query = `
    INSERT INTO users 
      (first_name, middle_name, last_name, phone, next_of_kin, next_of_kin_phone, email, password, role, created_at) 
    VALUES 
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
    RETURNING *;
  `;
  const values = [
    first_name,
    middle_name,
    last_name,
    phone,
    next_of_kin,
    next_of_kin_phone,
    email,
    password,
    role
  ];
  const result = await db.query(query, values);
  return result.rows[0];
};

/**
 * Update user by ID
 */
export const UpdateUserById = async ({
  id,
  first_name,
  middle_name,
  last_name,
  phone,
  next_of_kin,
  next_of_kin_phone,
  email,
  password,
  role
}) => {
  const query = `
    UPDATE users SET
      first_name = $1,
      middle_name = $2,
      last_name = $3,
      phone = $4,
      next_of_kin = $5,
      next_of_kin_phone = $6,
      email = $7,
      password = $8,
      role = $9,
      updated_at = NOW()
    WHERE id = $10
    RETURNING *;
  `;
  const values = [
    first_name,
    middle_name,
    last_name,
    phone,
    next_of_kin,
    next_of_kin_phone,
    email,
    password,
    role,
    id
  ];
  const result = await db.query(query, values);
  return result.rows[0];
};

/**
 * Delete user by ID
 */
export const DeleteUserById = async (id) => {
  const query = `DELETE FROM users WHERE id = $1 RETURNING *;`;
  const result = await db.query(query, [id]);
  return result.rows[0];
};


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

export default {
  fetchAllUsers,
  fetchUserById,
  saveUser,
  UpdateUserById,
  DeleteUserById,
  findUserByEmail,
  findUserById
};
