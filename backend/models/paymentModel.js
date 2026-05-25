import db from "./database.js";

// ==============================
// CREATE PAYMENT
// ==============================
export const createPayment = async (data) => {
  const {
    student_id,
    amount,
    finance_type_id,
    payment_method,
    payment_date,
    recorded_by,
    term_id,
    receipt_url,
    notes,
    status,
  } = data;

  const result = await db.query(
    `
    INSERT INTO finances
    (
      student_id,
      amount,
      finance_type_id,
      payment_method,
      payment_date,
      recorded_by,
      term_id,
      receipt_url,
      notes,
      status
    )
    VALUES
    ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *
    `,
    [
      student_id,
      amount,
      finance_type_id,
      payment_method,
      payment_date,
      recorded_by,
      term_id,
      receipt_url || null,
      notes || null,
      status || "completed",
    ]
  );

  return result.rows[0];
};

// ==============================
// GET PAYMENT BY ID
// ==============================
export const getPaymentById = async (id) => {
  const result = await db.query(
    `
    SELECT
      f.*,
      ft.name AS finance_type_name,
      t.name AS term_name
    FROM finances f
    LEFT JOIN finance_types ft
      ON ft.id = f.finance_type_id
    LEFT JOIN terms t
      ON t.id = f.term_id
    WHERE f.id = $1
    `,
    [id]
  );

  return result.rows[0];
};

// ==============================
// GET STUDENT PAYMENTS
// FILTERS:
// term_id
// finance_type_id
// year
// ==============================
export const getStudentPayments = async (
  student_id,
  filters = {}
) => {
  const {
    term_id,
    finance_type_id,
    year,
  } = filters;

  let query = `
    SELECT
      f.*,
      ft.name AS finance_type_name,
      t.name AS term_name
    FROM finances f
    LEFT JOIN finance_types ft
      ON ft.id = f.finance_type_id
    LEFT JOIN terms t
      ON t.id = f.term_id
    WHERE f.student_id = $1
  `;

  const values = [student_id];

  // TERM FILTER
  if (term_id) {
    values.push(term_id);
    query += ` AND f.term_id = $${values.length}`;
  }

  // FINANCE TYPE FILTER
  if (finance_type_id) {
    values.push(finance_type_id);
    query += ` AND f.finance_type_id = $${values.length}`;
  }

  // YEAR FILTER
  if (year) {
    values.push(year);
    query += `
      AND EXTRACT(YEAR FROM f.payment_date) = $${values.length}
    `;
  }

  query += `
    ORDER BY f.payment_date DESC,
             f.created_at DESC
  `;

  const result = await db.query(query, values);

  return result.rows;
};

// ==============================
// UPDATE PAYMENT
// ==============================

export const updatePayment = async (
  id,
  data
) => {

  const {
    student_id,
    amount,
    finance_type_id,
    payment_method,
    payment_date,
    term_id,
    receipt_url,
    notes,
    status,
  } = data;

  const result = await db.query(
    `
    UPDATE finances
    SET
      student_id = $1,
      amount = $2,
      finance_type_id = $3,
      payment_method = $4,
      payment_date = $5,
      term_id = $6,
      receipt_url = COALESCE($7, receipt_url),
      notes = $8,
      status = $9

    WHERE id = $10

    RETURNING *
    `,
    [
      student_id,
      amount,
      finance_type_id,
      payment_method,
      payment_date,
      term_id,
      receipt_url || null,
      notes || null,
      status || "completed",
      id,
    ]
  );

  return result.rows[0];
};

// ==============================
// DELETE PAYMENT
// ==============================

export const deletePayment = async (
  paymentId,
  studentId
) => {

  const result = await db.query(
    `
    DELETE FROM finances
    WHERE id = $1
    AND student_id = $2
    RETURNING *
    `,
    [paymentId, studentId]
  );

  return result.rows[0];
};