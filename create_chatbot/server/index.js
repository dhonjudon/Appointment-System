import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

let history = [];
const OLLAMA_BASE_URL = "http://localhost:11434";
const OLLAMA_MODEL = "llama3";

const isOllamaRunning = async () => {
  try {
    await axios.get(`${OLLAMA_BASE_URL}/api/tags`, { timeout: 1500 });
    return true;
  } catch {
    return false;
  }
};

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const ollamaRunning = await isOllamaRunning();
    if (!ollamaRunning) {
      return res.status(503).json({
        reply:
          "Ollama is not running right now. Please start Ollama and try again.",
        isNepali: false,
      });
    }

    history.push(`User: ${message}`);

    const prompt = `
You are a friendly assistant for a doctor appointment booking system in Nepal.

STRICT RULES:
- listen carefully if they are asking for suggestion and suggest doctors and specialist based on data from db
- Keep ALL responses under 3 sentences. Be concise. Unless question deemands ot be in detailed.
- If the user writes or speaks in Nepali (Devanagari script or Romanized Nepali), ALWAYS respond in Nepali.
- If the user writes in English, respond in English.
- You are based in Nepal. Know about Nepal's healthcare context: public hospitals (TUTH, Bir Hospital, Patan Hospital), private clinics, and common appointment booking steps.
- Help users: book appointments, find doctors, understand symptoms (briefly), and stay calm.
- Never give long explanations. If more info is needed, ask ONE short follow-up question.
- Be warm, calm, and helpful.

Conversation so far:
${history.join("\n")}
Assistant:`;

    const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
      model: OLLAMA_MODEL,
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.5,
        num_predict: 120, // hard cap on token output → shorter replies
      },
    });

    let reply = response.data.response.trim();

    // Trim to max 3 sentences as a safety net
    const sentences = reply.match(/[^।.!?]+[।.!?]+/g);
    if (sentences && sentences.length > 3) {
      reply = sentences.slice(0, 3).join(" ").trim();
    }

    history.push(`Assistant: ${reply}`);

    if (history.length > 12) {
      history = history.slice(-12);
    }

    // Detect if reply contains Nepali (Devanagari unicode range)
    const isNepali = /[\u0900-\u097F]/.test(reply);

    res.json({ reply, isNepali });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ reply: "Server error. Please try again.", isNepali: false });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
