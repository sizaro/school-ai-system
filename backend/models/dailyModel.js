import db from './database.js';

async function getServicesByDay(startOfDay, endOfDay) {
  const query = `
  SELECT 
  st.id AS transaction_id,
  st.service_definition_id,
  st.customer_id,
  st.customer_note,
  st.created_by,
  st.service_timestamp AT TIME ZONE 'Africa/Kampala' AS service_time,

  -- Service definition fields
  sd.service_name,
  sd.description,
  sd.service_amount,
  sd.salon_amount,
  sd.section_id AS definition_section_id,

  -- Section info
  sec.section_name,

  -- Performers array
  json_agg(
    DISTINCT jsonb_build_object(
      'role_name', sr.role_name,
      'role_amount', sr.earned_amount,
      'employee_id', u.id,
      'employee_name', u.first_name || ' ' || u.last_name
    )
  ) FILTER (WHERE sp.id IS NOT NULL) AS performers,

  -- Materials array (NEW)
  (
    SELECT json_agg(
      jsonb_build_object(
        'material_name', sm.material_name,
        'material_cost', sm.material_cost
      )
    )
    FROM service_materials sm
    WHERE sm.service_definition_id = sd.id
  ) AS materials

FROM service_transactions st
JOIN service_definitions sd 
  ON sd.id = st.service_definition_id
JOIN service_sections sec
  ON sec.id = sd.section_id

LEFT JOIN service_performers sp 
  ON sp.service_transaction_id = st.id
LEFT JOIN service_roles sr 
  ON sr.id = sp.service_role_id
LEFT JOIN users u 
  ON u.id = sp.employee_id

  WHERE 
        st.service_timestamp BETWEEN $1 AND $2
        AND (st.status IS NULL OR LOWER(st.status) = 'completed')

GROUP BY 
  st.id,
  sd.service_name,
  sd.description,
  sd.service_amount,
  sd.salon_amount,
  sd.section_id,
  sec.section_name,
  sd.id

ORDER BY st.service_timestamp DESC;

  `;

  const result = await db.query(query, [startOfDay, endOfDay]);

  console.log("services in the daily model", result.rows)
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
    FROM late_fees lf
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
