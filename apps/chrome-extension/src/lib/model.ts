import { createGoogleGenerativeAI } from "@ai-sdk/google"

/**
 * Helper function to initialize and return a Gemini AI model instance.
 * It uses the '@ai-sdk/google' provider to create a model configured with the user's API key.
 */
export const getGoogleModel = (
  apiKey: string,
  modelName: string = "gemini-2.0-flash"
) => {
  // Create a Generative AI instance for Google (Gemini)
  const gemini = createGoogleGenerativeAI({
    apiKey: apiKey,
  })

  // Return the specific model version to be used for tutoring
  return gemini(modelName)
}
