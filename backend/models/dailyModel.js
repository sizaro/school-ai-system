// models/dailyModel.js
import db from './database.js';

// Query services for a single day
async function getServicesByDay(startOfDay, endOfDay) {
  const result = await db.query(
    "SELECT * FROM services WHERE service_timestamp BETWEEN $1 AND $2 ORDER BY id DESC",
    [startOfDay, endOfDay]
  );
  return result.rows;
}

// Query expenses for a single day
async function getExpensesByDay(startOfDay, endOfDay) {
  const result = await db.query(
    "SELECT * FROM expenses WHERE created_at BETWEEN $1 AND $2 ORDER BY id DESC",
    [startOfDay, endOfDay]
  );
  return result.rows;
}

// Query salary advances for a single day
async function getAdvancesByDay(startOfDay, endOfDay) {
  const result = await db.query(
    "SELECT * FROM advances WHERE created_at BETWEEN $1 AND $2 ORDER BY id DESC",
    [startOfDay, endOfDay]
  );
  return result.rows;
}

// Query employee clockings for a single day
async function getClockingsByDay(startOfDay, endOfDay) {
  const result = await db.query(
    "SELECT * FROM employee_clocking WHERE clock_in BETWEEN $1 AND $2",
    [startOfDay, endOfDay]
  );
  return result.rows;
}

export default {
  getServicesByDay,
  getExpensesByDay,
  getAdvancesByDay,
  getClockingsByDay,
};
