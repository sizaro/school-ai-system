import db from "./database.js";

/**
 * FULL STUDENT REGISTRATION (TRANSACTION INSIDE MODEL)
 */
export const saveStudent = async (payload) => {
  try {
    console.log("==== Incoming Student Payload ====");
    console.log(JSON.stringify(payload, null, 2)); // pretty print the payload
    console.log("================================");
    await db.query("BEGIN");

    const {
      student,
      guardian,
      medical,
      payment,
      hashedPassword,
      image_url,
      creatorId,
    } = payload;

    // =========================
    // 1️⃣ Create default email
    // =========================
    let email = `${student.firstName}.${student.lastName}@medanfocs.com`
      .toLowerCase()
      .replace(/\s+/g, ""); // remove spaces

    // Optional: add timestamp to ensure uniqueness
    email = `${student.firstName}.${student.lastName}${Date.now()}@medanfocs.com`
      .toLowerCase()
      .replace(/\s+/g, "");

    // 2️⃣ Create user
    const userResult = await db.query(
      `INSERT INTO users (email, password, role, created_at)
       VALUES ($1,$2,$3,NOW())
       RETURNING id`,
      [email, hashedPassword, "student"]
    );

    const userId = userResult.rows[0].id;

    // 3️⃣ Student
    const studentResult = await db.query(
      `INSERT INTO students
       (user_id, first_name, last_name, gender, date_of_birth, photo_url, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING id`,
      [
        userId,
        student.firstName,
        student.lastName,
        student.gender,
        student.dateOfBirth,
        image_url,
        creatorId,
      ]
    );

    const studentId = studentResult.rows[0].id;

    // 4️⃣ Guardian
    const guardianResult = await db.query(
      `INSERT INTO guardians
       (first_name, last_name, phone, created_by)
       VALUES ($1,$2,$3,$4)
       RETURNING id`,
      [guardian.firstName, guardian.lastName, guardian.phone, creatorId]
    );

    const guardianId = guardianResult.rows[0].id;

    // 5️⃣ Link student to guardian
    await db.query(
      `INSERT INTO student_guardians
       (student_id, guardian_id, relationship, is_primary, created_by)
       VALUES ($1,$2,$3,$4,$5)`,
      [studentId, guardianId, guardian.relationshipToStudent, true, creatorId]
    );

    // 6️⃣ Medical
    await db.query(
      `INSERT INTO medical
       (user_id, blood_group, medical_conditions, allergies, created_by)
       VALUES ($1,$2,$3,$4,$5)`,
      [
        userId,
        medical.bloodGroup,
        medical.medicalConditions,
        medical.allergies,
        creatorId,
      ]
    );

    // 7️⃣ Admission
    await db.query(
      `INSERT INTO admissions
       (student_id, class_level, stream, admission_date, registration_fee, receipt_number, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        studentId,
        student.classLevel,
        student.stream,
        student.admissionDate,
        payment.registrationFee,
        payment.receiptNumber,
        creatorId,
      ]
    );

    // 8️⃣ Payment
    await db.query(
      `INSERT INTO payments
       (student_id, amount, receipt_number, payment_date, recorded_by)
       VALUES ($1,$2,$3,$4,$5)`,
      [
        studentId,
        payment.registrationFee,
        payment.receiptNumber,
        payment.paymentDate,
        creatorId,
      ]
    );

    await db.query("COMMIT");

    return { success: true, studentId };
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error creating student:", error);
    throw error;
  }
};

/**
 * UPDATE STUDENT
 */
export const updateStudentById = async (id, data) => {
  const query = `
    UPDATE students SET
      first_name = $1,
      last_name = $2,
      gender = $3,
      date_of_birth = $4,
      created_by = $5
    WHERE id = $6
    RETURNING *;
  `;

  const values = [
    data.firstName,
    data.lastName,
    data.gender,
    data.dateOfBirth,
    data.createdBy,
    id,
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};

/**
 * FETCH ALL STUDENTS
 */
export const fetchAllStudents = async () => {

  const query = `
    SELECT 
      -- STUDENT
      s.id AS student_id,
      s.first_name,
      s.last_name,
      s.gender,
      s.date_of_birth,
      s.photo_url,
      s.created_at,

      -- USER
      u.email,

      -- MEDICAL
      m.blood_group,
      m.medical_conditions,
      m.allergies,

      -- GUARDIAN
      g.id AS guardian_id,
      g.first_name AS guardian_first_name,
      g.last_name AS guardian_last_name,
      g.phone AS guardian_phone,

      sg.relationship,
      sg.is_primary,

      -- ADMISSION
      a.class_level,
      a.stream,
      a.admission_date,
      a.registration_fee,
      a.receipt_number,

      -- PAYMENT
      p.amount AS payment_amount,
      p.receipt_number AS payment_receipt,
      p.payment_date

    FROM students s

    LEFT JOIN users u
      ON s.user_id = u.id

    LEFT JOIN medical m
      ON m.user_id = u.id

    LEFT JOIN student_guardians sg
      ON sg.student_id = s.id

    LEFT JOIN guardians g
      ON g.id = sg.guardian_id

    LEFT JOIN admissions a
      ON a.student_id = s.id

    LEFT JOIN payments p
      ON p.student_id = s.id

    ORDER BY s.id DESC;
  `;

  const result = await db.query(query);

  console.log("Students with full details:", result.rows);

  return result.rows;
};

/**
 * FETCH STUDENT BY ID
 */

export const fetchStudentById = async (id) => {
  const query = `
    SELECT 
      -- STUDENT
      s.id AS student_id,
      s.first_name,
      s.last_name,
      s.gender,
      s.date_of_birth,
      s.photo_url,
      s.created_at,

      -- USER
      u.email,

      -- MEDICAL
      m.blood_group,
      m.medical_conditions,
      m.allergies,

      -- GUARDIAN (only primary)
      g.first_name AS guardian_first_name,
      g.last_name AS guardian_last_name,
      g.phone AS guardian_phone,

      -- ADMISSION
      a.class_level,
      a.stream,
      a.admission_date,

      -- LATEST PAYMENT
      p.amount,
      p.payment_date

    FROM students s

    -- USER linked via user_id
    LEFT JOIN users u ON s.user_id = u.id

    -- MEDICAL linked via user_id from students table
    LEFT JOIN medical m ON m.user_id = s.user_id

    -- STUDENT GUARDIAN
    LEFT JOIN student_guardians sg ON sg.student_id = s.id AND sg.is_primary = true
    LEFT JOIN guardians g ON g.id = sg.guardian_id

    -- ADMISSION
    LEFT JOIN admissions a ON a.student_id = s.id

    -- LATEST PAYMENT (if any)
    LEFT JOIN LATERAL (
      SELECT amount, payment_date
      FROM payments
      WHERE student_id = s.id
      ORDER BY payment_date DESC
      LIMIT 1
    ) p ON true

    WHERE s.id = $1;
  `;

  const result = await db.query(query, [id]);

  return result.rows[0];
};


/**
 * DELETE STUDENT (SAFE DELETE WITH RELATIONS)
 */
export const deleteStudentById = async (id) => {
  try {
    await db.query("BEGIN");

    // delete dependent records first (VERY IMPORTANT)
    await db.query("DELETE FROM payments WHERE student_id = $1", [id]);
    await db.query("DELETE FROM admissions WHERE student_id = $1", [id]);

    await db.query(
      "DELETE FROM student_guardians WHERE student_id = $1",
      [id]
    );

    await db.query(
      "DELETE FROM medical WHERE user_id = (SELECT user_id FROM students WHERE id = $1)",
      [id]
    );

    // finally delete student
    await db.query("DELETE FROM students WHERE id = $1", [id]);

    await db.query("COMMIT");

    return { success: true };
  } catch (err) {
    await db.query("ROLLBACK");
    throw err;
  }
};


// ===============================
// UPDATE GUARDIAN BY STUDENT ID
// ===============================
export const updateGuardianByStudentId = async (studentId, data) => {
  const query = `
    UPDATE guardians SET
      first_name = $1,
      last_name = $2,
      phone = $3
    WHERE id = (
      SELECT guardian_id
      FROM student_guardians
      WHERE student_id = $4 AND is_primary = true
      LIMIT 1
    )
    RETURNING *;
  `;

  const values = [
    data.firstName,
    data.lastName,
    data.phone,
    studentId,
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};

// ===============================
// UPDATE MEDICAL BY STUDENT ID
// ===============================
export const updateMedicalByStudentId = async (studentId, data) => {
  const query = `
    UPDATE medical SET
      blood_group = $1,
      medical_conditions = $2,
      allergies = $3
    WHERE user_id = (
      SELECT user_id FROM students WHERE id = $4
    )
    RETURNING *;
  `;

  const values = [
    data.bloodGroup,
    data.medicalConditions,
    data.allergies,
    studentId,
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};

// ===============================
// UPDATE ADMISSION BY STUDENT ID
// ===============================
export const updateAdmissionByStudentId = async (studentId, data) => {
  const query = `
    UPDATE admissions SET
      class_level = $1,
      stream = $2,
      admission_date = $3,
      registration_fee = $4
    WHERE student_id = $5
    RETURNING *;
  `;

  const values = [
    data.classLevel,
    data.stream,
    data.admissionDate,
    data.registrationFee,
    studentId,
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};

export const updateStudentPhotoModel = async (id, image_url) => {
  const result = await db.query(
    `
    UPDATE students
    SET image_url = $1
    WHERE student_id = $2
    RETURNING *
    `,
    [image_url, id]
  );

  return result.rows[0];
};

export const getStudentByIdModel = async (id) => {
  const result = await db.query(
    "SELECT * FROM students WHERE student_id = $1",
    [id]
  );

  return result.rows[0];
};