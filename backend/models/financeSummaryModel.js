import db from "./database.js";

export const getStudentFinanceSummary = async (
  student_id,
  term_id = null
) => {

  console.log("\n====================================");
  console.log("🔥 STUDENT FINANCE SUMMARY START");
  console.log("====================================");

  console.log("👉 student_id:", student_id);
  console.log("👉 term_id:", term_id);

  // =====================================
  // 1. STUDENT
  // =====================================
  console.log("\n📘 FETCHING STUDENT...");

  const studentResult = await db.query(
    `
    SELECT
      s.id,
      s.class_id,
      c.name AS class_name

    FROM students s

    LEFT JOIN classes c
      ON c.id = s.class_id

    WHERE s.id = $1
    `,
    [student_id]
  );

  const student = studentResult.rows[0];

  console.log("✅ STUDENT RESULT:");
  console.log(student);

  if (!student) {
    console.log("❌ Student not found");
    throw new Error("Student not found");
  }

  // =====================================
  // 2. FINANCE TYPES
  // =====================================
  console.log("\n🏷️ FETCHING FINANCE TYPES...");

  const financeTypesQuery = `
    SELECT
      id,
      name

    FROM finance_types

    ORDER BY name ASC
  `;

  // console.log("\n📘 FINANCE TYPES QUERY:");
  // console.log(financeTypesQuery);

  const financeTypes = await db.query(financeTypesQuery);

  // console.log("\n✅ FINANCE TYPES FOUND:");
  // console.log(financeTypes.rows.length);

  // console.log("\n✅ FINANCE TYPES DATA:");
  // console.log(JSON.stringify(financeTypes.rows, null, 2));

  // =====================================
  // 3. STRUCTURES
  // =====================================
  // console.log("\n📦 FETCHING FINANCE STRUCTURES...");

  let structureQuery = `
    SELECT
      fs.id AS structure_id,

      fs.finance_type_id,
      ft.name AS finance_type_name,

      fs.term_id,
      t.name AS term_name,

      fs.amount AS expected_amount

    FROM finance_structures fs

    LEFT JOIN finance_types ft
      ON ft.id = fs.finance_type_id

    LEFT JOIN terms t
      ON t.id = fs.term_id

    WHERE fs.class_id = $1
    AND fs.is_active = true
  `;

  const structureValues = [student.class_id];

  if (term_id) {
    structureValues.push(term_id);

    structureQuery += `
      AND fs.term_id = $${structureValues.length}
    `;
  }

  structureQuery += `
    ORDER BY ft.name ASC
  `;

  // console.log("\n📘 STRUCTURE QUERY:");
  // console.log(structureQuery);

  // console.log("📘 STRUCTURE VALUES:");
  // console.log(structureValues);

  const structures = await db.query(
    structureQuery,
    structureValues
  );

  // console.log("\n✅ STRUCTURES FOUND:");
  // console.log(structures.rows.length);

  // console.log("\n✅ STRUCTURE DATA:");
  // console.log(JSON.stringify(structures.rows, null, 2));

  // // =====================================
  // // 4. PAYMENTS
  // // =====================================
  // console.log("\n💰 FETCHING PAYMENTS...");

  let paymentQuery = `
    SELECT
      f.id,

      f.finance_type_id,
      ft.name AS finance_type_name,

      f.term_id,
      t.name AS term_name,

      f.amount,
      f.payment_date,
      f.payment_method,
      f.receipt_url,
      f.status,
      f.notes

    FROM finances f

    LEFT JOIN finance_types ft
      ON ft.id = f.finance_type_id

    LEFT JOIN terms t
      ON t.id = f.term_id

    WHERE f.student_id = $1
  `;

  const paymentValues = [student_id];

  if (term_id) {
    paymentValues.push(term_id);

    paymentQuery += `
      AND f.term_id = $${paymentValues.length}
    `;
  }

  paymentQuery += `
    ORDER BY f.created_at DESC
  `;

  // console.log("\n📘 PAYMENT QUERY:");
  // console.log(paymentQuery);

  // console.log("📘 PAYMENT VALUES:");
  // console.log(paymentValues);

  const payments = await db.query(
    paymentQuery,
    paymentValues
  );

  // console.log("\n✅ PAYMENTS FOUND:");
  // console.log(payments.rows.length);

  // console.log("\n✅ PAYMENT DATA:");
  // console.log(JSON.stringify(payments.rows, null, 2));

  // =====================================
  // 5. FINAL RESPONSE
  // =====================================
  const response = {
    student: student || null,

    financeTypes: financeTypes.rows,

    structures: structures.rows,

    payments: payments.rows,
  };

  // console.log("\n====================================");
  // console.log("✅ FINAL RESPONSE");
  // console.log("====================================");

  // console.log(JSON.stringify(response, null, 2));

  // console.log("\n====================================");
  // console.log("🔥 END FINANCE SUMMARY");
  // console.log("====================================\n");

  return response;
};