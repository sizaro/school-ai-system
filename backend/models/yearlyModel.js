import db from './database.js';

// Query services in the year
async function getServicesByYear(year) {
  const startDate = new Date(year, 0, 1);   // Jan 1
  const endDate = new Date(year, 11, 31);   // Dec 31
  return db.query(
    "SELECT * FROM services WHERE service_timestamp BETWEEN $1 AND $2 ORDER BY id DESC",
    [startDate, endDate]
  );
}

// Query expenses in the year
async function getExpensesByYear(year) {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  return db.query(
    "SELECT * FROM expenses WHERE created_at BETWEEN $1 AND $2 ORDER BY id DESC",
    [startDate, endDate]
  );
}

// Query advances in the year
async function getAdvancesByYear(year) {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  return db.query(
    "SELECT * FROM advances WHERE created_at BETWEEN $1 AND $2 ORDER BY id DESC",
    [startDate, endDate]
  );
}

// ✅ Query tag fees in the year
async function getTagFeesByYear(year) {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  return db.query(
    "SELECT * FROM tag_fees WHERE created_at BETWEEN $1 AND $2 ORDER BY id DESC",
    [startDate, endDate]
  );
}

// ✅ Query late fees in the year
async function getLateFeesByYear(year) {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  return db.query(
    "SELECT * FROM late_fees WHERE created_at BETWEEN $1 AND $2 ORDER BY id DESC",
    [startDate, endDate]
  );
}

export default {
  getServicesByYear,
  getExpensesByYear,
  getAdvancesByYear,
  getTagFeesByYear,
  getLateFeesByYear
};
