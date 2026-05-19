import express from "express";
import Inquiry from "../models/Inquiry.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newInquiry = new Inquiry(req.body);
    await newInquiry.save();
    res.status(201).json({ message: "Inquiry sent successfully!" });
  } catch (error) {
    res.status(400).json({ error: "Failed to send inquiry" });
  }
});

router.get("/", async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 }); // Newest first
    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Inquiry deleted" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete inquiry" });
  }
});

export default router;
