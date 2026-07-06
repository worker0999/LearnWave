import { GoogleGenerativeAI } from '@google/generative-ai'

async function main() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set. Please set it in your environment or .env.local')
    process.exit(1)
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  // Use a modern default model that is commonly available; you can override with GEMINI_MODEL
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash'

  try {
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 300
      }
    })

    const prompt = `You are a helpful assistant. Say hi in one short friendly sentence.`
    const result = await model.generateContent(prompt)
    const response = await result.response
    console.log('== Gemini response ==')
    console.log(await response.text())
  } catch (err) {
    console.error('Gemini test failed:', err)
    process.exit(2)
  }
}

main()
