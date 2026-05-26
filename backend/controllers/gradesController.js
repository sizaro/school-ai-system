import {
  getGrades,
  createGrade,
  updateGrade,
  deleteGrade,
} from "../models/gradesModel.js";

// ================= GET ALL =================
export async function fetchGrades(req, res) {
  try {
    const data = await getGrades();
    res.json(data);
  } catch (err) {
    console.error("Error fetching grades:", err);
    res.status(500).json({ message: "Failed to fetch grades" });
  }
}

// ================= CREATE =================
export async function addGrade(req, res) {
  try {
    const newGrade = await createGrade(req.body);
    res.status(201).json(newGrade);
  } catch (err) {
    console.error("Error creating grade:", err);
    res.status(500).json({ message: "Failed to create grade" });
  }
}

// ================= UPDATE =================
export async function editGrade(req, res) {
  try {
    const { id } = req.params;
    const updated = await updateGrade(id, req.body);

    res.json(updated);
  } catch (err) {
    console.error("Error updating grade:", err);
    res.status(500).json({ message: "Failed to update grade" });
  }
}

// ================= DELETE =================
export async function removeGrade(req, res) {
  try {
    const { id } = req.params;
    await deleteGrade(id);

    res.json({ message: "Grade deleted successfully" });
  } catch (err) {
    console.error("Error deleting grade:", err);
    res.status(500).json({ message: "Failed to delete grade" });
  }
}