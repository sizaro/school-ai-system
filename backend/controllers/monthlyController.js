import monthlyModel from "../models/monthlyModel.js";

// Controller to handle requests for monthly reports
export const getMonthlyReport = async (req, res) => {
  try {
    const { year, month } = req.query; // e.g. year=2025, month=10
    console.log("Received in the controller year:", year, "month:", month);

    const today = new Date();

    // Construct the month start (1st day) and end (last day)
    const rangeStart = new Date(year, month - 1, 1); // JS months are 0-based
    let rangeEnd = new Date(year, month, 0); // last day of the month
    rangeEnd.setHours(23, 59, 59, 999); // include entire day

    let scenario = "";

    // Scenario 3: Future month
    if (rangeStart > today) {
      scenario = "future";
      return res.json({
        scenario,
        services: [],
        expenses: [],
        advances: [],
        tagFees: [],
        lateFees: []
      });
    }

    // Scenario 1: Current month
    if (rangeStart <= today && rangeEnd >= today) {
      scenario = "current";
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      yesterday.setHours(23, 59, 59, 999); // include full yesterday
      rangeEnd = yesterday; 
    }

    // Scenario 2: Past month
    if (rangeEnd < today) {
      scenario = "past";
      // already adjusted rangeEnd to last day 23:59:59
    }

    // ✅ Fetch all data from DB (including Tag Fees and Late Fees)
    const [services, expenses, advances, tagFees, lateFees] = await Promise.all([
      monthlyModel.getServicesByMonth(rangeStart, rangeEnd),
      monthlyModel.getExpensesByMonth(rangeStart, rangeEnd),
      monthlyModel.getAdvancesByMonth(rangeStart, rangeEnd),
      monthlyModel.getTagFeesByMonth(rangeStart, rangeEnd),
      monthlyModel.getLateFeesByMonth(rangeStart, rangeEnd)
    ]);

    console.log("monthly services in the controller:", services.rows);
    console.log("monthly expenses in the controller:", expenses.rows);
    console.log("monthly advances in the controller:", advances.rows);
    console.log("monthly tag fees in the controller:", tagFees.rows);
    console.log("monthly late fees in the controller:", lateFees.rows);

    // ✅ Return all collected data
    res.json({
      scenario, // helpful for debugging
      services: services.rows,
      expenses: expenses.rows,
      advances: advances.rows,
      tagFees: tagFees.rows,
      lateFees: lateFees.rows
    });
  } catch (err) {
    console.error("Error fetching monthly report:", err);
    res.status(500).json({ error: "Server error" });
  }
};
