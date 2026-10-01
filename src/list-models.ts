import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY as string,
});

async function listModels() {
  const models = await ai.models.list();

  for await (const model of models) {
    console.log("Model:", model.name);
    console.log("Supported actions:", model.supportedActions);
    console.log("--------------------------------");
  }
}

listModels().catch(console.error);
