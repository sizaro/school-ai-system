import db from '../models/database.js';

/**
 * Fetch all employees
 */
export const fetchAllEmployees = async () => {
  const query = `
    SELECT u.*,
           (u.created_at AT TIME ZONE 'Africa/Kampala') AS employee_time
    FROM users u
    WHERE u.role IN ('employee', 'manager', 'owner')
    ORDER BY u.id ASC;
  `;
  const result = await db.query(query);
  console.log("Fetched all employees:", result.rows);
  return result.rows;
};

/**
 * Fetch single employee by ID
 */
export const fetchEmployeeById = async (id) => {
  const query = `SELECT * FROM employees WHERE id = $1;`;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

/**
 * Save new employee
 */
export const saveEmployee = async ({
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
    INSERT INTO employees 
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
 * Update employee by ID
 */
export const UpdateEmployeeById = async ({
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
    UPDATE employees SET
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
 * Delete employee by ID
 */
export const DeleteEmployeeById = async (id) => {
  const query = `DELETE FROM employees WHERE id = $1 RETURNING *;`;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

export default {
  fetchAllEmployees,
  fetchEmployeeById,
  saveEmployee,
  UpdateEmployeeById,
  DeleteEmployeeById
};
