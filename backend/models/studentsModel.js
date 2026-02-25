import db from "./database.js";

/**
 * REGISTER STUDENT (main transaction handled in controller)
 */
export const saveStudent = async ({
  user_id,
  first_name,
  last_name,
  gender,
  date_of_birth,
  created_by,
}) => {
  const query = `
    INSERT INTO students
      (user_id, first_name, last_name, gender, date_of_birth, created_by)
    VALUES
      ($1,$2,$3,$4,$5,$6)
    RETURNING *;
  `;

  const values = [
    user_id,
    first_name,
    last_name,
    gender,
    date_of_birth,
    created_by,
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};

/**
 * UPDATE STUDENT
 */
export const updateStudentById = async (id, data) => {
  const query = `
    UPDATE students SET
      first_name = $1,
      last_name = $2,
      gender = $3,
      date_of_birth = $4,
      created_by = $5
    WHERE id = $6
    RETURNING *;
  `;

  const values = [
    data.firstName,
    data.lastName,
    data.gender,
    data.dateOfBirth,
    data.createdBy,
    id,
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};

/**
 * FETCH ALL STUDENTS
 */
export const fetchAllStudents = async () => {
  const query = `
    SELECT s.*, u.email
    FROM students s
    LEFT JOIN users u ON s.user_id = u.id
    ORDER BY s.id DESC;
  `;

  const result = await db.query(query);
  return result.rows;
};

/**
 * FETCH STUDENT BY ID
 */
export const fetchStudentById = async (id) => {
  const query = `
    SELECT s.*, u.email
    FROM students s
    LEFT JOIN users u ON s.user_id = u.id
    WHERE s.id = $1;
  `;

  const result = await db.query(query, [id]);
  return result.rows[0];
};