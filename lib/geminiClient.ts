import { GoogleGenerativeAI } from "@google/generative-ai";

// Use a global variable to preserve the client across hot-reloads in development
const globalForGenAI = global as unknown as {
  genai: GoogleGenerativeAI | undefined;
};

export const getGenAIClient = () => {
  if (!globalForGenAI.genai) {
    console.log("Initializing Singleton Gemini Client...");
    globalForGenAI.genai = new GoogleGenerativeAI(
      process.env.GOOGLE_GENAI_API_KEY!
    );
  }
  return globalForGenAI.genai;
};
