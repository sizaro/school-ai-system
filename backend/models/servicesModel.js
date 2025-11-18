import db from "./database.js";

// =========================================================
// SERVICE DEFINITIONS CRUD
// =========================================================

// FETCH ALL SERVICE DEFINITIONS
export const fetchServiceDefinitionsModel = async () => {
  const { rows } = await db.query(`SELECT * FROM service_definitions ORDER BY id ASC`);
  return rows;
};

// FETCH SINGLE SERVICE DEFINITION
export const fetchServiceDefinitionByIdModel = async (id) => {
  const query = `
    SELECT sd.*,
           json_agg(DISTINCT jsonb_build_object(
              'role_id', sr.id,
              'role_name', sr.role_name,
              'earned_amount', sr.earned_amount
           )) FILTER (WHERE sr.id IS NOT NULL) AS roles,
           json_agg(DISTINCT jsonb_build_object(
              'material_id', sm.id,
              'material_name', sm.material_name,
              'material_cost', sm.material_cost
           )) FILTER (WHERE sm.id IS NOT NULL) AS materials
    FROM service_definitions sd
    LEFT JOIN service_roles sr ON sr.service_definition_id = sd.id
    LEFT JOIN service_materials sm ON sm.service_definition_id = sd.id
    WHERE sd.id=$1
    GROUP BY sd.id;
  `;
  const result = await db.query(query, [id]);
  return result.rows[0] || null;
};

// CREATE SERVICE DEFINITION (with roles & materials)
export const createServiceDefinitionModel = async (data) => {
  const { service_name, service_amount, salon_amount, section_id, description, service_image, roles = [], materials = [] } = data;
  try {
    await db.query("BEGIN");

    const insertDef = `
      INSERT INTO service_definitions
      (service_name, service_amount, salon_amount, section_id, description, image_url)
      VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;
    `;
    const { rows } = await db.query(insertDef, [service_name, service_amount || 0, salon_amount || 0, section_id, description || null, service_image || null]);
    const serviceDef = rows[0];

    for (const r of roles) {
      await db.query(
        `INSERT INTO service_roles (service_definition_id, role_name, earned_amount) VALUES ($1,$2,$3)`,
        [serviceDef.id, r.role_name, r.role_amount || 0]
      );
    }

    for (const m of materials) {
      await db.query(
        `INSERT INTO service_materials (service_definition_id, material_name, material_cost) VALUES ($1,$2,$3)`,
        [serviceDef.id, m.material_name, m.material_cost || 0]
      );
    }

    await db.query("COMMIT");
    return serviceDef;
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Error creating service definition:", err);
    throw err;
  }
};

// UPDATE SERVICE DEFINITION (with roles & materials)
export const updateServiceDefinitionModel = async (id, data) => {
  const { service_name, service_amount, salon_amount, section_id, description, service_image, roles = [], materials = [] } = data;
  try {
    await db.query("BEGIN");

    const updateDef = `
      UPDATE service_definitions
      SET service_name=$1, service_amount=$2, salon_amount=$3, section_id=$4,
          service_description=$5, service_image=$6
      WHERE id=$7 RETURNING *;
    `;
    const { rows } = await db.query(updateDef, [service_name, service_amount || 0, salon_amount || 0, section_id, description || null, service_image || null, id]);
    const updatedDef = rows[0];
    if (!updatedDef) throw new Error("Service definition not found");

    await db.query(`DELETE FROM service_roles WHERE service_definition_id=$1`, [id]);
    for (const r of roles) {
      await db.query(
        `INSERT INTO service_roles (service_definition_id, role_name, earned_amount) VALUES ($1,$2,$3)`,
        [id, r.role_name, r.role_amount || 0]
      );
    }

    await db.query(`DELETE FROM service_materials WHERE service_definition_id=$1`, [id]);
    for (const m of materials) {
      await db.query(
        `INSERT INTO service_materials (service_definition_id, material_name, material_cost) VALUES ($1,$2,$3)`,
        [id, m.material_name, m.material_cost || 0]
      );
    }

    await db.query("COMMIT");
    return updatedDef;
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Error updating service definition:", err);
    throw err;
  }
};

// DELETE SERVICE DEFINITION
export const deleteServiceDefinitionModel = async (id) => {
  try {
    await db.query("BEGIN");

    await db.query(`DELETE FROM service_roles WHERE service_definition_id=$1`, [id]);
    await db.query(`DELETE FROM service_materials WHERE service_definition_id=$1`, [id]);
    const { rowCount } = await db.query(`DELETE FROM service_definitions WHERE id=$1`, [id]);

    await db.query("COMMIT");
    return rowCount > 0;
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Error deleting service definition:", err);
    throw err;
  }
};

// FETCH SERVICE ROLES
export const fetchServiceRolesModel = async () => {
  const { rows } = await db.query(`SELECT * FROM service_roles ORDER BY service_definition_id ASC`);
  return rows;
};

// =========================================================
// SERVICE TRANSACTIONS
// =========================================================

// SAVE SERVICE TRANSACTION (with performers)
export const saveServiceTransaction = async (data) => {
  const { section_id, service_definition_id, created_by, appointment_date, appointment_time, customer_id, customer_note, performers = [] } = data;
  try {
    await db.query("BEGIN");

    const insertTrans = `
      INSERT INTO service_transactions
      (service_definition_id, created_by, appointment_date, appointment_time, customer_id, customer_note, service_timestamp)
      VALUES ($1,$2,$3,$4,$5,$6,NOW()) RETURNING *;
    `;
    const { rows } = await db.query(insertTrans, [service_definition_id, created_by, appointment_date || null, appointment_time || null, customer_id || null, customer_note || null]);
    const transaction = rows[0];

    for (const p of performers) {
      await db.query(
        `INSERT INTO service_performers (service_transaction_id, service_role_id, employee_id) VALUES ($1,$2,$3)`,
        [transaction.id, p.role_id, p.employee_id || null]
      );
    }

    await db.query("COMMIT");
    return transaction;
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Error saving service transaction:", err);
    throw err;
  }
};
export const fetchAllServiceTransactions = async () => {
  const query = `
    SELECT 
      st.id AS transaction_id,
      st.service_definition_id,
      st.created_by,
      st.customer_id,
      st.customer_note,
      st.service_timestamp AT TIME ZONE 'Africa/Kampala' AS service_time,

      -- service definition fields
      sd.service_name,
      sd.description,
      sd.service_amount AS full_amount,
      sd.section_id AS definition_section_id,

      -- section name
      sec.section_name,

      -- group all performers
      json_agg(
        json_build_object(
          'performer_id', sp.id,
          'employee_id', u.id,
          'employee_name', u.first_name || ' ' || u.last_name,
          'role_name', sr.role_name,
          'role_amount', sr.earned_amount
        )
      ) AS performers

    FROM service_transactions st
    JOIN service_definitions sd ON sd.id = st.service_definition_id
    JOIN service_sections sec ON sec.id = sd.section_id
    LEFT JOIN service_performers sp ON sp.service_transaction_id = st.id
    LEFT JOIN service_roles sr ON sr.id = sp.service_role_id
    LEFT JOIN users u ON u.id = sp.employee_id

    GROUP BY 
      st.id, 
      sd.service_name,
      sd.description,
      sd.service_amount,
      sd.section_id,
      sec.section_name

    ORDER BY st.service_timestamp DESC;
  `;

  const { rows } = await db.query(query);
  return rows;
};

// FETCH SINGLE SERVICE TRANSACTION
export const fetchServiceTransactionById = async (id) => {
  const query = `
    SELECT st.id AS transaction_id,
           st.service_timestamp AT TIME ZONE 'Africa/Kampala' AS service_time,
           st.section_id, st.service_definition_id, st.created_by, st.customer_id, st.customer_note,
           st.appointment_date, st.appointment_time,
           json_agg(
             json_build_object(
               'role_id', sr.id,
               'role_name', sr.role_name,
               'employee_id', sp.employee_id,
               'earned_amount', sp.earned_amount
             )
           ) AS performers
    FROM service_transactions st
    LEFT JOIN service_performers sp ON sp.service_transaction_id = st.id
    LEFT JOIN service_roles sr ON sr.id = sp.service_role_id
    WHERE st.id = $1
    GROUP BY st.id;
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0] || null;
};

// UPDATE SERVICE TRANSACTION (with performers)
export const updateServiceTransactionModel = async (id, updates) => {
  const { section_id, service_definition_id, appointment_date, appointment_time, customer_id, customer_note, serviceRoles = [] } = updates;
  try {
    await db.query("BEGIN");

    const updateTrans = `
      UPDATE service_transactions
      SET section_id=$1, service_definition_id=$2, appointment_date=$3,
          appointment_time=$4, customer_id=$5, customer_note=$6
      WHERE id=$7 RETURNING *;
    `;
    const { rows } = await db.query(updateTrans, [section_id, service_definition_id, appointment_date || null, appointment_time || null, customer_id || null, customer_note || null, id]);
    const updated = rows[0];
    if (!updated) throw new Error("Service transaction not found");

    await db.query(`DELETE FROM service_performers WHERE service_transaction_id=$1`, [id]);
    for (const p of serviceRoles) {
      await db.query(
        `INSERT INTO service_performers (service_transaction_id, service_role_id, employee_id, earned_amount) VALUES ($1,$2,$3,$4)`,
        [id, p.role_id, p.employee_id || null, p.earned_amount || 0]
      );
    }

    await db.query("COMMIT");
    return updated;
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Error updating service transaction:", err);
    throw err;
  }
};

// UPDATE SERVICE TRANSACTION TIME ONLY
export const updateServiceTransactionModelt = async (id, newTime) => {
  const query = `
    UPDATE service_transactions
    SET service_timestamp=$1
    WHERE id=$2 RETURNING *;
  `;
  const { rows } = await db.query(query, [newTime, id]);
  return rows[0] || null;
};

// DELETE SERVICE TRANSACTION (with performers)
export const DeleteServiceTransaction = async (id) => {
  try {
    await db.query("BEGIN");
    await db.query(`DELETE FROM service_performers WHERE service_transaction_id=$1`, [id]);
    const { rowCount } = await db.query(`DELETE FROM service_transactions WHERE id=$1`, [id]);
    await db.query("COMMIT");
    return rowCount > 0;
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Error deleting service transaction:", err);
    throw err;
  }
};

// =========================================================
// EXPORT DEFAULT
// =========================================================
export default {
  saveServiceTransaction,
  fetchAllServiceTransactions,
  fetchServiceTransactionById,
  updateServiceTransactionModel,
  updateServiceTransactionModelt,
  DeleteServiceTransaction,
  fetchServiceDefinitionsModel,
  fetchServiceDefinitionByIdModel,
  createServiceDefinitionModel,
  updateServiceDefinitionModel,
  deleteServiceDefinitionModel,
  fetchServiceRolesModel
};
