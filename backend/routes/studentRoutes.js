import express from "express";
import upload from "../middleware/upload.js";

const router = express.Router();

import {
  registerStudent,
  updateStudent,
  getStudents,
  getStudentById,
  deleteStudent,

  updateGuardian,
  updateMedical,
  updateAdmission,

} from "../controllers/studentsController.js";

router.post(
  "/register",
  upload.single("student[photo]"),
  registerStudent
);

// EXISTING
router.put("/:id", updateStudent);
router.get("/", getStudents);
router.get("/:id", getStudentById);
router.delete("/:id", deleteStudent);

// ✅ NEW NESTED ROUTES
router.put("/:id/guardian", updateGuardian);
router.put("/:id/medical", updateMedical);
router.put("/:id/admission", updateAdmission);

export default router;