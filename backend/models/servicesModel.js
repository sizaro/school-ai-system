import db from '../models/database.js';

/**
 * Save a new service (or appointment)
 */
export const saveService = async (service) => {
  const {
    name,
    section,
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
    women_employee_id,
    women_employee_amount,
    nail_employee_id,
    nail_employee_amount,
    customer_note,
    created_by,
    status,
    appointment_date,
    appointment_time,
    customer_id
  } = service;

  const safeAppointmentDate = appointment_date === "" ? null : appointment_date;
  const safeAppointmentTime = appointment_time === "" ? null : appointment_time;

  const query = `
    INSERT INTO services (
      name,
      section,
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
      women_emp_id,
      women_emp_amt,
      nail_emp_id,
      nail_emp_amt,
      customer_note,
      created_by,
      status,
      appointment_date,
      appointment_time,
      customer_id,
      service_timestamp
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9,
      $10, $11, $12, $13, $14, $15, $16, $17,
      $18, $19, $20, $21, $22, $23, $24,
      $25, $26, $27, $28, $29, NOW()
    )
    RETURNING *;
  `;

  const values = [
    name,
    section,
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
    women_employee_id,
    women_employee_amount,
    nail_employee_id,
    nail_employee_amount,
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
      CONCAT(bm.first_name, ' ', bm.last_name) AS black_mask_assistant,
      CONCAT(w.first_name, ' ', w.last_name) AS women_emp,
      CONCAT(n.first_name, ' ', n.last_name) AS nail_emp
    FROM services s
    LEFT JOIN users b  ON s.barber_id = b.id
    LEFT JOIN users a  ON s.barber_assistant_id = a.id
    LEFT JOIN users sc ON s.scrubber_assistant_id = sc.id
    LEFT JOIN users bs ON s.black_shampoo_assistant_id = bs.id
    LEFT JOIN users sb ON s.super_black_assistant_id = sb.id
    LEFT JOIN users bm ON s.black_mask_assistant_id = bm.id
    LEFT JOIN users w  ON s.women_emp_id = w.id
    LEFT JOIN users n  ON s.nail_emp_id = n.id
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
      CONCAT(bm.first_name, ' ', bm.last_name) AS black_mask_assistant,
      CONCAT(w.first_name, ' ', w.last_name) AS women_emp,
      CONCAT(n.first_name, ' ', n.last_name) AS nail_emp
    FROM services s
    LEFT JOIN users b  ON s.barber_id = b.id
    LEFT JOIN users a  ON s.barber_assistant_id = a.id
    LEFT JOIN users sc ON s.scrubber_assistant_id = sc.id
    LEFT JOIN users bs ON s.black_shampoo_assistant_id = bs.id
    LEFT JOIN users sb ON s.super_black_assistant_id = sb.id
    LEFT JOIN users bm ON s.black_mask_assistant_id = bm.id
    LEFT JOIN users w  ON s.women_emp_id = w.id
    LEFT JOIN users n  ON s.nail_emp_id = n.id
    WHERE s.id = $1;
  `;
  const result = await db.query(query, [id]);
  return result.rows[0] || null;
};


/**
 * Update a service by ID
 */
export const UpdateServiceById = async (service) => {
  const {
    id,
    name,
    section,
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
    women_employee_id,
    women_employee_amount,
    nail_employee_id,
    nail_employee_amount,
    customer_note,
    created_by,
    status,
    appointment_date,
    appointment_time,
    customer_id,
    service_timestamp
  } = service;

  const query = `
    UPDATE services
    SET
      name = $1,
      section = $2,
      service_amount = $3,
      salon_amount = $4,
      barber_id = $5,
      barber_amount = $6,
      barber_assistant_id = $7,
      barber_assistant_amount = $8,
      scrubber_assistant_id = $9,
      scrubber_assistant_amount = $10,
      black_shampoo_assistant_id = $11,
      black_shampoo_assistant_amount = $12,
      black_shampoo_amount = $13,
      super_black_assistant_id = $14,
      super_black_assistant_amount = $15,
      super_black_amount = $16,
      black_mask_assistant_id = $17,
      black_mask_assistant_amount = $18,
      black_mask_amount = $19,
      women_emp_id = $20,
      women_emp_amt = $21,
      nail_emp_id = $22,
      nail_emp_amt = $23,
      customer_note = $24,
      created_by = $25,
      status = $26,
      appointment_date = $27,
      appointment_time = $28,
      customer_id = $29,
      service_timestamp = $30
    WHERE id = $31
    RETURNING *;
  `;

  const values = [
    name, section, service_amount, salon_amount, barber_id, barber_amount,
    barber_assistant_id, barber_assistant_amount, scrubber_assistant_id,
    scrubber_assistant_amount, black_shampoo_assistant_id,
    black_shampoo_assistant_amount, black_shampoo_amount,
    super_black_assistant_id, super_black_assistant_amount, super_black_amount,
    black_mask_assistant_id, black_mask_assistant_amount, black_mask_amount,
    women_employee_id, women_employee_amount, nail_employee_id, nail_employee_amount,
    customer_note, created_by, status, appointment_date, appointment_time,
    customer_id, service_timestamp, id
  ];

  const result = await db.query(query, values);
  return result.rows[0] || null;
};


/**
 * Update service timestamp only (quick update)
 */
export const UpdateServiceByIdt = async (service) => {
  const {
    id,
    name,
    section,
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
    women_employee_id,
    women_employee_amount,
    nail_employee_id,
    nail_employee_amount,
    customer_note,
    created_by,
    status,
    appointment_date,
    appointment_time,
    customer_id
  } = service;

  const query = `
    UPDATE services
    SET
      name = $1,
      section = $2,
      service_amount = $3,
      salon_amount = $4,
      barber_id = $5,
      barber_amount = $6,
      barber_assistant_id = $7,
      barber_assistant_amount = $8,
      scrubber_assistant_id = $9,
      scrubber_assistant_amount = $10,
      black_shampoo_assistant_id = $11,
      black_shampoo_assistant_amount = $12,
      black_shampoo_amount = $13,
      super_black_assistant_id = $14,
      super_black_assistant_amount = $15,
      super_black_amount = $16,
      black_mask_assistant_id = $17,
      black_mask_assistant_amount = $18,
      black_mask_amount = $19,
      women_emp_id = $20,
      women_emp_amt = $21,
      nail_emp_id = $22,
      nail_emp_amt = $23,
      customer_note = $24,
      created_by = $25,
      status = $26,
      appointment_date = $27,
      appointment_time = $28,
      customer_id = $29,
      service_timestamp = NOW()
    WHERE id = $30
    RETURNING *;
  `;

  const values = [
    name, section, service_amount, salon_amount, barber_id, barber_amount,
    barber_assistant_id, barber_assistant_amount, scrubber_assistant_id,
    scrubber_assistant_amount, black_shampoo_assistant_id,
    black_shampoo_assistant_amount, black_shampoo_amount,
    super_black_assistant_id, super_black_assistant_amount, super_black_amount,
    black_mask_assistant_id, black_mask_assistant_amount, black_mask_amount,
    women_employee_id, women_employee_amount, nail_employee_id, nail_employee_amount,
    customer_note, created_by, status, appointment_date, appointment_time,
    customer_id, id
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
