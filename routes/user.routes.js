import express from "express";
import { loginUser, verifyAuth, logoutUser } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.get("/verify", authenticate, verifyAuth);
router.post("/logout", logoutUser);

export default router;
