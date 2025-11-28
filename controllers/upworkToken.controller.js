import UpworkToken from "../models/upworkToken.model.js";

/**
 * Get Upwork token for the authenticated user
 */
export const getUpworkToken = async (req, res) => {
  try {
    const userId = req.userId;

    const upworkToken = await UpworkToken.findOne({ userId });

    if (!upworkToken) {
      return res.status(404).json({
        success: false,
        message: "Upwork token not found for this user",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        upwork_tok: upworkToken.upwork_tok,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Error fetching Upwork token",
    });
  }
};

/**
 * Create or update Upwork token for the authenticated user
 */
export const saveUpworkToken = async (req, res) => {
  try {
    const userId = req.userId;
    const { upwork_tok } = req.body;

    if (!upwork_tok) {
      return res.status(400).json({
        success: false,
        message: "Upwork token is required",
      });
    }

    // Check if token already exists for this user
    const existingToken = await UpworkToken.findOne({ userId });

    let upworkToken;

    if (existingToken) {
      // Update existing token
      existingToken.upwork_tok = upwork_tok;
      upworkToken = await existingToken.save();
    } else {
      // Create new token
      upworkToken = await UpworkToken.create({
        userId,
        upwork_tok,
      });
    }

    res.status(200).json({
      success: true,
      message: existingToken ? "Upwork token updated successfully" : "Upwork token saved successfully",
      data: {
        _id: upworkToken._id,
        userId: upworkToken.userId,
        upwork_tok: upworkToken.upwork_tok,
        createdAt: upworkToken.createdAt,
        updatedAt: upworkToken.updatedAt,
      },
    });
  } catch (err) {
    // Handle duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Upwork token already exists for this user",
      });
    }

    res.status(500).json({
      success: false,
      message: err.message || "Error saving Upwork token",
    });
  }
};

