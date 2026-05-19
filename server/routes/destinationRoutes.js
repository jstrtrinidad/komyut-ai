import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Destination from "../models/Destination.js";

const router = express.Router();

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const newDestination = new Destination({
      name: req.body.name,
      description: req.body.description,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : "",
    });
    await newDestination.save();
    res.status(201).json(newDestination);
  } catch (error) {
    res.status(400).json({ error: "Failed to create destination" });
  }
});

// READ
router.get("/", async (req, res) => {
  try {
    const destinations = await Destination.find().sort({ createdAt: -1 });
    res.status(200).json(destinations);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      description: req.body.description,
    };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedDestination = await Destination.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );
    res.status(200).json(updatedDestination);
  } catch (error) {
    res.status(400).json({ error: "Failed to update destination" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Destination.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Destination deleted" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete destination" });
  }
});

export default router;
