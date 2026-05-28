import express from "express";
import upload from "../middleware/upload.js";

import {
  addPerformance,
  fetchAllPerformance,
  fetchStudentPerformance,
  editPerformance,
  removePerformance,
} from "../controllers/studentPerformanceController.js";

const router = express.Router();

/**
 * =========================
 * CREATE PERFORMANCE
 * =========================
 */

router.post("/", upload.single("file"), addPerformance);
/**
 * =========================
 * GET ALL PERFORMANCE
 * =========================
 */
router.get("/", fetchAllPerformance);

/**
 * =========================
 * GET PERFORMANCE BY STUDENT
 * =========================
 */
router.get("/student/:student_id", fetchStudentPerformance);

/**
 * =========================
 * UPDATE PERFORMANCE
 * =========================
 */
router.put("/:id", editPerformance);

/**
 * =========================
 * DELETE PERFORMANCE
 * =========================
 */
router.delete("/:id", removePerformance);

export default router;