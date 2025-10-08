import {
  saveService,
  fetchAllServices,
  fetchServiceById,
  updateServiceById,
  deleteServiceById
} from "../models/servicesModel.js";

/**
 * Create new service
 */
export const createService = async (req, res) => {
  try {
    const {
      name,
      service_amount,
      salon_amount,
      barber,
      barber_amount,
      barber_assistant,
      barber_assistant_amount,
      scrubber_assistant,
      scrubber_assistant_amount,
      black_shampoo_assistant,
      black_shampoo_assistant_amount,
      black_shampoo_amount,
      super_black_assistant,
      super_black_assistant_amount,
      super_black_amount,
      black_mask_assistant,
      black_mask_assistant_amount,
      black_mask_amount
    } = req.body;

    console.log("Received new service data:", req.body);

    const newService = await saveService({
      name,
      service_amount,
      salon_amount,
      barber,
      barber_amount,
      barber_assistant,
      barber_assistant_amount,
      scrubber_assistant,
      scrubber_assistant_amount,
      black_shampoo_assistant,
      black_shampoo_assistant_amount,
      black_shampoo_amount,
      super_black_assistant,
      super_black_assistant_amount,
      super_black_amount,
      black_mask_assistant,
      black_mask_assistant_amount,
      black_mask_amount
    });

    res.status(201).json({ message: "Service saved successfully", data: newService });
  } catch (err) {
    console.error("Error saving service:", err);
    res.status(500).json({ error: "Failed to save service" });
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
      barber,
      barber_amount,
      barber_assistant,
      barber_assistant_amount,
      scrubber_assistant,
      scrubber_assistant_amount,
      black_shampoo_assistant,
      black_shampoo_assistant_amount,
      black_shampoo_amount,
      super_black_assistant,
      super_black_assistant_amount,
      super_black_amount,
      black_mask_assistant,
      black_mask_assistant_amount,
      black_mask_amount,
      service_timestamp,
    } = req.body;

     console.log("This is the id of the service to be updated", id)
    if (!id) return res.status(400).json({ error: "Missing service ID" });

    const updatedService = await updateServiceById({
      name,
      service_amount,
      salon_amount,
      barber,
      barber_amount,
      barber_assistant,
      barber_assistant_amount,
      scrubber_assistant,
      scrubber_assistant_amount,
      black_shampoo_assistant,
      black_shampoo_assistant_amount,
      black_shampoo_amount,
      super_black_assistant,
      super_black_assistant_amount,
      super_black_amount,
      black_mask_assistant,
      black_mask_assistant_amount,
      black_mask_amount,
      service_timestamp,
      id
    });

    if (!updatedService) {
      return res.status(404).json({ error: "Service not found or not updated" });
    }

    res.status(200).json({ message: "Service updated successfully", data: updatedService });
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
    const deleted = await deleteServiceById(id);
    if (!deleted) return res.status(404).json({ error: "Service not found" });
    res.status(200).json({ message: "Service deleted successfully" });
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
