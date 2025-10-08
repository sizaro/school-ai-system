// models/servicesModel.js
import db from '../models/database.js';

/**
 * Save a new service
 */
export const saveService = async ({
  name,
  service_amount,
  salon_amount,
  barber,
  barber_amount,
  barber_assistant,
  barber_assistant_amount,
  scrubber_assistant,
  scrubber_assistant_amount,
  black_shampoo_assistant,
  black_shampoo_assistant_amount,
  black_shampoo_amount,
  super_black_assistant,
  super_black_assistant_amount,
  super_black_amount,
  black_mask_assistant,
  black_mask_assistant_amount,
  black_mask_amount,
}) => {
  const query = `
    INSERT INTO services (
      name,
      service_amount,
      salon_amount,
      barber,
      barber_amount,
      barber_assistant,
      barber_assistant_amount,
      scrubber_assistant,
      scrubber_assistant_amount,
      black_shampoo_assistant,
      black_shampoo_assistant_amount,
      black_shampoo_amount,
      super_black_assistant,
      super_black_assistant_amount,
      super_black_amount,
      black_mask_assistant,
      black_mask_assistant_amount,
      black_mask_amount,
      service_timestamp
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12, $13,
      $14, $15, $16, $17, $18, NOW()
    )
    RETURNING *;
  `;

  const values = [
    name,
    service_amount,
    salon_amount,
    barber,
    barber_amount,
    barber_assistant,
    barber_assistant_amount,
    scrubber_assistant,
    scrubber_assistant_amount,
    black_shampoo_assistant,
    black_shampoo_assistant_amount,
    black_shampoo_amount,
    super_black_assistant,
    super_black_assistant_amount,
    super_black_amount,
    black_mask_assistant,
    black_mask_assistant_amount,
    black_mask_amount,
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};

/**
 * Fetch all services for the current day (Kampala timezone)
 */
export const fetchAllServices = async () => {
  const query = `
    SELECT 
      s.*,
      (s.service_timestamp AT TIME ZONE 'Africa/Kampala') AS "service_time"
    FROM services s
    WHERE (s.service_timestamp AT TIME ZONE 'Africa/Kampala')::date = CURRENT_DATE
    ORDER BY id DESC;
  `;
  const result = await db.query(query);
  console.log("Fetched all services from DB:", result.rows);
  return result.rows;
};

/**
 * Fetch one service by ID
 */
export const fetchServiceById = async (id) => {
  const query = `
    SELECT 
      s.*,
      (s.service_timestamp AT TIME ZONE 'Africa/Kampala') AS "service_time"
    FROM services s
    WHERE s.id = $1;
  `;
  const result = await db.query(query, [id]);
  return result.rows[0] || null;
};

/**
 * Update a service by ID
 */
export const updateServiceById = async (
  {
    name,
    service_amount,
    salon_amount,
    barber,
    barber_amount,
    barber_assistant,
    barber_assistant_amount,
    scrubber_assistant,
    scrubber_assistant_amount,
    black_shampoo_assistant,
    black_shampoo_assistant_amount,
    black_shampoo_amount,
    super_black_assistant,
    super_black_assistant_amount,
    super_black_amount,
    black_mask_assistant,
    black_mask_assistant_amount,
    black_mask_amount,
    service_timestamp,
    id
  }
) => {
  const query = `
    UPDATE services
    SET
      name = $1,
      service_amount = $2,
      salon_amount = $3,
      barber = $4,
      barber_amount = $5,
      barber_assistant = $6,
      barber_assistant_amount = $7,
      scrubber_assistant = $8,
      scrubber_assistant_amount = $9,
      black_shampoo_assistant = $10,
      black_shampoo_assistant_amount = $11,
      black_shampoo_amount = $12,
      super_black_assistant = $13,
      super_black_assistant_amount = $14,
      super_black_amount = $15,
      black_mask_assistant = $16,
      black_mask_assistant_amount = $17,
      black_mask_amount = $18,
      service_timestamp = $19
    WHERE id = $20
    RETURNING *;
  `;

  const values = [
    name,
    service_amount,
    salon_amount,
    barber,
    barber_amount,
    barber_assistant,
    barber_assistant_amount,
    scrubber_assistant,
    scrubber_assistant_amount,
    black_shampoo_assistant,
    black_shampoo_assistant_amount,
    black_shampoo_amount,
    super_black_assistant,
    super_black_assistant_amount,
    super_black_amount,
    black_mask_assistant,
    black_mask_assistant_amount,
    black_mask_amount,
    service_timestamp,
    id
  ];

  const result = await db.query(query, values);
  return result.rows[0] || null;
};
/**
 * Delete a service by ID
 */
export const deleteServiceById = async (id) => {
  const query = `DELETE FROM services WHERE id = $1 RETURNING id;`;
  const result = await db.query(query, [id]);
  return result.rowCount > 0;
};

export default {
  saveService,
  fetchAllServices,
  fetchServiceById,
  updateServiceById,
  deleteServiceById,
};
