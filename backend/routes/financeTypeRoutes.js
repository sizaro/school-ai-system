import express from "express";
import {
  getFinanceTypes,
  createFinanceType,
  updateFinanceType,
  deleteFinanceType
} from "../controllers/financeTypeController.js";

const router = express.Router();

// GET all finance types
router.get("/", getFinanceTypes);

// CREATE finance type
router.post("/", createFinanceType);

// UPDATE finance type
router.put("/:id", updateFinanceType);

// DELETE finance type
router.delete("/:id", deleteFinanceType);

export default router;