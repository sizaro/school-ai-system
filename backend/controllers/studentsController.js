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
  deleteTuitionPaymentByStudentId,
  getPaymentById,
} from "../models/studentsModel.js";

/**
 * REGISTER STUDENT
 */

export const registerStudent = async (req, res) => {
  try {
    const { student, guardian, medical, payment } = req.body;

    // 1️⃣ CreatorId for fallback if needed
    const creatorId = req.user?.id || 1;

    // 2️⃣ Hash temporary password
    const hashedPassword = await bcrypt.hash("Temp1234!", 10);

    // 3️⃣ Handle uploaded photo
    const image_url = req.file
      ? `/uploads/images/${req.file.filename}`
      : null;

    // 4️⃣ Make sure recorded_by comes from frontend payment object
    const paymentData = {
      ...payment,
      recorded_by: payment.recorded_by || creatorId, // important!
    };

    // 5️⃣ Save all student data
    const result = await saveStudent({
      student,
      guardian,
      medical,
      payment: paymentData,
      hashedPassword,
      image_url,
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
      term_id,
      type,
      payment_method,
      payment_date,
      recorded_by,
    } = req.body;

    console.log("term is :", term_id)

    if (!recorded_by) {
      return res.status(400).json({ error: "recorded_by is required" });
    }

    let receipt_url = null;
    if (req.file) {
      receipt_url = `/uploads/receipts/${req.file.filename}`;
    }

    const newPayment = await addPaymentByStudentId(studentId, {
      amount,
      term_id,
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

    console.log("📥 UPDATE TUITION REQUEST");
    console.log("Params studentId:", studentId);
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const { id, student_id, recorded_by, amount, payment_method, payment_date, term_id } = req.body;

    if (!id) {
      console.warn("❌ Missing payment ID");
      return res.status(400).json({ error: "Payment ID is required" });
    }

    const paymentId = parseInt(id)
    const AmountValue = parseFloat(amount)
    // ✅ 1. Get specific payment
    const existingPayment = await getPaymentById(id);

    console.log("📄 Existing payment:", existingPayment);

    if (!existingPayment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    let receipt_url = existingPayment.receipt_url;

    // ✅ 2. Replace receipt if new uploaded
    if (req.file?.filename) {
      console.log("📎 New receipt uploaded:", req.file.filename);

      if (existingPayment.receipt_url) {
        const oldPath = path.join(process.cwd(), existingPayment.receipt_url);
        console.log("🗑 Deleting old receipt:", oldPath);

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      receipt_url = `/uploads/receipts/${req.file.filename}`;
    }

    console.log("📝 Updating with:", {
      id,
      studentId,
      recorded_by,
      amount,
      payment_method,
      payment_date,
      receipt_url,
      term_id,
    });

    // ✅ 3. Update DB (IMPORTANT: use payment ID, not studentId)
    const updatedPayment = await updateTuitionPaymentByStudentId({
      id: paymentId,
      student_id:studentId,
      recorded_by,
      amount: AmountValue, 
      payment_method,
      payment_date,
      receipt_url,
      term_id,
    });

    console.log("✅ Updated payment result:", updatedPayment);

    res.json(updatedPayment);
  } catch (err) {
    console.error("❌ Update tuition payment error:", err);
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