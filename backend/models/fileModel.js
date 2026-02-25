import pool from "../config/db.js"; // your Postgres pool

// Insert a new file record
export const createFile = async ({ school, fileName, fileType, fileUrl }) => {
  const query = `
    INSERT INTO school_files (school_name, file_name, file_type, file_url)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [school, fileName, fileType, fileUrl];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Optional: get files by school
export const getFilesBySchool = async (school) => {
  const query = `
    SELECT * FROM school_files
    WHERE school_name = $1
    ORDER BY created_at DESC;
  `;
  const { rows } = await pool.query(query, [school]);
  return rows;
};
