import db from './database.js';

/**
 * Fetch all users
 */
export const fetchAllUsers = async () => {
  const query = `
    SELECT *
    FROM users
    ORDER BY id ASC;
  `;
  const result = await db.query(query);
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
  email,
  password,
  role,
}) => {
  const query = `
    INSERT INTO users (email, password, role, created_at)
    VALUES ($1, $2, $3, NOW())
    RETURNING *;
  `;

  const values = [
    email,
    password,
    role || 'student'
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};

/**
 * Update user by ID
 */
export const UpdateUserById = async (data) => {
  let { id, email, password, role } = data;

  id = parseInt(id, 10);
  if (isNaN(id)) {
    throw new Error("Invalid user ID");
  }

  const fields = [];
  const values = [];

  if (email !== undefined) {
    fields.push(`email = $${fields.length + 1}`);
    values.push(email);
  }

  if (password !== undefined) {
    fields.push(`password = $${fields.length + 1}`);
    values.push(password);
  }

  if (role !== undefined) {
    fields.push(`role = $${fields.length + 1}`);
    values.push(role);
  }

  if (!fields.length) return;

  values.push(id);

  const query = `
    UPDATE users
    SET ${fields.join(", ")}
    WHERE id = $${values.length}
    RETURNING *;
  `;

  const result = await db.query(query, values);
  return result.rows[0];
};

/**
 * Delete user
 */
export const DeleteUserById = async (id) => {
  const query = `DELETE FROM users WHERE id = $1 RETURNING *;`;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

/**
 * Find user by email
 */
export const findUserByEmail = async (email) => {
  const result = await db.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0];
};

/**
 * Find user by ID (login/session)
 */
export const findUserById = async (id) => {
  const result = await db.query(
    "SELECT id, email, role FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
};