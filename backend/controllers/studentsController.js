import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import {
  saveStudent,
  updateStudentById,
  fetchAllStudents,
  fetchStudentById,
} from "../models/studentsModel.js";

/**
 * REGISTER STUDENT
 */

export const registerStudent = async (req, res) => {
  try {
    const { student, guardian, medical, payment } = req.body;

    const creatorId = req.user?.id || 1;

    // hash password
    const hashedPassword = await bcrypt.hash("Temp1234!", 10);

    // handle photo
    const image_url = req.file
      ? `/uploads/images/${req.file.filename}`
      : null;

    const result = await saveStudent({
      student,
      guardian,
      medical,
      payment,
      hashedPassword,
      image_url,
      creatorId,
    });

    res.status(201).json(result);
  } catch (err) {
    console.error("Registration failed:", err);
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