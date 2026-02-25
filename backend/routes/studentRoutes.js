import express from 'express';
const router = express.Router();
const {
  registerStudent,
  updateStudent,
  getStudents,
  getStudentById,
} = require("../controllers/studentController");

router.post("/register", registerStudent);
router.put("/:id", updateStudent);
router.get("/", getStudents);
router.get("/:id", getStudentById);

module.exports = router;