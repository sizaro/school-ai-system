// controllers/dailyController.js
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
        employees: []
      });
    }

    // Convert the date string to Date object
    const selectedDate = new Date(date);

    // Set start and end of the day
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch data from the model
    const [services, expenses, advances, clockings, employees] = await Promise.all([
      dailyModel.getServicesByDay(startOfDay.toISOString(), endOfDay.toISOString()),
      dailyModel.getExpensesByDay(startOfDay.toISOString(), endOfDay.toISOString()),
      dailyModel.getAdvancesByDay(startOfDay.toISOString(), endOfDay.toISOString()),
      dailyModel.getClockingsByDay(startOfDay.toISOString(), endOfDay.toISOString()),
      dailyModel.fetchAllEmployees()
    ]);

    console.log("this is the clocking in the controller", clockings)
    // Return as JSON
    res.json({ services, expenses, advances, clockings, employees });

  } catch (error) {
    console.error("Error fetching daily report:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
