import db from './database.js';

export const saveSalonSession = async (status) => {
  const query = `
    INSERT INTO salon_sessions (
      open_time,
      close_time,
      status
    )
    VALUES (NOW(), NULL, $1)
    RETURNING *;
  `;

  const values = [status];
  const { rows } = await db.query(query, values);
  return rows[0];
};




export const updateSalonSession = async (status) => {
  const query = `
    UPDATE salon_sessions
    SET close_time = NOW(),
        status = $1,
        updated_at = NOW()
    WHERE status = 'open'
      AND close_time IS NULL
    RETURNING *
  `;

  const values = [status,];

  const { rows } = await db.query(query, values);
  return rows[0]; 
};


export const fetchTodaySalonSession = async () => {
  try {
    const results = await db.query(
      `SELECT 
  s.id,
  s.status,
  s.open_time AT TIME ZONE 'Africa/Kampala' AS open_time,
  s.close_time AT TIME ZONE 'Africa/Kampala' AS close_time,
  s.created_at AT TIME ZONE 'Africa/Kampala' AS created_at,
  s.updated_at AT TIME ZONE 'Africa/Kampala' AS updated_at,
  NOW() AS server_now
FROM salon_sessions s
WHERE DATE(open_time) = CURRENT_DATE
  AND close_time IS NULL
  AND status = 'open'
ORDER BY open_time DESC
LIMIT 1;

`
    );

    return results.rows || null; // return the open session or null
  } catch (error) {
    console.error("Error fetching today's open salon session:", error);
    throw error;
  }
};