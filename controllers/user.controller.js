import User from "../models/user.model.js";
import { comparePassword } from "../utils/password.util.js";
import { generateToken } from "../utils/jwt.util.js";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.email);

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents JavaScript access to cookie
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Error during login",
    });
  }
};

/**
 * Verify authentication status
 * Uses authenticate middleware to check if user is authenticated
 */
export const verifyAuth = async (req, res) => {
  try {
    // If middleware passed, user is authenticated
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        email: req.user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Error verifying authentication",
    });
  }
};

/**
 * Logout user by clearing the token cookie
 */
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Error during logout",
    });
  }
};
