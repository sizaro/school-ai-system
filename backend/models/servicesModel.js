import db from '../models/database.js';

/**
 * Save a new service (or appointment)
 */

export const saveService = async (service) => {
  const {
    name,
    service_amount,
    salon_amount,
    barber_id,
    barber_amount,
    barber_assistant_id,
    barber_assistant_amount,
    scrubber_assistant_id,
    scrubber_assistant_amount,
    black_shampoo_assistant_id,
    black_shampoo_assistant_amount,
    black_shampoo_amount,
    super_black_assistant_id,
    super_black_assistant_amount,
    super_black_amount,
    black_mask_assistant_id,
    black_mask_assistant_amount,
    black_mask_amount,
    customer_note,
    created_by,
    status,
    appointment_date,
    appointment_time,
    customer_id
  } = service;

  // ✅ Convert empty strings to null for date/time
  const safeAppointmentDate = appointment_date === "" ? null : appointment_date;
  const safeAppointmentTime = appointment_time === "" ? null : appointment_time;

  const query = `
    INSERT INTO services (
      name,
      service_amount,
      salon_amount,
      barber_id,
      barber_amount,
      barber_assistant_id,
      barber_assistant_amount,
      scrubber_assistant_id,
      scrubber_assistant_amount,
      black_shampoo_assistant_id,
      black_shampoo_assistant_amount,
      black_shampoo_amount,
      super_black_assistant_id,
      super_black_assistant_amount,
      super_black_amount,
      black_mask_assistant_id,
      black_mask_assistant_amount,
      black_mask_amount,
      customer_note,
      created_by,
      status,
      appointment_date,
      appointment_time,
      customer_id,
      service_timestamp
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12, $13,
      $14, $15, $16, $17, $18,
      $19, $20, $21, $22, $23, $24, NOW()
    )
    RETURNING *;
  `;

  const values = [
    name,
    service_amount,
    salon_amount,
    barber_id,
    barber_amount,
    barber_assistant_id,
    barber_assistant_amount,
    scrubber_assistant_id,
    scrubber_assistant_amount,
    black_shampoo_assistant_id,
    black_shampoo_assistant_amount,
    black_shampoo_amount,
    super_black_assistant_id,
    super_black_assistant_amount,
    super_black_amount,
    black_mask_assistant_id,
    black_mask_assistant_amount,
    black_mask_amount,
    customer_note,
    created_by,
    status,
    safeAppointmentDate,
    safeAppointmentTime,
    customer_id
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
      (s.service_timestamp AT TIME ZONE 'Africa/Kampala') AS service_time,
      CONCAT(b.first_name, ' ', b.last_name) AS barber,
      CONCAT(a.first_name, ' ', a.last_name) AS barber_assistant,
      CONCAT(sc.first_name, ' ', sc.last_name) AS scrubber_assistant,
      CONCAT(bs.first_name, ' ', bs.last_name) AS black_shampoo_assistant,
      CONCAT(sb.first_name, ' ', sb.last_name) AS super_black_assistant,
      CONCAT(bm.first_name, ' ', bm.last_name) AS black_mask_assistant
    FROM services s
    LEFT JOIN users b  ON s.barber_id = b.id
    LEFT JOIN users a  ON s.barber_assistant_id = a.id
    LEFT JOIN users sc ON s.scrubber_assistant_id = sc.id
    LEFT JOIN users bs ON s.black_shampoo_assistant_id = bs.id
    LEFT JOIN users sb ON s.super_black_assistant_id = sb.id
    LEFT JOIN users bm ON s.black_mask_assistant_id = bm.id
    ORDER BY s.id DESC;
  `;
  const result = await db.query(query);
  return result.rows;
};

/**
 * Fetch one service by ID
 */
export const fetchServiceById = async (id) => {
  const query = `
    SELECT 
      s.*,
      (s.service_timestamp AT TIME ZONE 'Africa/Kampala') AS service_time,
      CONCAT(b.first_name, ' ', b.last_name) AS barber,
      CONCAT(a.first_name, ' ', a.last_name) AS barber_assistant,
      CONCAT(sc.first_name, ' ', sc.last_name) AS scrubber_assistant,
      CONCAT(bs.first_name, ' ', bs.last_name) AS black_shampoo_assistant,
      CONCAT(sb.first_name, ' ', sb.last_name) AS super_black_assistant,
      CONCAT(bm.first_name, ' ', bm.last_name) AS black_mask_assistant
    FROM services s
    LEFT JOIN users b  ON s.barber_id = b.id
    LEFT JOIN users a  ON s.barber_assistant_id = a.id
    LEFT JOIN users sc ON s.scrubber_assistant_id = sc.id
    LEFT JOIN users bs ON s.black_shampoo_assistant_id = bs.id
    LEFT JOIN users sb ON s.super_black_assistant_id = sb.id
    LEFT JOIN users bm ON s.black_mask_assistant_id = bm.id
    WHERE s.id = $1;
  `;
  const result = await db.query(query, [id]);
  return result.rows[0] || null;
};

/**
 * Update a service by ID
 */
export const UpdateServiceById = async ({
  id,
  name,
  service_amount,
  salon_amount,
  barber_id,
  barber_amount,
  barber_assistant_id,
  barber_assistant_amount,
  scrubber_assistant_id,
  scrubber_assistant_amount,
  black_shampoo_assistant_id,
  black_shampoo_assistant_amount,
  black_shampoo_amount,
  super_black_assistant_id,
  super_black_assistant_amount,
  super_black_amount,
  black_mask_assistant_id,
  black_mask_assistant_amount,
  black_mask_amount,
  customer_note,
  created_by,
  status,
  appointment_date,
  appointment_time,
  customer_id,
  service_timestamp
}) => {
  const query = `
    UPDATE services
    SET
      name = $1,
      service_amount = $2,
      salon_amount = $3,
      barber_id = $4,
      barber_amount = $5,
      barber_assistant_id = $6,
      barber_assistant_amount = $7,
      scrubber_assistant_id = $8,
      scrubber_assistant_amount = $9,
      black_shampoo_assistant_id = $10,
      black_shampoo_assistant_amount = $11,
      black_shampoo_amount = $12,
      super_black_assistant_id = $13,
      super_black_assistant_amount = $14,
      super_black_amount = $15,
      black_mask_assistant_id = $16,
      black_mask_assistant_amount = $17,
      black_mask_amount = $18,
      customer_note = $19,
      created_by = $20,
      status = $21,
      appointment_date =$22,
      appointment_time = $23,
      customer_id = $24,
      service_timestamp = $25
    WHERE id = $26
    RETURNING *;
  `;

  const values = [
    name,
    service_amount,
    salon_amount,
    barber_id,
    barber_amount,
    barber_assistant_id,
    barber_assistant_amount,
    scrubber_assistant_id,
    scrubber_assistant_amount,
    black_shampoo_assistant_id,
    black_shampoo_assistant_amount,
    black_shampoo_amount,
    super_black_assistant_id,
    super_black_assistant_amount,
    super_black_amount,
    black_mask_assistant_id,
    black_mask_assistant_amount,
    black_mask_amount,
    customer_note,
    created_by,
    status,
    appointment_date,
    appointment_time,
    customer_id,
    service_timestamp,
    id
  ];

  const result = await db.query(query, values);
  return result.rows[0] || null;
};




/**
 * Update a service by ID
 */
export const UpdateServiceByIdt = async ({
  id,
  name,
  service_amount,
  salon_amount,
  barber_id,
  barber_amount,
  barber_assistant_id,
  barber_assistant_amount,
  scrubber_assistant_id,
  scrubber_assistant_amount,
  black_shampoo_assistant_id,
  black_shampoo_assistant_amount,
  black_shampoo_amount,
  super_black_assistant_id,
  super_black_assistant_amount,
  super_black_amount,
  black_mask_assistant_id,
  black_mask_assistant_amount,
  black_mask_amount,
  customer_note,
  created_by,
  status,
  appointment_date,
  appointment_time,
  customer_id,
  service_timestamp
}) => {
  const query = `
    UPDATE services
    SET
      name = $1,
      service_amount = $2,
      salon_amount = $3,
      barber_id = $4,
      barber_amount = $5,
      barber_assistant_id = $6,
      barber_assistant_amount = $7,
      scrubber_assistant_id = $8,
      scrubber_assistant_amount = $9,
      black_shampoo_assistant_id = $10,
      black_shampoo_assistant_amount = $11,
      black_shampoo_amount = $12,
      super_black_assistant_id = $13,
      super_black_assistant_amount = $14,
      super_black_amount = $15,
      black_mask_assistant_id = $16,
      black_mask_assistant_amount = $17,
      black_mask_amount = $18,
      customer_note = $19,
      created_by = $20,
      status = $21,
      appointment_date =$22,
      appointment_time = $23,
      customer_id = $24,
      service_timestamp = NOW()
    WHERE id = $25
    RETURNING *;
  `;

  const values = [
    name,
    service_amount,
    salon_amount,
    barber_id,
    barber_amount,
    barber_assistant_id,
    barber_assistant_amount,
    scrubber_assistant_id,
    scrubber_assistant_amount,
    black_shampoo_assistant_id,
    black_shampoo_assistant_amount,
    black_shampoo_amount,
    super_black_assistant_id,
    super_black_assistant_amount,
    super_black_amount,
    black_mask_assistant_id,
    black_mask_assistant_amount,
    black_mask_amount,
    customer_note,
    created_by,
    status,
    appointment_date,
    appointment_time,
    customer_id,
    id
  ];

  const result = await db.query(query, values);
  return result.rows[0] || null;
};


/**
 * Delete a service by ID
 */
export const DeleteServiceById = async (id) => {
  const query = `DELETE FROM services WHERE id = $1 RETURNING id;`;
  const result = await db.query(query, [id]);
  return result.rowCount > 0;
};

export default {
  saveService,
  fetchAllServices,
  fetchServiceById,
  UpdateServiceById,
  DeleteServiceById,
  UpdateServiceByIdt
};
