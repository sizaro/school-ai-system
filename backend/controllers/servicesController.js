import {
  saveService,
  fetchAllServices,
  fetchServiceById,
  UpdateServiceById,
  DeleteServiceById
} from "../models/servicesModel.js";

/**
 * Create new service / appointment
 */
export const createService = async (req, res) => {
  try {
    const {
      id,
      name,
      service_amount,
      salon_amount,
      barber_id,
      barber_amount,
      barber_assistant_id,
      barber_assistant_amount,
      scrubber_assistant_id,
      scrubber_assistant_amount,
      black_shampoo_assistant_id,
      black_shampoo_assistant_amount,
      black_shampoo_amount,
      super_black_assistant_id,
      super_black_assistant_amount,
      super_black_amount,
      black_mask_assistant_id,
      black_mask_assistant_amount,
      black_mask_amount,
      customer_note,
      created_by,
      status,
      appointment_date,
      appointment_time,
      customer_id,
      service_timestamp
    } = req.body;

    console.log("🟢 Received service creation request:");

    const newService = await saveService({
      id,
      name,
      service_amount,
      salon_amount,
      barber_id,
      barber_amount,
      barber_assistant_id,
      barber_assistant_amount,
      scrubber_assistant_id,
      scrubber_assistant_amount,
      black_shampoo_assistant_id,
      black_shampoo_assistant_amount,
      black_shampoo_amount,
      super_black_assistant_id,
      super_black_assistant_amount,
      super_black_amount,
      black_mask_assistant_id,
      black_mask_assistant_amount,
      black_mask_amount,
      customer_note,
      created_by,
      status,
      appointment_date,
      appointment_time,
      customer_id,
      service_timestamp,
    });

    res.status(201).json({
      message: "✅ Service/Appointment created successfully",
      data: newService
    });
  } catch (err) {
    console.error("❌ Error creating service:", err);
    res.status(500).json({ error: "Failed to create service" });
  }
};

/**
 * Get all services
 */
export const getAllServices = async (req, res) => {
  try {
    const services = await fetchAllServices();
    res.status(200).json(services);
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ error: "Failed to fetch services" });
  }
};

/**
 * Get service by ID
 */
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await fetchServiceById(id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.status(200).json(service);
  } catch (err) {
    console.error("Error fetching service by ID:", err);
    res.status(500).json({ error: "Failed to fetch service" });
  }
};

/**
 * Update service by ID
 */
export const updateService = async (req, res) => {
  try {
    const {
      id,
      name,
      service_amount,
      salon_amount,
      barber_id,
      barber_amount,
      barber_assistant_id,
      barber_assistant_amount,
      scrubber_assistant_id,
      scrubber_assistant_amount,
      black_shampoo_assistant_id,
      black_shampoo_assistant_amount,
      black_shampoo_amount,
      super_black_assistant_id,
      super_black_assistant_amount,
      super_black_amount,
      black_mask_assistant_id,
      black_mask_assistant_amount,
      black_mask_amount,
      customer_note,
      created_by,
      status,
      appointment_date,
      appointment_time,
      customer_id,
      service_timestamp
    } = req.body;

    if (!id) return res.status(400).json({ error: "Missing service ID" });

    // Handle new file upload
    const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url || null;

    const updatedService = await UpdateServiceById({
      id,
      name,
      service_amount,
      salon_amount,
      barber_id,
      barber_amount,
      barber_assistant_id,
      barber_assistant_amount,
      scrubber_assistant_id,
      scrubber_assistant_amount,
      black_shampoo_assistant_id,
      black_shampoo_assistant_amount,
      black_shampoo_amount,
      super_black_assistant_id,
      super_black_assistant_amount,
      super_black_amount,
      black_mask_assistant_id,
      black_mask_assistant_amount,
      black_mask_amount,
      customer_note,
      created_by,
      status,
      appointment_date,
      appointment_time,
      customer_id,
      service_timestamp,
    });

    if (!updatedService) {
      return res.status(404).json({ error: "Service not found or not updated" });
    }

    res.status(200).json({
      message: "✅ Service updated successfully",
      data: updatedService
    });
  } catch (err) {
    console.error("Error updating service:", err);
    res.status(500).json({ error: "Failed to update service" });
  }
};

/**
 * Delete service by ID
 */
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DeleteServiceById(id);
    if (!deleted) return res.status(404).json({ error: "Service not found" });
    res.status(200).json({ message: "🗑️ Service deleted successfully" });
  } catch (err) {
    console.error("Error deleting service:", err);
    res.status(500).json({ error: "Failed to delete service" });
  }
};

export default {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
};
