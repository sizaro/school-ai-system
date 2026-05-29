
import db from "./database.js";

/**
 * FULL STUDENT REGISTRATION (TRANSACTION INSIDE MODEL)
 */

// ===============================
// SAVE STUDENT (CREATE STUDENT WITH FINANCES)
// ===============================

export const saveStudent = async (payload) => {
  try {
    console.log("==== Incoming Student Payload ====");
    console.log(JSON.stringify(payload, null, 2));
    console.log("================================");

    await db.query("BEGIN");

    const { student, guardian, medical, payment, hashedPassword, image_url } = payload;

    // 1️⃣ Generate email
    let email = `${student.firstName}.${student.lastName}${Date.now()}@medanfocs.com`
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

    // 3️⃣ Insert student (UPDATED → class_id aligned)
    const studentResult = await db.query(
      `INSERT INTO students
       (user_id, first_name, last_name, gender, date_of_birth, photo_url, class_id, nationality, national_id_number, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING id`,
      [
        userId,
        student.firstName,
        student.lastName,
        student.gender,
        student.dateOfBirth,
        image_url,
        student.class_id || null,
        student.nationality || null,
        student.nationalIdNumber || null,
        payment.recorded_by,
      ]
    );

    const studentId = studentResult.rows[0].id;

    // 4️⃣ Insert guardian (FULL ALIGNMENT)
    const guardianResult = await db.query(
      `INSERT INTO guardians
       (first_name, last_name, phone, alternative_phone, email, occupation, gender, national_id_number, address, district, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING id`,
      [
        guardian.firstName,
        guardian.lastName,
        guardian.phone,
        guardian.alternativePhone || null,
        guardian.email || null,
        guardian.occupation || null,
        guardian.gender || null,
        guardian.nationalIdNumber || null,
        guardian.address || null,
        guardian.district || null,
        payment.recorded_by,
      ]
    );

    const guardianId = guardianResult.rows[0].id;

    // 5️⃣ Link student & guardian
    await db.query(
      `INSERT INTO student_guardians
       (student_id, guardian_id, relationship, is_primary, created_by)
       VALUES ($1,$2,$3,$4,$5)`,
      [
        studentId,
        guardianId,
        guardian.relationshipToStudent,
        true,
        payment.recorded_by,
      ]
    );

    // 6️⃣ Medical (FIXED → student_id instead of user_id)
    await db.query(
      `INSERT INTO medical
       (student_id, blood_group, medical_conditions, allergies, created_by)
       VALUES ($1,$2,$3,$4,$5)`,
      [
        studentId,
        medical.bloodGroup,
        medical.medicalConditions,
        medical.allergies,
        payment.recorded_by,
      ]
    );

    // 7️⃣ Admission (FIXED → class_id)
    await db.query(
      `INSERT INTO admissions
       (student_id, class_id, stream, admission_date, registration_fee, receipt_number, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        studentId,
        student.class_id || null,
        student.stream || null,
        student.admissionDate,
        payment.amount,
        payment.receiptNumber,
        payment.recorded_by,
      ]
    );

    // 8️⃣ Finance (clean + consistent)
    await db.query(
      `INSERT INTO finances
       (student_id, type, amount, payment_date, recorded_by, receipt_number, receipt_url, payment_method, status, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        studentId,
        payment.finance_type_id,
        payment.amount,
        payment.payment_date,
        payment.recorded_by,
        payment.receiptNumber || null,
        payment.receipt_url || null,
        payment.payment_method || null,
        payment.status || null,
        payment.notes || null,
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


// ===============================
// FETCH ALL STUDENTS (with finances)
// ===============================
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

      -- FINANCES aggregated as JSON array
      COALESCE(f.finances, '[]') AS finances

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

    -- FINANCES aggregated
    LEFT JOIN LATERAL (
      SELECT json_agg(
               json_build_object(
                 'id', id,
                 'type', type,
                 'amount', amount,
                 'payment_date', payment_date,
                 'recorded_by', recorded_by,
                 'receipt_number', receipt_number,
                 'receipt_url', receipt_url,
                 'payment_method', payment_method,
                 'status', status,
                 'notes', notes
               )
             ) AS finances
      FROM finances
      WHERE student_id = s.id
    ) f ON true

    ORDER BY s.id DESC;
  `;

  const result = await db.query(query);
  return result.rows;
};

// ===============================
// FETCH STUDENT BY ID (with finances)
// ===============================


export const fetchStudentById = async (id) => {
  try {
    console.log("\n📌 FETCH STUDENT BY ID CALLED");
    console.log("Student ID:", id);
    console.log("====================================");

    const query = `
      SELECT 
        -- ================= STUDENT =================
        s.id AS student_id,
        s.first_name,
        s.last_name,
        s.gender,
        s.date_of_birth,
        s.photo_url,
        s.created_at,
        s.nationality,

        -- ================= USER =================
        u.email,

        -- ================= MEDICAL =================
        m.blood_group,
        m.medical_conditions,
        m.allergies,
        m.notes AS medical_notes,

        -- ================= GUARDIAN =================
        g.first_name AS guardian_first_name,
        g.last_name AS guardian_last_name,
        g.phone AS guardian_phone,
        g.email AS guardian_email,
        g.address AS guardian_address,
        sg.relationship,

        -- ================= ADMISSION =================
        a.admission_number,
        a.stream,
        a.admission_date,
        c.name AS class_name

      FROM students s

      LEFT JOIN users u 
        ON s.user_id = u.id

      -- MEDICAL FIX (student-based join, safer than user_id)
      LEFT JOIN medical m 
        ON m.student_id = s.id

      LEFT JOIN student_guardians sg 
        ON sg.student_id = s.id 
        AND sg.is_primary = true

      LEFT JOIN guardians g 
        ON g.id = sg.guardian_id

      LEFT JOIN admissions a 
        ON a.student_id = s.id

      -- CLASS FIX (this was missing)
      LEFT JOIN classes c 
        ON c.id = a.class_id

      WHERE s.id = $1
    `;

    const result = await db.query(query, [id]);

    console.log("====================================");
    console.log("📊 QUERY SUCCESS");
    console.log("Rows returned:", result.rows.length);
    console.log("====================================");

    const student = result.rows[0] || null;

    console.log("Student fetched:", student);
    console.log("====================================\n");

    return student;

  } catch (error) {
    console.log("====================================");
    console.log("❌ FETCH STUDENT ERROR");
    console.log("Message:", error.message);
    console.log("Code:", error.code);
    console.log("Column:", error.column);
    console.log("Routine:", error.routine);
    console.log("====================================");

    console.log("FULL ERROR OBJECT:");
    console.log(error);

    throw error;
  }
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
      first_name = COALESCE($1, first_name),
      last_name = COALESCE($2, last_name),
      phone = COALESCE($3, phone),
      alternative_phone = COALESCE($4, alternative_phone),
      email = COALESCE($5, email),
      occupation = COALESCE($6, occupation),
      address = COALESCE($7, address),
      district = COALESCE($8, district),
      gender = COALESCE($9, gender),
      national_id_number = COALESCE($10, national_id_number)
    WHERE id = (
      SELECT guardian_id
      FROM student_guardians
      WHERE student_id = $11 AND is_primary = true
      LIMIT 1
    )
    RETURNING *;
  `;

  const values = [
    data.first_name,
    data.last_name,
    data.phone,
    data.alternative_phone,
    data.email,
    data.occupation,
    data.address,
    data.district,
    data.gender,
    data.national_id_number,
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
    UPDATE medical
    SET
      blood_group = $1,
      medical_conditions = $2,
      allergies = $3,
      notes = $4
    WHERE student_id = $5
    RETURNING *;
  `;

  const values = [
    data.blood_group,
    data.medical_conditions,
    data.allergies,
    data.notes,
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
    WHERE student_id = $4
    RETURNING *;
  `;

  const values = [
    data.classLevel,
    data.stream,
    data.admissionDate,
    studentId,
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};

export const updateStudentPhotoModel = async (id, image_url) => {
  const result = await db.query(
    `
    UPDATE students
    SET photo_url = $1
    WHERE id = $2
    RETURNING *
    `,
    [image_url, id]
  );

  return result.rows[0];
  
};

export const getStudentByIdModel = async (id) => {
  const result = await db.query(
    "SELECT * FROM students WHERE id = $1",
    [id]
  );

  return result.rows[0];
};

export const updatePaymentByStudentId = async (studentId, payment) => {
  const { amount, receiptNumber, paymentDate } = payment;

  const result = await db.query(
    `UPDATE payments
     SET amount = $1, receipt_number = $2, payment_date = $3
     WHERE student_id = $4
     RETURNING *`,
    [amount, receiptNumber, paymentDate, studentId]
  );

  return result.rows[0];
};


// ===============================
// ADD PAYMENT (GENERAL)
// ===============================


export const getPaymentById = async (paymentId) => {
  const result = await db.query(
    `SELECT * FROM finances WHERE id = $1`,
    [paymentId]
  );

  return result.rows[0];
};
export const addPaymentByStudentId = async (studentId, formData) => {
  try {
    const { type, term_id, amount, payment_date, recorded_by, receipt_number, receipt_url, payment_method, status, notes } = formData;

    const query = `
      INSERT INTO finances
        (student_id, type, amount, payment_date, recorded_by, receipt_number, receipt_url, payment_method, status, notes, term_id)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;
    const values = [
      studentId,
      type || "general",
      amount,
      payment_date,
      recorded_by,
      receipt_number || null,
      receipt_url || null,
      payment_method || null,
      status || null,
      notes || null,
      term_id || null
    ];

    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (err) {
    console.error("addPaymentByStudentId error:", err);
    throw err;
  }
};

// ===============================
// UPDATE TUITION PAYMENT
// ===============================
export const updateTuitionPaymentByStudentId = async (formData) => {
  try {
    const { id, student_id, type, amount, payment_date, recorded_by, receipt_number, receipt_url, payment_method, status, notes, term_id } = formData;
    console.log("inside data in the tution update model", id, amount,payment_date, payment_method, term_id, student_id)

    const query = `
      UPDATE finances
      SET
        type = $1,
        amount = $2,
        payment_date = $3,
        recorded_by = $4,
        receipt_number = $5,
        receipt_url = $6,
        payment_method = $7,
        status = $8,
        notes = $9
      WHERE id = $10 AND student_id = $11
      RETURNING *;
    `;
    const values = [
      type || "tuition",
      amount,
      payment_date,
      recorded_by,
      receipt_number || null,
      receipt_url || null,
      payment_method || null,
      status || null,
      notes || null,
      id,
      student_id,
    ];

    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (err) {
    console.error("updateTuitionPaymentByStudentId error:", err);
    throw err;
  }
};

// ===============================
// DELETE TUITION PAYMENT
// ===============================
export const deleteTuitionPaymentByStudentId = async (studentId, formData) => {
  try {
    const { id } = formData;

    const query = `
      DELETE FROM finances
      WHERE id = $1 AND student_id = $2
      RETURNING *;
    `;
    const values = [id, studentId];

    const { rows } = await db.query(query, values);
    return rows[0]; // deleted record
  } catch (err) {
    console.error("deleteTuitionPaymentByStudentId error:", err);
    throw err;
  }
};