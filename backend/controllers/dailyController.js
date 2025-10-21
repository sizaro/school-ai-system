import dailyModel from '../models/dailyModel.js';

export async function getDailyReport(req, res) {
  try {
    const { date } = req.query;

    // If no date provided, return empty arrays
    if (!date) {
      return res.json({
        services: [],
        expenses: [],
        advances: [],
        clockings: [],
        employees: [],
        tagFees: [],
        lateFees: []
      });
    }

    // Convert date string to Date object
    const selectedDate = new Date(date);

    // Define the start and end of the day
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch all datasets concurrently
    const [
      services,
      expenses,
      advances,
      clockings,
      tagFees,
      lateFees,
      employees
    ] = await Promise.all([
      dailyModel.getServicesByDay(startOfDay.toISOString(), endOfDay.toISOString()),
      dailyModel.getExpensesByDay(startOfDay.toISOString(), endOfDay.toISOString()),
      dailyModel.getAdvancesByDay(startOfDay.toISOString(), endOfDay.toISOString()),
      dailyModel.getClockingsByDay(startOfDay.toISOString(), endOfDay.toISOString()),
      dailyModel.getTagFeesByDay(startOfDay.toISOString(), endOfDay.toISOString()),
      dailyModel.getLateFeesByDay(startOfDay.toISOString(), endOfDay.toISOString()),
      dailyModel.fetchAllEmployees()
    ]);

    console.log("✅ Daily Report Generated:", {
      date,
      servicesCount: services,
      expensesCount: expenses,
      advancesCount: advances,
      clockingsCount: clockings,
      tagFeesCount: tagFees,
      lateFeesCount: lateFees
    });

    // Return all data in one object
    res.json({
      services,
      expenses,
      advances,
      clockings,
      tagFees,
      lateFees,
      employees
    });

  } catch (error) {
    console.error("❌ Error fetching daily report:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
