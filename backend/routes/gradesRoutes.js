import express from "express";

import {
  fetchGrades,
  addGrade,
  editGrade,
  removeGrade,
} from "../controllers/gradesController.js";

const router = express.Router();

// ================= GET ALL =================
router.get("/", fetchGrades);

// ================= CREATE =================
router.post("/", addGrade);

// ================= UPDATE =================
router.put("/:id", editGrade);

// ================= DELETE =================
router.delete("/:id", removeGrade);

export default router;