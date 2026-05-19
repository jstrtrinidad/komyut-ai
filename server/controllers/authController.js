import bcrypt from "bcryptjs";

import User from "../models/User.js";

import OTPVerification from "../models/OTPVerification.js";

import generateOTP from "../utils/generateOTP.js";

import sendOTPEmail from "../utils/sendOTPEmail.js";

export const registerUser = async (
  req,
  res
) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const otp = generateOTP();

    await OTPVerification.create({
      email,
      otp,
      expiresAt:
        Date.now() + 5 * 60 * 1000,
    });

    await sendOTPEmail(email, otp);

    res.status(201).json({
      message:
        "Registered successfully. OTP sent to email.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};