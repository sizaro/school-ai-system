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

   console.log("==== DEBUG PAYMENT REQUEST ====");
  console.log("params:", req.params);
  console.log("body:", req.body);
  console.log("file:", req.file);
  console.log("===============================");

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

    console.log(req.body);
    console.log('studentid: ',req.params.studentId)

    try {

      // CONTEXT
      const studentId =
        req.params.studentId;

      // ACTUAL PAYMENT ROW
      const paymentId =
        req.body.paymentId;

      if (!studentId) {
        return res.status(400).json({
          error: "Missing student ID",
        });
      }

      if (!paymentId) {
        return res.status(400).json({
          error: "Missing payment ID",
        });
      }

      const receipt_url = req.file
        ? `/uploads/receipts/${req.file.filename}`
        : null;

      const payment =
        await updatePayment(
          paymentId,
          {
            student_id: studentId,

            amount: req.body.amount,

            finance_type_id:
              req.body.finance_type_id,

            payment_method:
              req.body.payment_method,

            payment_date:
              req.body.payment_date,

            term_id:
              req.body.term_id,

            notes:
              req.body.notes,

            status:
              req.body.status,

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
    console.log(req.params)

    try {

      const studentId =
        req.params.studentId;

      const paymentId =
        req.params.paymentId;

      if (!studentId || !paymentId) {
        return res.status(400).json({
          error:
            "Missing studentId or paymentId",
        });
      }

      await deletePayment(
        paymentId,
        studentId
      );

      res.json({
        message:
          "Payment deleted successfully",
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        error:
          "Failed to delete payment",
      });
    }
  };