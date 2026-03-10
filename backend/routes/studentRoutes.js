import express from "express";
import upload from "../middleware/upload.js";

const router = express.Router();

import {
  registerStudent,
  updateStudent,
  getStudents,
  getStudentById,
} from "../controllers/studentsController.js";

router.post(
  "/register",
  upload.single("student[photo]"),
  registerStudent
);

router.put("/:id", updateStudent);
router.get("/", getStudents);
router.get("/:id", getStudentById);

export default router;