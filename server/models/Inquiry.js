import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true },
);

export default mongoose.model("Inquiry", inquirySchema);
