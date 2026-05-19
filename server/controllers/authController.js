import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import OTPVerification from "../models/OTPVerification.js";
import generateOTP from "../utils/generateOTP.js";
import sendOTPEmail from "../utils/sendOTPEmail.js";

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await sendOTPEmail(email, otp);

    res.status(201).json({
      message: "Registered successfully. OTP sent to email.",
      email: email
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await OTPVerification.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpRecord.expiresAt < Date.now()) {
      await OTPVerification.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Success: Update user and delete OTP
    await User.findOneAndUpdate({ email }, { isVerified: true });
    await OTPVerification.deleteOne({ _id: otpRecord._id });

    res.status(200).json({ message: "OTP verified successfully. You can now login." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      // Re-send OTP if not verified
      const otp = generateOTP();
      await OTPVerification.findOneAndDelete({ email });
      await OTPVerification.create({
        email,
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
      });
      await sendOTPEmail(email, otp);
      
      return res.status(403).json({ 
        message: "Account not verified. A new OTP has been sent to your email.",
        notVerified: true 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role || "user" },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role || "user"
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};