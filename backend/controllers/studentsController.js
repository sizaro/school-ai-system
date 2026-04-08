import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import {
  saveStudent,
  updateStudentById,
  fetchAllStudents,
  fetchStudentById,
  deleteStudentById,
  updateGuardianByStudentId,
  updateMedicalByStudentId,
  updateAdmissionByStudentId,
  updateStudentPhotoModel,
  getStudentByIdModel,
  updatePaymentByStudentId,
  addPaymentByStudentId,
  updateTuitionPaymentByStudentId,
  deleteTuitionPaymentByStudentId
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


export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteStudentById(id);

    res.json({ success: true, message: "Student deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
};



// ===============================
// UPDATE GUARDIAN
// ===============================
export const updateGuardian = async (req, res) => {
  try {
    const { id } = req.params;
    const { guardian } = req.body;
        console.log("guardian into the controller", guardian)

    const updated = await updateGuardianByStudentId(id, guardian);

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Guardian update error:", err);
    res.status(500).json({ error: "Guardian update failed" });
  }
};

// ===============================
// UPDATE MEDICAL
// ===============================
export const updateMedical = async (req, res) => {
  try {
    const { id } = req.params;
    const { medical } = req.body;

    const updated = await updateMedicalByStudentId(id, medical);

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Medical update error:", err);
    res.status(500).json({ error: "Medical update failed" });
  }
};

// ===============================
// UPDATE ADMISSION
// ===============================
export const updateAdmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { admission } = req.body;
console.log("admission into the controller", admission)
    const updated = await updateAdmissionByStudentId(id, admission);

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Admission update error:", err);
    res.status(500).json({ error: "Admission update failed" });
  }
};

export const updateStudentPhoto = async (req, res) => {
  try {
    const { id } = req.params;

    const existingStudent = await getStudentByIdModel(id);
    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    let image_url = existingStudent.image_url;

    // ✅ If new file uploaded
    if (req.file?.filename) {
      // delete old image if exists
      if (existingStudent.image_url) {
        const oldPath = path.join(process.cwd(), existingStudent.image_url);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // save new path
      image_url = `/uploads/images/${req.file.filename}`;
    }

    const updatedStudent = await updateStudentPhotoModel(id, image_url);

    res.json(updatedStudent);
  } catch (err) {
    console.error("Error updating student photo:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeStudentPhoto = async (req, res) => {
  try {
    const { id } = req.params;

    const existingStudent = await getStudentByIdModel(id);
    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    // delete file if exists
    if (existingStudent.image_url) {
      const oldPath = path.join(process.cwd(), existingStudent.image_url);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const updatedStudent = await updateStudentPhotoModel(id, null);

    res.json(updatedStudent);
  } catch (err) {
    console.error("Error removing student photo:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateStudentInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { student } = req.body;

    const updated = await updateStudentById(id, {
      firstName: student.firstName,
      lastName: student.lastName,
      gender: student.gender,
      dateOfBirth: student.dateOfBirth,
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Student info update error:", err);
    res.status(500).json({ error: "Student info update failed" });
  }
};


export const updatePayment = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { payment } = req.body

    console.log("payment inside controller", payment)

    const updatedPayment = await updatePaymentByStudentId(studentId, payment);
    res.json(updatedPayment);
  } catch (err) {
    console.error("Payment update error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// ADD PAYMENT (GENERAL)
// ===============================
export const addPayment = async (req, res) => {
  try {
    const studentId = req.params.id;
    const {
      amount,
      type,
      payment_method,
      payment_date,
      recorded_by,
    } = req.body;

    if (!recorded_by) {
      return res.status(400).json({ error: "recorded_by is required" });
    }

    let receipt_url = null;
    if (req.file) {
      receipt_url = `/uploads/receipts/${req.file.filename}`;
    }

    const newPayment = await addPaymentByStudentId(studentId, {
      amount,
      type,
      payment_method,
      payment_date,
      receipt_url,
      recorded_by,
    });

    res.json(newPayment);
  } catch (err) {
    console.error("Add payment error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// UPDATE TUITION PAYMENT
// ===============================
export const updateTuitionPayment = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { amount, payment_method, payment_date } = req.body;

    // 1️⃣ Fetch existing tuition payment for this student
    const existingPayment = await getTuitionPaymentByStudentId(studentId);
    if (!existingPayment) {
      return res.status(404).json({ error: "Tuition payment not found" });
    }

    let receipt_url = existingPayment.receipt_url;

    // 2️⃣ If a new file uploaded, delete old and save new
    if (req.file?.filename) {
      if (existingPayment.receipt_url) {
        const oldPath = path.join(process.cwd(), existingPayment.receipt_url);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      receipt_url = `/uploads/receipts/${req.file.filename}`;
    }

    // 3️⃣ Update DB
    const updatedPayment = await updateTuitionPaymentById(existingPayment.id, {
      amount,
      payment_method,
      payment_date,
      receipt_url,
    });

    res.json(updatedPayment);
  } catch (err) {
    console.error("Update tuition payment error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// DELETE TUITION PAYMENT
// ===============================
export const deleteTuitionPayment = async (req, res) => {
  try {
    const studentId = req.params.id;
    const formData = req.body; // contains payment id to delete

    const deletedPayment = await deleteTuitionPaymentByStudentId(studentId, formData);

    res.json(deletedPayment);
  } catch (err) {
    console.error("Delete tuition payment error:", err);
    res.status(500).json({ error: err.message });
  }
};