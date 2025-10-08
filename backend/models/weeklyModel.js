import db from './database.js';

// Query services between startDate and endDate
async function getServicesByDateRange(startDate, endDate) {
  return db.query(
    "SELECT * FROM services WHERE service_timestamp BETWEEN $1 AND $2 ORDER BY id DESC",
    [startDate, endDate] // <- we safely pass parameters to avoid SQL injection
  );
}

// Query expenses between startDate and endDate
async function getExpensesByDateRange(startDate, endDate) {
  return db.query(
    "SELECT * FROM expenses WHERE created_at BETWEEN $1 AND $2 ORDER BY id DESC",
    [startDate, endDate]
  );
}

// Query salary advances between startDate and endDate
async function getAdvancesByDateRange(startDate, endDate) {
  return db.query(
    "SELECT * FROM advances WHERE created_at BETWEEN $1 AND $2 ORDER BY id DESC",
    [startDate, endDate]
  );
}

// Export functions so controller can call them
export default {
  getServicesByDateRange,
  getExpensesByDateRange,
  getAdvancesByDateRange
};
