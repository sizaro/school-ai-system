import express from "express";
import {
  addTerm,
  fetchTerms,
  activateTerm,
  editTerm,
  closeTerm,
  deleteTerm, // 🔥 ADD THIS
} from "../controllers/termsController.js";

const router = express.Router();

router.post("/", addTerm);
router.get("/", fetchTerms);
router.put("/:id", editTerm);
router.patch("/:id/activate", activateTerm);
router.patch("/:id/end", closeTerm);

// 🔥 ADD DELETE ROUTE
router.delete("/:id", deleteTerm);

export default router;