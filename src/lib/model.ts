import { createGoogleGenerativeAI } from '@ai-sdk/google';

/**
 * Helper function to initialize and return a Gemini AI model instance.
 * It uses the '@ai-sdk/google' provider to create a model configured with the user's API key.
 */
export const getGoogleModel = (apiKey: string) => {
  // Create a Generative AI instance for Google (Gemini)
  const gemini = createGoogleGenerativeAI({
    apiKey: apiKey,
  });

  // Return the specific model version to be used for tutoring
  // 'gemini-2.5-flash-lite' is chosen for its balance of speed and efficiency.
  return gemini('gemini-2.5-flash-lite');
};
