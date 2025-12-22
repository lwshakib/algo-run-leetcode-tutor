import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const getGoogleModel = (apiKey: string) => {
  const gemini = createGoogleGenerativeAI({
    apiKey: apiKey,
  });

  return gemini("gemini-2.5-flash-lite");
};
