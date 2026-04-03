import express from "express";
import upload from "../middleware/upload.js";

const router = express.Router();

import {
  registerStudent,
  updateStudent,
  getStudents,
  getStudentById,
  deleteStudent,
  updateStudentInfo,
  updateGuardian,
  updateMedical,
  updateAdmission,
  updateStudentPhoto,
  removeStudentPhoto,
  updatePayment,
} from "../controllers/studentsController.js";

// ---------- REGISTER ----------
router.post(
  "/register",
  upload.single("student[photo]"),
  registerStudent
);

// ---------- STANDARD CRUD ----------
router.put("/:id", updateStudent);
router.get("/", getStudents);
router.get("/:id", getStudentById);
router.delete("/:id", deleteStudent);

// ---------- SECTION UPDATES ----------
router.put("/:id/info", updateStudentInfo);
router.put("/:id/guardian", updateGuardian);
router.put("/:id/medical", updateMedical);
router.put("/:id/admission", updateAdmission);
router.put("/:id/photo", upload.single("photo"), updateStudentPhoto);
router.delete("/:id/photo", removeStudentPhoto);
router.put("/:id/payment", updatePayment);

export default router;