import yearlyModel from "../models/yearlyModel.js";

export const getYearlyReport = async (req, res) => {
  try {
    const { year } = req.query;
    console.log("Received in the controller year:", year);

    const today = new Date();
    const rangeStart = new Date(year, 0, 1);
    let rangeEnd = new Date(year, 11, 31);

    let scenario = "";

    // Future year
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

    // Current year
    if (rangeStart <= today && rangeEnd >= today) {
      scenario = "current";
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      yesterday.setHours(23, 59, 59, 999);
      rangeEnd = yesterday;
    }

    // Past year
    if (rangeEnd < today) {
      scenario = "past";
    }

    // Fetch DB data including tag fees and late fees
    const [services, expenses, advances, tagFees, lateFees] = await Promise.all([
      yearlyModel.getServicesByYear(year),
      yearlyModel.getExpensesByYear(year),
      yearlyModel.getAdvancesByYear(year),
      yearlyModel.getTagFeesByYear(year),
      yearlyModel.getLateFeesByYear(year)
    ]);

    console.log("Yearly tag fees:", tagFees.rows);
    console.log("Yearly late fees:", lateFees.rows);

    res.json({
      scenario,
      services: services.rows,
      expenses: expenses.rows,
      advances: advances.rows,
      tagFees: tagFees.rows,
      lateFees: lateFees.rows
    });

  } catch (err) {
    console.error("Error fetching yearly report:", err);
    res.status(500).json({ error: "Server error" });
  }
};
