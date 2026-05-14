import express from "express";

import {
  createFinanceStructureController,
  getFinanceStructuresController,
  getByClassAndTermController,
  updateFinanceStructureController,
  deleteFinanceStructureController,
} from "../controllers/financeStructureController.js";

const router = express.Router();

router.post("/", createFinanceStructureController);
router.get("/", getFinanceStructuresController);

// IMPORTANT FOR DROPDOWN
router.get("/by-class/:class_id/term/:term_id", getByClassAndTermController);

router.put("/:id", updateFinanceStructureController);
router.delete("/:id", deleteFinanceStructureController);

export default router;