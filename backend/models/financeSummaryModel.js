import db from './database.js'


export const getStudentFinanceSummary = async (student_id, term_id = null) => {
  console.log("\n==============================");
  console.log("🔥 RAW FINANCE DATA MODE");
  console.log("==============================\n");

  // -------------------------
  // 1. STUDENT
  // -------------------------
  const studentResult = await db.query(
    `
    SELECT
      s.id,
      s.class_id,
      c.name AS class_name
    FROM students s
    LEFT JOIN classes c ON c.id = s.class_id
    WHERE s.id = $1
    `,
    [student_id]
  );

  const student = studentResult.rows[0];

  // -------------------------
  // 2. STRUCTURES (NO CALC)
  // -------------------------
  let structureQuery = `
    SELECT
      fs.id AS structure_id,
      fs.finance_type_id,
      ft.name AS finance_type_name,
      fs.term_id,
      t.name AS term_name,
      fs.amount AS expected_amount
    FROM finance_structures fs
    LEFT JOIN finance_types ft ON ft.id = fs.finance_type_id
    LEFT JOIN terms t ON t.id = fs.term_id
    WHERE fs.class_id = $1
    AND fs.is_active = true
  `;

  const structureValues = [student.class_id];

  if (term_id) {
    structureValues.push(term_id);
    structureQuery += ` AND fs.term_id = $${structureValues.length}`;
  }

  const structures = await db.query(structureQuery, structureValues);

  // -------------------------
  // 3. PAYMENTS (RAW ONLY)
  // -------------------------
  let paymentQuery = `
    SELECT
      finance_type_id,
      term_id,
      amount
    FROM finances
    WHERE student_id = $1
  `;

  const paymentValues = [student_id];

  if (term_id) {
    paymentValues.push(term_id);
    paymentQuery += ` AND term_id = $${paymentValues.length}`;
  }

  const payments = await db.query(paymentQuery, paymentValues);

  // -------------------------
  // 4. RETURN RAW DATA ONLY
  // -------------------------
  const response = {
    student: student || null,
    structures: structures.rows,
    payments: payments.rows,
  };

  console.log("\n✅ RAW RESPONSE SENT:");
  console.log(JSON.stringify(response, null, 2));

  return response;
};