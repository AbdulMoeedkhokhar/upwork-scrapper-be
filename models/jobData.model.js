import mongoose from "mongoose";

const jobDataSchema = new mongoose.Schema(
  {
    // Store any JSON data as a flexible object
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("JobData", jobDataSchema);

