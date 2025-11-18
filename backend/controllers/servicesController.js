import fs from "fs";
import path from "path";
import {
  fetchServiceDefinitionsModel,
  fetchServiceDefinitionByIdModel,
  createServiceDefinitionModel,
  updateServiceDefinitionModel,
  deleteServiceDefinitionModel,
  fetchServiceRolesModel,
  saveServiceTransaction,
  fetchAllServiceTransactions,
  fetchServiceTransactionById,
  updateServiceTransactionModel,
  updateServiceTransactionModelt,
  DeleteServiceTransaction,
} from "../models/servicesModel.js";

// =========================================================
// SERVICE DEFINITIONS CONTROLLER
// =========================================================

// GET ALL SERVICE DEFINITIONS
export const getServiceDefinitions = async (req, res) => {
  try {
    const services = await fetchServiceDefinitionsModel();
    res.json({ success: true, data: services });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch services" });
  }
};

// GET SINGLE SERVICE DEFINITION
export const getServiceDefinitionById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await fetchServiceDefinitionByIdModel(id);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    res.json({ success: true, data: service });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch service" });
  }
};

// CREATE SERVICE DEFINITION
export const createServiceDefinition = async (req, res) => {
  try {
    const {
      service_name,
      service_amount,
      salon_amount,
      section_id,
      description,
      roles = [],
      materials = [],
    } = req.body;

    let service_image = null;
    if (req.file) service_image = req.file.filename;

    const data = { service_name, service_amount, salon_amount, section_id, description, service_image, roles, materials };

    const newService = await createServiceDefinitionModel(data);
    res.json({ success: true, data: newService });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create service" });
  }
};

// UPDATE SERVICE DEFINITION
export const updateServiceDefinition = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      service_name,
      service_amount,
      salon_amount,
      section_id,
      description,
      roles = [],
      materials = [],
    } = req.body;

    let service_image = null;
    if (req.file) service_image = req.file.filename;

    const data = { service_name, service_amount, salon_amount, section_id, description, service_image, roles, materials };
    const updatedService = await updateServiceDefinitionModel(id, data);
    res.json({ success: true, data: updatedService });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update service" });
  }
};

// DELETE SERVICE DEFINITION
export const deleteServiceDefinition = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteServiceDefinitionModel(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Service not found" });
    res.json({ success: true, message: "Service deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete service" });
  }
};

// =========================================================
// SERVICE TRANSACTIONS CONTROLLER
// =========================================================

// CREATE SERVICE TRANSACTION
export const createServiceTransaction = async (req, res) => {
  try {
    const { section_id, service_definition_id, created_by, appointment_date, appointment_time, customer_id, customer_note, performers = [] } = req.body;

    const data = { section_id, service_definition_id, created_by, appointment_date, appointment_time, customer_id, customer_note, performers };

    const transaction = await saveServiceTransaction(data);
    res.json({ success: true, data: transaction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create service transaction" });
  }
};

// GET ALL SERVICE TRANSACTIONS
export const getAllServiceTransactions = async (req, res) => {
  try {
    const transactions = await fetchAllServiceTransactions();
    res.json({ success: true, data:transactions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch service transactions" });
  }
};

// GET SINGLE SERVICE TRANSACTION
export const getServiceTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await fetchServiceTransactionById(id);
    if (!transaction) return res.status(404).json({ success: false, message: "Transaction not found" });
    res.json({ success: true, data: transaction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch transaction" });
  }
};

// UPDATE SERVICE TRANSACTION
export const updateServiceTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { section_id, service_definition_id, appointment_date, appointment_time, customer_id, customer_note, serviceRoles = [] } = req.body;
    const updates = { section_id, service_definition_id, appointment_date, appointment_time, customer_id, customer_note, serviceRoles };
    const updated = await updateServiceTransactionModel(id, updates);
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update transaction" });
  }
};

// UPDATE SERVICE TRANSACTION TIME ONLY
export const updateServiceTransactiont = async (req, res) => {
  try {
    const { id } = req.params;
    const { newTime } = req.body;
    const updated = await updateServiceTransactionModelt(id, newTime);
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update transaction time" });
  }
};

// DELETE SERVICE TRANSACTION
export const deleteServiceTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DeleteServiceTransaction(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Transaction not found" });
    res.json({ success: true, message: "Transaction deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete transaction" });
  }
};

// =========================================================
// SERVICE ROLES
// =========================================================
export const getServiceRoles = async (req, res) => {
  try {
    const roles = await fetchServiceRolesModel();
    res.json({ success: true, data: roles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch service roles" });
  }
};

