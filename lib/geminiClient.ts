import { GoogleGenAI } from "@google/genai";

// Use a global variable to preserve the client across hot-reloads in development
const globalForGenAI = global as unknown as {
  genai: GoogleGenAI | undefined;
};

export const getGenAIClient = () => {
  if (!globalForGenAI.genai) {
    console.log("Initializing Singleton Gemini Client...");
    globalForGenAI.genai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
    });
  }
  return globalForGenAI.genai;
};
