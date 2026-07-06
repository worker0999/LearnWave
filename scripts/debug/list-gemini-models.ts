import { GoogleGenerativeAI } from '@google/generative-ai'

async function main() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set. Please set it in your environment or .env.local')
    process.exit(1)
  }

  const genAI = new GoogleGenerativeAI(apiKey)

  try {
    if (typeof (genAI as any).listModels === 'function') {
      const resp = await (genAI as any).listModels()
      console.log('Available models (via client.listModels()):')
      console.log(JSON.stringify(resp, null, 2))
    } else {
      console.log('Client does not expose listModels(); falling back to direct fetch to the REST API')
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
      const data = await res.json()
      console.log(JSON.stringify(data, null, 2))
    }
  } catch (err) {
    console.error('Failed to list models:', err)
    process.exit(2)
  }
}

main()
