import mongoose from "mongoose";

const upworkTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    upwork_tok: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("UpworkToken", upworkTokenSchema);

