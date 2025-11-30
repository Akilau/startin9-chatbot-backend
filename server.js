import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();

app.use(cors({
  origin: ["https://startin9.com", "http://localhost:3000"]
}));

app.use(express.json());

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const API_KEY = process.env.GROQ_API_KEY;

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: "No message provided" });
    }

    const payload = {
      model: "llama3-8b-8192",
      messages: [
        { role: "user", content: userMessage }
      ]
    };

    const apiRes = await axios.post(GROQ_API_URL, payload, {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const reply = apiRes.data.choices[0].message.content;
    res.json({ reply });

  } catch (err) {
    console.error("Groq error full:", err.response?.data || err.message);
    res.status(500).json({ reply: "Error contacting Groq AI." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
