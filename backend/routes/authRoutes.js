// routes/auth.js
import express from "express";
import { login, checkAuth, logoutUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.get("/check", checkAuth);
router.post("/logout", logoutUser);

export default router;
