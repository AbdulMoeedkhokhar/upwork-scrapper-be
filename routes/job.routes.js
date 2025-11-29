import express from "express";
import { getJobDetails } from "../controllers/job.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get job details - requires authentication
router.post("/details", authenticate, getJobDetails);

export default router;

