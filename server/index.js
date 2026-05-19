import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

/* MIDDLEWARE */
// CRITICAL: Ensure cors allows credentials if your authRoutes use httpOnly cookies!
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.send("Komyut AI Backend Running");
});

/* AUTH ROUTES */
app.use("/api/auth", authRoutes);

/* --- AI COMMUTE ASSISTANT --- */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper to create a WAV header for raw PCM data
function createWavBuffer(
  pcmBuffer,
  sampleRate = 24000,
  numChannels = 1,
  bitDepth = 16,
) {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcmBuffer.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size
  header.writeUInt16LE(1, 20); // AudioFormat
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * numChannels * (bitDepth / 8), 28);
  header.writeUInt16LE(numChannels * (bitDepth / 8), 32);
  header.writeUInt16LE(bitDepth, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcmBuffer.length, 40);
  return Buffer.concat([header, pcmBuffer]);
}

app.post("/api/ai/commute-info", async (req, res) => {
  const { origin, destination, prompt, routeContext } = req.body;
  console.log(`[AI] Request: ${origin} -> ${destination} | Prompt: ${prompt}`);

  if (!origin || !destination) {
    return res
      .status(400)
      .json({ error: "Origin and destination are required." });
  }

  const generateWithRetry = async (fn, retries = 2, delay = 1000) => {
    for (let i = 0; i <= retries; i++) {
      try {
        return await fn();
      } catch (err) {
        if (i === retries) throw err;
        console.warn(`[AI] Attempt ${i + 1} failed, retrying in ${delay}ms...`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  };

  try {
    // Step 1: Generate Text Advice
    const textModel = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
    });

    // Dynamically use the prompt from the frontend if provided
    const userQuestion = prompt || "Provide a concise commute guide.";
    const textPrompt = `You are CommuteSmart AI. The user is traveling from "${origin}" to "${destination}".
    Route data: ${routeContext || "No route selected."}
    User asks: "${userQuestion}"
    Provide a concise, helpful answer. Clear English. No Tagalog, no markdown, no asterisks. Under 80 words.`;

    const textResult = await generateWithRetry(() =>
      textModel.generateContent(textPrompt),
    );
    const adviceText = textResult.response.text().replace(/\*/g, "");
    console.log(`[AI] Generated Text: ${adviceText.substring(0, 50)}...`);

    // Step 2: Generate Audio (Native TTS)
    let audioData = null;
    let mimeType = "audio/wav";

    try {
      const audioModel = genAI.getGenerativeModel({
        model: "gemini-3.1-flash-tts-preview",
      });
      const audioResult = await generateWithRetry(() =>
        audioModel.generateContent({
          contents: [{ parts: [{ text: adviceText }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: "Puck" },
              },
            },
          },
        }),
      );

      const part = audioResult.response.candidates?.[0]?.content?.parts?.[0];
      if (part?.inlineData) {
        const rawPcmBase64 = part.inlineData.data;
        const pcmBuffer = Buffer.from(rawPcmBase64, "base64");
        const wavBuffer = createWavBuffer(pcmBuffer, 24000, 1, 16);
        audioData = wavBuffer.toString("base64");
        console.log(
          `[AI] Native Audio Generated & Converted to WAV (${audioData.length} bytes)`,
        );
      }
    } catch (audioErr) {
      console.warn(
        "[AI] Native TTS failed, falling back to text-only:",
        audioErr.message,
      );
    }

    res.json({
      text: adviceText,
      audioData: audioData,
      mimeType: mimeType,
    });
  } catch (error) {
    console.error("[AI] Fatal Error:", error.message);
    res.status(500).json({
      error: "The AI is currently busy. Please try again in a moment.",
    });
  }
});

/* PORT */
const PORT = process.env.PORT || 5001;

/* START SERVER */
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:");
    console.error(error);
  }
};

startServer();
