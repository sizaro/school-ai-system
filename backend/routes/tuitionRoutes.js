import express from "express";
import {
  saveTuition,
  fetchTuition,
  getTuition,
} from "../controllers/tuitionController.js";

const router = express.Router();

router.post("/", saveTuition);
router.get("/", fetchTuition);
router.get("/single", getTuition);

export default router;