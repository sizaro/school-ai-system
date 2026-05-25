import express from "express";
import multer from "multer";

import {
  createPaymentController,
  getPaymentByIdController,
  getStudentPaymentsController,
  updatePaymentController,
  deletePaymentController,
} from "../controllers/paymentController.js";

// ======================================
// MULTER (RECEIPTS)
// ======================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/receipts");
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const router = express.Router();

// ======================================
// CREATE PAYMENT (with receipt)
// ======================================
router.post(
  "/:id/payment",
  upload.single("receipt"),
  createPaymentController
);

// ======================================
// GET ALL PAYMENTS (FILTERED)
// /students/:id/payments?term_id=1&finance_type_id=2&year=2026
// ======================================
router.get(
  "/:id/payments",
  getStudentPaymentsController
);

// ======================================
// GET SINGLE PAYMENT
// ======================================
router.get(
  "/payments/:paymentId",
  getPaymentByIdController
);

// ======================================
// UPDATE PAYMENT (with optional receipt)
// ======================================
router.put(
  "/:studentId/payment",
  upload.single("receipt"),
  updatePaymentController
);

// ======================================
// DELETE PAYMENT
// ======================================
router.delete(
  "/:studentId/payment/:paymentId",
  deletePaymentController
);



export default router;