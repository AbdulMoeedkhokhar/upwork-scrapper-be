import express from "express";
import { receiveJobData, getAllJobData } from "../controllers/jobData.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Receive job data - NO authentication required
router.post("/receivejobdata", receiveJobData);

// Get all job data - Authentication required
router.get("/jobdata", authenticate, getAllJobData);

export default router;

