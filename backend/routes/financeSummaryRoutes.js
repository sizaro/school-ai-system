import express from "express";

import {
  getStudentFinanceSummaryController,
} from "../controllers/financeSummaryController.js";

const router = express.Router();

// ======================================
// GET FINANCE SUMMARY (CORE DASHBOARD)
// /students/:id/finance-summary?term_id=7
// ======================================
router.get(
  "/:id/finance-summary",
  getStudentFinanceSummaryController
);

export default router;