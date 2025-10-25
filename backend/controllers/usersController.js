import bcrypt from "bcryptjs";
import { 
  saveUser, 
  fetchAllUsers, 
  fetchUserById, 
  UpdateUserById, 
  DeleteUserById 
} from "../models/usersModel.js";

/**
 * Get all users
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await fetchAllUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching user by ID:", id);
    const user = await fetchUserById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

/**
 * Create new user
 */
export const createUser = async (req, res) => {
  try {
    const { 
      first_name, 
      middle_name, 
      last_name, 
      phone, 
      next_of_kin, 
      next_of_kin_phone, 
      email, 
      password, 
      role 
    } = req.body;

    console.log("Received new user data:", req.body);

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await saveUser({
      first_name,
      middle_name,
      last_name,
      phone,
      next_of_kin,
      next_of_kin_phone,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({ message: "User created successfully", data: newUser });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
};

/**
 * Update user by ID
 */
export const updateUserById = async (req, res) => {
  try {
    const { 
      id,
      first_name, 
      middle_name, 
      last_name, 
      phone, 
      next_of_kin, 
      next_of_kin_phone, 
      email, 
      password, 
      role 
    } = req.body;

    if (!id) return res.status(400).json({ error: "Missing user ID" });

    let updatedData = {
      id,
      first_name,
      middle_name,
      last_name,
      phone,
      next_of_kin,
      next_of_kin_phone,
      email,
      role
    };

    // If password is provided, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await UpdateUserById(updatedData);

    if (!updatedUser) return res.status(404).json({ error: "User not found or not updated" });

    res.status(200).json({ message: "User updated successfully", data: updatedUser });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
};

/**
 * Delete user by ID
 */
export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await DeleteUserById(id);
    if (!deleted) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById
};
