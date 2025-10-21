import db from './database.js';

/**
 * Save a new tag fee record
 */
export const saveTagFee = async ({ employee_id, amount, description }) => {
  const query = `
    INSERT INTO tag_fees (
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
 * Fetch all tag fees created today (Uganda timezone)
 */
export const fetchAllTagFees = async () => {
  const query = `
    SELECT t.*, (t.created_at AT TIME ZONE 'Africa/Kampala') AS created_at
    FROM tag_fees t
    WHERE (t.created_at AT TIME ZONE 'Africa/Kampala')::date = CURRENT_DATE
    ORDER BY id DESC;
  `;
  const result = await db.query(query);
  return result.rows;
};

/**
 * Fetch a single tag fee by ID
 */
export const fetchTagFeeById = async (id) => {
  const query = `
    SELECT t.*, (t.created_at AT TIME ZONE 'Africa/Kampala') AS created_at
    FROM tag_fees t
    WHERE t.id = $1;
  `;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

/**
 * Update a tag fee record by ID
 */
export const UpdateTagFeeById = async ({ id, employee_id, amount, description, created_at }) => {
  const query = `
    UPDATE tag_fees
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
 * Delete a tag fee by ID
 */
export const DeleteTagFeeById = async (id) => {
  const query = `DELETE FROM tag_fees WHERE id = $1 RETURNING id;`;
  const result = await db.query(query, [id]);
  return result.rowCount > 0;
};

export default {
  saveTagFee,
  fetchAllTagFees,
  fetchTagFeeById,
  UpdateTagFeeById,
  DeleteTagFeeById
};
