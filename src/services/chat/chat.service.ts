import { generateAIResponse } from "../ai/gemini.service.js";

export async function sendChatMessage(message: string) {
  const response = await generateAIResponse(message);

  return {
    role: "assistant",
    content: response,
  };
}
