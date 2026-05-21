import {
  createPayment,
  getPaymentById,
  getStudentPayments,
  updatePayment,
  deletePayment,
} from "../models/paymentModel.js";

// ======================================
// CREATE PAYMENT
// ======================================
export const createPaymentController = async (
  req,
  res
) => {
  try {
    const student_id = req.params.id;

    const receipt_url = req.file
      ? `/uploads/receipts/${req.file.filename}`
      : null;

    const payment = await createPayment({
      student_id,
      amount: req.body.amount,
      finance_type_id: req.body.finance_type_id,
      payment_method: req.body.payment_method,
      payment_date: req.body.payment_date,
      recorded_by: req.body.recorded_by,
      term_id: req.body.term_id,
      notes: req.body.notes,
      status: req.body.status,
      receipt_url,
    });

    res.status(201).json(payment);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to create payment",
    });
  }
};

// ======================================
// GET PAYMENT BY ID
// ======================================
export const getPaymentByIdController = async (
  req,
  res
) => {
  try {
    const payment = await getPaymentById(
      req.params.paymentId
    );

    res.json(payment);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch payment",
    });
  }
};

// ======================================
// GET STUDENT PAYMENTS
// FILTERS:
// ?term_id=
// ?finance_type_id=
// ?year=
// ======================================
export const getStudentPaymentsController =
  async (req, res) => {
    try {

      const student_id = req.params.id;

      const filters = {
        term_id: req.query.term_id,
        finance_type_id:
          req.query.finance_type_id,
        year: req.query.year,
      };

      const payments =
        await getStudentPayments(
          student_id,
          filters
        );

      res.json(payments);

    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Failed to fetch payments",
      });
    }
  };

// ======================================
// UPDATE PAYMENT
// ======================================
export const updatePaymentController =
  async (req, res) => {
    try {

      const paymentId = req.params.paymentId;

      const receipt_url = req.file
        ? `/uploads/receipts/${req.file.filename}`
        : null;

      const payment = await updatePayment(
        paymentId,
        {
          amount: req.body.amount,
          finance_type_id:
            req.body.finance_type_id,
          payment_method:
            req.body.payment_method,
          payment_date:
            req.body.payment_date,
          term_id: req.body.term_id,
          notes: req.body.notes,
          status: req.body.status,
          receipt_url,
        }
      );

      res.json(payment);

    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Failed to update payment",
      });
    }
  };

// ======================================
// DELETE PAYMENT
// ======================================
export const deletePaymentController =
  async (req, res) => {
    try {

      await deletePayment(
        req.params.paymentId
      );

      res.json({
        message: "Payment deleted successfully",
      });

    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Failed to delete payment",
      });
    }
  };