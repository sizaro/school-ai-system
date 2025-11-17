import express from 'express';
const router = express.Router();

import upload from "../middleware/upload.js"; // Add Multer import for file handling

import {
  // 🔹 Existing logic
  getServiceDefinitions,
  getServiceDefinitionById,
  getServiceRoles,
  createServiceTransaction,
  getAllServiceTransactions,

  // 🔹 Service definitions management
  createServiceDefinition,
  updateServiceDefinition,
  deleteServiceDefinition,

  // Future update functions (placeholders)
  updateServiceTransaction,
  updateServiceTransactiont,
  deleteServiceTransaction,
} from '../controllers/servicesController.js';

// ===============================
// 🔵 NEW SERVICE RESOURCES
// ===============================

// 👉 fetch all service definitions
router.get('/service_definitions', getServiceDefinitions);

// 👉 fetch a single service definition by ID
router.get('/service_definitions/:id', getServiceDefinitionById);

// 👉 create a service definition with image upload
router.post('/service_definitions/create', upload.single("image_url"), createServiceDefinition);

// 👉 update a service definition by ID with optional image upload
router.put('/service_definitions/:id', upload.single("image_url"), updateServiceDefinition);

// 👉 delete a service definition by ID
router.delete('/service_definitions/:id', deleteServiceDefinition);

// 👉 fetch all service roles
router.get('/service_roles', getServiceRoles);

// 👉 create a service transaction + performers
router.post('/service_transactions', createServiceTransaction);

// 👉 fetch all service transactions (with performers)
router.get('/service_transactions', getAllServiceTransactions);

// ===============================
// 🔵 OPTIONAL (for future editing)
// ===============================

// 👉 edit a service transaction
router.put('/service_transactions/:id', updateServiceTransaction);
router.put('/service_transactionst/:id', updateServiceTransactiont);

// 👉 delete a service transaction
router.delete('/service_transactions/:id', deleteServiceTransaction);

export default router;
