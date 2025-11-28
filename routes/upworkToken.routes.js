import express from "express";
import { getUpworkToken, saveUpworkToken } from "../controllers/upworkToken.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.get("/", authenticate, getUpworkToken);
router.post("/", authenticate, saveUpworkToken);
router.put("/", authenticate, saveUpworkToken); // PUT also uses saveUpworkToken (upsert)

export default router;

