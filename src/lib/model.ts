import { createGoogleGenerativeAI } from "@ai-sdk/google"

export const getGoogleModel = () => {
    const gemini = createGoogleGenerativeAI({
        apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    })

    return gemini('gemini-2.5-flash')
}
