const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Komyut AI Backend Running");
});

// Helper to create a WAV header for raw PCM data
function createWavBuffer(pcmBuffer, sampleRate = 24000, numChannels = 1, bitDepth = 16) {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcmBuffer.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size
  header.writeUInt16LE(1, 20);  // AudioFormat
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * numChannels * (bitDepth / 8), 28);
  header.writeUInt16LE(numChannels * (bitDepth / 8), 32);
  header.writeUInt16LE(bitDepth, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcmBuffer.length, 40);
  return Buffer.concat([header, pcmBuffer]);
}

/**
 * AI Commute Assistant Endpoint
 */
app.post("/api/ai/commute-info", async (req, res) => {
  const { origin, destination } = req.body;
  console.log(`[AI] Request: ${origin} -> ${destination}`);

  if (!origin || !destination) {
    return res.status(400).json({ error: "Origin and destination are required." });
  }

  const generateWithRetry = async (fn, retries = 2, delay = 1000) => {
    for (let i = 0; i <= retries; i++) {
      try {
        return await fn();
      } catch (err) {
        if (i === retries) throw err;
        console.warn(`[AI] Attempt ${i + 1} failed, retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  };

  try {
    // Step 1: Generate Text Advice
    const textModel = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });
    const textPrompt = `You are CommuteSmart AI. Provide a concise commute guide from "${origin}" to "${destination}" in clear English. No Tagalog, no markdown, no asterisks. Under 80 words.`;
    
    const textResult = await generateWithRetry(() => textModel.generateContent(textPrompt));
    const adviceText = textResult.response.text().replace(/\*/g, '');
    console.log(`[AI] Generated Text: ${adviceText.substring(0, 50)}...`);

    // Step 2: Generate Audio (Native TTS)
    let audioData = null;
    let mimeType = "audio/wav";

    try {
      const audioModel = genAI.getGenerativeModel({ model: "gemini-3.1-flash-tts-preview" });
      const audioResult = await generateWithRetry(() => audioModel.generateContent({
        contents: [{ parts: [{ text: adviceText }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: "Puck" },
            },
          },
        },
      }));

      const part = audioResult.response.candidates?.[0]?.content?.parts?.[0];
      if (part?.inlineData) {
        // Gemini returns raw PCM base64. Browsers need WAV.
        const rawPcmBase64 = part.inlineData.data;
        const pcmBuffer = Buffer.from(rawPcmBase64, "base64");
        
        // Wrap in WAV header (24kHz, 1 channel, 16-bit)
        const wavBuffer = createWavBuffer(pcmBuffer, 24000, 1, 16);
        audioData = wavBuffer.toString("base64");
        
        console.log(`[AI] Native Audio Generated & Converted to WAV (${audioData.length} bytes)`);
      } else {
        console.warn("[AI] Native TTS model returned no audio data.");
      }
    } catch (audioErr) {
      console.warn("[AI] Native TTS failed, falling back to text-only:", audioErr.message);
    }

    res.json({ 
      text: adviceText,
      audioData: audioData,
      mimeType: mimeType
    });

  } catch (error) {
    console.error("[AI] Fatal Error:", error.message);
    res.status(500).json({ error: "The AI is currently busy. Please try again in a moment." });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
