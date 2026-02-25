import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import {
  saveStudent,
  updateStudentById,
  fetchAllStudents,
  fetchStudentById,
} from "../models/studentModel.js";

/**
 * REGISTER STUDENT
 */
export const registerStudent = async (req, res) => {
  const client = req.app.locals.db; // or pool from db.js depending setup

  try {
    await client.query("BEGIN");

    const { student, guardian, medical, payment } = req.body;
    const creatorId = req.user?.id || 1;

    // 1. CREATE USER FOR FUTURE LOGIN
    const hashedPassword = await bcrypt.hash("Temp1234!", 10);

    const userResult = await client.query(
      `INSERT INTO users (email, password, role)
       VALUES ($1,$2,$3) RETURNING id`,
      [student.email || null, hashedPassword, "student"]
    );

    const userId = userResult.rows[0].id;

    // 2. STUDENT PROFILE
    const studentRecord = await saveStudent({
      user_id: userId,
      first_name: student.firstName,
      last_name: student.lastName,
      gender: student.gender,
      date_of_birth: student.dateOfBirth,
      created_by: creatorId,
    });

    const studentId = studentRecord.id;

    // 3. GUARDIAN
    const guardianResult = await client.query(
      `INSERT INTO guardians
        (first_name, last_name, phone, created_by)
       VALUES ($1,$2,$3,$4) RETURNING id`,
      [guardian.firstName, guardian.lastName, guardian.phone, creatorId]
    );

    const guardianId = guardianResult.rows[0].id;

    // 4. LINK STUDENT-GUARDIAN
    await client.query(
      `INSERT INTO student_guardians
        (student_id, guardian_id, relationship, is_primary, created_by)
       VALUES ($1,$2,$3,$4,$5)`,
      [studentId, guardianId, guardian.relationshipToStudent, true, creatorId]
    );

    // 5. MEDICAL
    await client.query(
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

    // 6. ADMISSION
    await client.query(
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

    // 7. PAYMENT
    await client.query(
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

    // 8. PHOTO
    if (req.file) {
      const photoUrl = `/uploads/images/${req.file.filename}`;
      await client.query(
        `UPDATE students SET photo_url = $1 WHERE id = $2`,
        [photoUrl, studentId]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({ success: true, studentId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
};

/**
 * UPDATE STUDENT
 */
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { student } = req.body;
    const creatorId = req.user?.id || 1;

    const updated = await updateStudentById(id, {
      firstName: student.firstName,
      lastName: student.lastName,
      gender: student.gender,
      dateOfBirth: student.dateOfBirth,
      createdBy: creatorId,
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
};

/**
 * GET ALL STUDENTS
 */
export const getStudents = async (req, res) => {
  try {
    const rows = await fetchAllStudents();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

/**
 * GET ONE STUDENT
 */
export const getStudentById = async (req, res) => {
  try {
    const row = await fetchStudentById(req.params.id);
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
};