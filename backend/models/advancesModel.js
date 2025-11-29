import db from './database.js';

/**
 * Save a new advance record
 */
export const saveAdvance = async ({
  employee_id,
  amount,
  description
}) => {
  const query = `
    INSERT INTO advances (
      employee_id,
      amount,
      description,
      created_at
    )
    VALUES ($1, $2, $3, NOW())
    RETURNING *;
  `;

  const values = [employee_id, amount, description];
  const result = await db.query(query, values);
  return result.rows[0];
};

/**
 * Fetch all advances created today (Uganda timezone)
 */
export const fetchAllAdvances = async () => {
  const query = `
    SELECT a.*, (a.created_at AT TIME ZONE 'Africa/Kampala') AS created_at
    FROM advances a
    WHERE (a.created_at AT TIME ZONE 'Africa/Kampala')::date = CURRENT_DATE;
  `;
  const result = await db.query(query);
  return result.rows;
};

/**
 * Fetch a single advance by ID
 */
export const fetchAdvanceById = async (id) => {
  const query = `
    SELECT a.*, (a.created_at AT TIME ZONE 'Africa/Kampala') AS created_at
    FROM advances a
    WHERE a.id = $1;
  `;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

/**
 * Update an advance record by ID
 */
export const UpdateAdvanceById = async ({
  id,
  employee_id,
  amount,
  description,
  created_at,
}) => {

  console.log("data in the advances model",  id,
  employee_id,
  amount,
  description,
  created_at)
  const query = `
    UPDATE advances
    SET 
      employee_id = $1,
      amount = $2,
      description = $3,
      created_at = $4
    WHERE id = $5
    RETURNING *;
  `;
  const values = [employee_id, amount, description, created_at, id];
  const result = await db.query(query, values);
  return result.rows[0];
};

/**
 * Delete an advance by ID
 */
export const DeleteAdvanceById = async (id) => {
  const query = `DELETE FROM advances WHERE id = $1 RETURNING id;`;
  const result = await db.query(query, [id]);
  return result.rowCount > 0;
};

export default {
  saveAdvance,
  fetchAllAdvances,
  fetchAdvanceById,
  UpdateAdvanceById,
  DeleteAdvanceById
};
