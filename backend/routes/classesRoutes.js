import express from "express";
import {
  addClass,
  fetchClasses,
  fetchClassById,
  editClass,
  deleteClass,
} from "../controllers/classesController.js";

const router = express.Router();

// GET all classes
router.get("/", fetchClasses);

// GET one class
router.get("/:id", fetchClassById);

// CREATE class
router.post("/", addClass);

// UPDATE class
router.put("/:id", editClass);

// DELETE class
router.delete("/:id", deleteClass);

export default router;