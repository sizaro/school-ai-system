import db from './database.js';

// ===============================
// SERVICES
// ===============================
async function getServicesByDay(startOfDay, endOfDay) {
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
    WHERE s.service_timestamp BETWEEN $1 AND $2
    ORDER BY s.id DESC;
  `;
  const result = await db.query(query, [startOfDay, endOfDay]);
  return result.rows;
}

// ===============================
// EXPENSES
// ===============================
async function getExpensesByDay(startOfDay, endOfDay) {
  const result = await db.query(
    "SELECT * FROM expenses WHERE created_at BETWEEN $1 AND $2 ORDER BY id DESC",
    [startOfDay, endOfDay]
  );
  return result.rows;
}

// ===============================
// SALARY ADVANCES
// ===============================
async function getAdvancesByDay(startOfDay, endOfDay) {
  const query = `
    SELECT 
      a.*,
      CONCAT(u.first_name, '', u.last_name) AS employee_name
    FROM advances a
    LEFT JOIN users u ON a.employee_id = u.id
    WHERE a.created_at BETWEEN $1 AND $2
    ORDER BY a.id DESC;
  `;
  const result = await db.query(query, [startOfDay, endOfDay]);
  return result.rows;
}

// ===============================
// EMPLOYEE CLOCKINGS
// ===============================
async function getClockingsByDay(startOfDay, endOfDay) {
  const query = `
    SELECT 
      ec.*,
      CONCAT(u.first_name, '', u.last_name) AS employee_name
    FROM employee_clocking ec
    LEFT JOIN users u ON ec.employee_id = u.id
    WHERE ec.clock_in BETWEEN $1 AND $2
    ORDER BY ec.id DESC;
  `;
  const result = await db.query(query, [startOfDay, endOfDay]);
  return result.rows;
}


// ===============================
// TAG FEES
// ===============================
async function getTagFeesByDay(startOfDay, endOfDay) {
  const query = `
    SELECT tf.*, CONCAT(u.first_name, '', u.last_name) AS employee_name
    FROM tag_fee tf
    LEFT JOIN users u ON tf.employee_id = u.id
    WHERE tf.created_at BETWEEN $1 AND $2
    ORDER BY tf.id DESC;
  `;
  const result = await db.query(query, [startOfDay, endOfDay]);
  return result.rows;
}

// ===============================
// LATE FEES
// ===============================
async function getLateFeesByDay(startOfDay, endOfDay) {
  const query = `
    SELECT lf.*, CONCAT(u.first_name, '', u.last_name) AS employee_name
    FROM late_fee lf
    LEFT JOIN users u ON lf.employee_id = u.id
    WHERE lf.created_at BETWEEN $1 AND $2
    ORDER BY lf.id DESC;
  `;
  const result = await db.query(query, [startOfDay, endOfDay]);
  return result.rows;
}

// ===============================
// EMPLOYEES (Users with role employee/manager/owner)
// ===============================
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

// ===============================
// EXPORT ALL
// ===============================
export default {
  getServicesByDay,
  getExpensesByDay,
  getAdvancesByDay,
  getClockingsByDay,
  getTagFeesByDay,
  getLateFeesByDay,
  fetchAllEmployees
};
