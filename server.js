import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import upworkTokenRoutes from "./routes/upworkToken.routes.js";
import jobRoutes from "./routes/job.routes.js";
import jobDataRoutes from "./routes/jobData.routes.js";

dotenv.config();
connectDB();

const app = express();

// CORS configuration
// Note: Cannot use origin: "*" with credentials: true
// Browsers block this combination for security reasons
app.use(
    cors({
      origin: function (origin, callback) {
        // Allow requests with no origin (Extensions, Postman, Curl)
        if (!origin) return callback(null, true);
  
        // Allow ALL origins  
        return callback(null, true);
      },
      credentials: true, // required to send cookies
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  

// Handle preflight requests
//app.options('*', cors());

app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/upwork-token", upworkTokenRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api", jobDataRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
