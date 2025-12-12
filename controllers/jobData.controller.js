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
 * Supports pagination via query parameter: ?page=1 (defaults to page 1)
 * Returns 15 items per page
 */
export const getAllJobData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = 15; // 15 items per page
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await JobData.countDocuments({});

    // Fetch paginated job data from database, sorted by most recent first
    const allJobData = await JobData.find({})
      .sort({ createdAt: -1 })
      .select('-__v') // Exclude version key
      .skip(skip)
      .limit(limit);

    // Transform to DTO format (only send specific fields)
    const jobDataDTO = jobDataListDTO(allJobData);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      message: "Job data retrieved successfully",
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalCount: totalCount,
        limit: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
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

/**
 * Update job status and outreachedBy by jobId
 */
export const updateJobStatus = async (req, res) => {
  try {
    const { jobId, status, outreachedBy } = req.body;

    // Validate that jobId is provided
    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required.",
      });
    }

    // Validate status if provided
    if (status && !["out reached", "not found", "no"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Status must be one of: 'out reached', 'not found', 'no'",
      });
    }

    // Find the job by jobId
    const job = await JobData.findOne({
      "data.jobId": jobId,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found with the provided job ID.",
      });
    }

    // Prepare update object
    const updateData = {};
    if (status !== undefined) {
      updateData.status = status;
    }
    if (outreachedBy !== undefined) {
      updateData.outreachedBy = outreachedBy;
    }

    // Update the job
    const updatedJob = await JobData.findByIdAndUpdate(
      job._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Job status updated successfully",
      data: {
        id: updatedJob._id,
        jobId: updatedJob.data.jobId,
        status: updatedJob.status,
        outreachedBy: updatedJob.outreachedBy,
        updatedAt: updatedJob.updatedAt,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Error updating job status",
    });
  }
};

