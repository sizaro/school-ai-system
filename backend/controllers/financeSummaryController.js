import {
  getStudentFinanceSummary,
} from "../models/financeSummaryModel.js";

// ======================================
// GET STUDENT FINANCE SUMMARY
// ======================================
export const getStudentFinanceSummaryController =
  async (req, res) => {
    try {

      const student_id = req.params.id;

      const term_id =
        req.query.term_id || null;

      const summary =
        await getStudentFinanceSummary(
          student_id,
          term_id
        );

      res.json(summary);

    } catch (err) {
      console.error(err);

      res.status(500).json({
        error:
          "Failed to fetch finance summary",
      });
    }
  };