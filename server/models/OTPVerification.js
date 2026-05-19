import mongoose from "mongoose";

const otpVerificationSchema =
  new mongoose.Schema(
    {
      email: String,

      otp: String,

      expiresAt: Date,
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "OTPVerification",
  otpVerificationSchema
);