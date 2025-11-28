import jwt from "jsonwebtoken";

/**
 * Generate JWT token
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @returns {string} - JWT token
 */
export const generateToken = (userId, email) => {
  try {
    const payload = {
      userId,
      email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    return token;
  } catch (error) {
    throw new Error("Error generating token: " + error.message);
  }
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {object} - Decoded token payload
 */
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token: " + error.message);
  }
};

