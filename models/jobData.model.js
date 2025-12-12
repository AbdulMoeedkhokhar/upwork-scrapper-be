import mongoose from "mongoose";

const jobDataSchema = new mongoose.Schema(
  {
    // Store any JSON data as a flexible object
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      enum: ["out reached", "not found", "no"],
      default: "no",
    },
    outreachedBy: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("JobData", jobDataSchema);

