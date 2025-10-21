import db from './database.js';

// Query services between startDate and endDate
async function getServicesByDateRange(startDate, endDate) {
  return db.query(
    "SELECT * FROM services WHERE service_timestamp BETWEEN $1 AND $2 ORDER BY id DESC",
    [startDate, endDate]
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

// Query tag fees between startDate and endDate
async function getTagFeesByDateRange(startDate, endDate) {
  return db.query(
    "SELECT * FROM tag_fees WHERE created_at BETWEEN $1 AND $2 ORDER BY id DESC",
    [startDate, endDate]
  );
}

// Query late fees between startDate and endDate
async function getLateFeesByDateRange(startDate, endDate) {
  return db.query(
    "SELECT * FROM late_fees WHERE created_at BETWEEN $1 AND $2 ORDER BY id DESC",
    [startDate, endDate]
  );
}

// Export functions so controller can call them
export default {
  getServicesByDateRange,
  getExpensesByDateRange,
  getAdvancesByDateRange,
  getTagFeesByDateRange,
  getLateFeesByDateRange
};
