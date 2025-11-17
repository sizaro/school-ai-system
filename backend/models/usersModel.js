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
  email,
  password,
  birthdate,
  contact,
  next_of_kin,
  next_of_kin_contact,
  role,
  specialty,
  status,
  bio,
  image_url
}) => {
  const query = `
    INSERT INTO users 
      (
        first_name, middle_name, last_name, email, password, 
        birthdate, contact, next_of_kin, next_of_kin_contact, 
        role, specialty, status, bio, image_url, created_at
      ) 
    VALUES 
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,NOW())
    RETURNING *;
  `;

  const values = [
    first_name || null,
    middle_name || null,
    last_name || null,
    email || null,
    password || null,
    birthdate || null,
    contact || null,
    next_of_kin || null,
    next_of_kin_contact || null,
    role || 'customer',
    specialty || null,
    status || 'active',
    bio || null,
    image_url
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};
export const UpdateUserById = async (data) => {
  let {
    id,
    first_name,
    middle_name,
    last_name,
    email,
    password,
    birthdate,
    contact,
    next_of_kin,
    next_of_kin_contact,
    role,
    specialty,
    status,
    bio,
    image_url,
  } = data;

  // Ensure ID is a valid integer
  id = parseInt(id, 10);
  if (isNaN(id)) {
    throw new Error("Invalid user ID (NaN or undefined)");
  }

  // Base fields to update
  const fields = [
    "first_name = $1",
    "middle_name = $2",
    "last_name = $3",
    "email = $4",
    "password = $5",
    "birthdate = $6",
    "contact = $7",
    "next_of_kin = $8",
    "next_of_kin_contact = $9",
    "role = $10",
    "specialty = $11",
    "status = $12",
    "bio = $13",
  ];

  const values = [
    first_name || null,
    middle_name || null,
    last_name || null,
    email || null,
    password || null,
    birthdate || null,
    contact || null,
    next_of_kin || null,
    next_of_kin_contact || null,
    role || "customer",
    specialty || null,
    status || "active",
    bio || null,
  ];

  // Only update image_url if it’s explicitly provided
  if (image_url !== undefined && image_url !== "") {
    fields.push(`image_url = $${fields.length + 1}`);
    values.push(image_url);
  }

  // Add id for WHERE clause
  values.push(id);

  const query = `
    UPDATE users
    SET ${fields.join(", ")}
    WHERE id = $${values.length}
    RETURNING *;
  `;

  console.log("Final SQL:", query);
  console.log("Values:", values);

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
