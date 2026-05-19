import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.send("Komyut AI Backend Running");
});

/* ROUTES */
app.use("/api/auth", authRoutes);

/* PORT */
const PORT = process.env.PORT || 5001;

/* START SERVER */
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("MongoDB Connected");
    });

  } catch (error) {
    console.error("Server failed to start:");
    console.error(error);
  }
};

startServer();