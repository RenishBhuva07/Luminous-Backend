import { geminiClient } from "./gemini.client.js";

// Common Gemini models:
// const MODEL = "gemini-2.5-flash";
// const MODEL = "gemini-flash-latest";
// const MODEL = "gemini-flash-lite-latest";
// const MODEL = "gemini-pro-latest";
// const MODEL = "gemini-2.5-flash-lite";
// const MODEL = "gemini-2.5-flash-image";
// const MODEL = "gemini-3.1-flash-lite";
// const MODEL = "gemini-3-pro-image";
// const MODEL = "gemini-3.1-flash-image";
// const MODEL = "gemini-3.1-flash-lite-image";
const MODEL = "gemini-3.5-flash";
// const MODEL = "gemini-3.5-flash-lite";
// const MODEL = "gemini-omni-flash-preview";
// const MODEL = "gemini-omni-1.1-flash";
// const MODEL = "gemini-3.5-transcribe";
// const MODEL = "gemini-3.6-flash";
// const MODEL = "gemini-3.7-flash";
// const MODEL = "gemini-3.8-flash";
// const MODEL = "gemini-3.1-flash-tts-preview";
// const MODEL = "gemini-3.8-flash-tts";
// const MODEL = "gemini-3.8-flash-lite-tts";
// const MODEL = "gemini-2.5-flash-native-audio-latest";
// const MODEL = "gemini-2.5-flash-native-audio-preview-09-2025";
// const MODEL = "gemini-2.5-flash-native-audio-preview-12-2025";
// const MODEL = "gemini-3.1-flash-live-preview";
// const MODEL = "gemini-3.8-live";
// const MODEL = "gemini-3.8-live-extended-thinking";
// const MODEL = "gemini-robotics-er-2-streaming-preview";
// const MODEL = "gemini-3.5-live-translate-preview";
// const MODEL = "gemini-flash-latest";

export async function generateAIResponse(message: string): Promise<string> {
  const response = await geminiClient.models.generateContent({
    model: MODEL,
    contents: message,
  });

  return response.text ?? "";
}
