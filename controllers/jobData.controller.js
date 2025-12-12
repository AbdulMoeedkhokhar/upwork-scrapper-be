import JobData from "../models/jobData.model.js";
import { jobDataListDTO } from "../utils/jobData.dto.js";

/**
 * Receive and store job data
 */
export const receiveJobData = async (req, res) => {
  try {
    const data = req.body;

    // Validate that data is provided
    if (!data) {
      return res.status(400).json({
        success: false,
        message: "Invalid data. Please provide a valid JSON object.",
      });
    }

    // Validate that jobId exists in data
    if (!data.jobId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data. Please provide a jobId in the data object.",
      });
    }

    // Check if job with this jobId already exists
    const existingJob = await JobData.findOne({
      "data.jobId": data.jobId,
    });

    if (existingJob) {
      // Job already exists, return success response
      return res.status(200).json({
        success: true,
        message: "Job data already exists",
        
      });
    }

    // Job doesn't exist, create new record
    const jobData = await JobData.create({
      data,
    });

    res.status(200).json({
      success: true,
      message: "Job data received and stored successfully",
      data: {
        id: jobData._id,
        createdAt: jobData.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Error storing job data",
    });
  }
};

/**
 * Get all job data (authenticated route)
 * Returns only specific fields via DTO
 */
export const getAllJobData = async (req, res) => {
  try {
    // Fetch all job data from database, sorted by most recent first
    const allJobData = await JobData.find({})
      .sort({ createdAt: -1 })
      .select('-__v'); // Exclude version key

    // Transform to DTO format (only send specific fields)
    const jobDataDTO = jobDataListDTO(allJobData);

    res.status(200).json({
      success: true,
      message: "Job data retrieved successfully",
      count: jobDataDTO.length,
      data: jobDataDTO,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Error fetching job data",
    });
  }
};

