import express from "express";
import {
  addSubject,
  fetchSubjects,
  fetchSubjectById,
  editSubject,
  removeSubject,
} from "../controllers/subjectsController.js";

const router = express.Router();

// CREATE
router.post("/", addSubject);

// READ ALL
router.get("/", fetchSubjects);

// READ ONE
router.get("/:id", fetchSubjectById);

// UPDATE
router.put("/:id", editSubject);

// DELETE
router.delete("/:id", removeSubject);

export default router;