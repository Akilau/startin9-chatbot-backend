import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
app.use(cors({
  origin: ["https://startin9.com", "http://localhost:3000"] // allow your domain + localhost
}));
app.use(express.json());

const GEMINI_API_URL = process.env.GEMINI_API_URL;
const API_KEY = process.env.GEMINI_API_KEY;

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) return res.status(400).json({ error: "No message provided" });

    const payload = {
      prompt: {
        text: userMessage
      }
    };

    const apiRes = await axios.post(GEMINI_API_URL, payload, {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      timeout: 20000
    });

    const reply = apiRes.data?.candidates?.[0]?.content?.[0]?.text || "Sorry, I couldn't generate a response.";
    res.json({ reply });

  } catch (err) {
    console.error("Gemini error:", err.response?.data || err.message);
    res.status(500).json({ reply: "Error contacting Gemini AI." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
