import { GoogleGenerativeAI } from '@google/generative-ai'

export interface AIProvider {
  name: string
  type: 'gemini' | 'zai'
  generateResponse(messages: any[], options?: any): Promise<string>
}

export class GeminiProvider implements AIProvider {
  name = 'Gemini'
  type = 'gemini' as const
  private genAI: GoogleGenerativeAI

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey)
  }

  async generateResponse(messages: any[], options: any = {}): Promise<string> {
    try {
      // Use a known reliable Gemini model
      if (!(this as any)._cachedModelName) {
        // List of Gemini models known to support generateContent in v1beta API (ordered by preference)
        const candidateModels = [
          'gemini-2.0-flash',
          'gemini-1.5-flash',
          'gemini-1.5-pro',
          'gemini-pro',
          'gemini-1.0-pro'
        ]
        
        // Try each model in sequence only when actually generating content (lazy initialization)
        // For now, pick the first one and test it on first actual use
        (this as any)._candidateModels = candidateModels
        (this as any)._currentCandidateIndex = 0
        (this as any)._cachedModelName = candidateModels[0]
      }

      let modelName = (this as any)._cachedModelName
      console.log('Using Gemini model:', modelName)
      
      try {
        const model = this.genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: options.temperature || 0.7,
            topP: options.top_p || 0.9,
            maxOutputTokens: options.max_tokens || 1000,
          }
        })

        // Convert messages to Gemini format
        const geminiMessages = this.convertToGeminiFormat(messages)

        const result = await model.generateContent(geminiMessages)
        const response = await result.response
        console.log(`✓ Model ${modelName} succeeded`)
        return response.text()
      } catch (modelError) {
        // If this model fails, try next candidate
        const candidates = (this as any)._candidateModels || []
        const index = ((this as any)._currentCandidateIndex || 0) + 1
        
        if (index < candidates.length) {
          console.log(`✗ Model ${modelName} failed, trying next...`)
          (this as any)._currentCandidateIndex = index
          (this as any)._cachedModelName = candidates[index]
          // Retry with new model
          return this.generateResponse(messages, options)
        } else {
          // No more candidates
          const errMsg = modelError instanceof Error ? modelError.message : String(modelError)
          console.error(`All models exhausted. Last error: ${errMsg}`)
          throw modelError
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error('Gemini API Error:', message)
      throw new Error(`Gemini API Error: ${message}`)
    }
  }

  private convertToGeminiFormat(messages: any[]): string {
    // Combine all messages into a single prompt for Gemini
    let prompt = ''
    messages.forEach(msg => {
      if (msg.role === 'system') {
        prompt += `System: ${msg.content}\n\n`
      } else if (msg.role === 'user') {
        prompt += `User: ${msg.content}\n\n`
      } else if (msg.role === 'assistant') {
        prompt += `Assistant: ${msg.content}\n\n`
      }
    })
    return prompt
  }
}

// ZAI integration removed to simplify AI stack; this file now focuses on Gemini (Google Generative AI).

export class AIManager {
  private providers: Map<string, AIProvider> = new Map()
  private currentProvider: string = 'gemini' // Default to Gemini

  constructor() {
    // Initialize providers based on available config (Gemini only)
    const geminiApiKey = process.env.GEMINI_API_KEY
    if (geminiApiKey) {
      console.log('Initializing Gemini provider...')
      this.providers.set('gemini', new GeminiProvider(geminiApiKey))
      this.currentProvider = 'gemini'
      console.log('✓ Gemini provider registered')
    } else {
      // No provider available; keep providers empty and let callers handle the error
      console.warn('No GEMINI_API_KEY found; AI features will be disabled')
    }
  }

  setProvider(providerName: string) {
    if (this.providers.has(providerName)) {
      this.currentProvider = providerName
    } else {
      throw new Error(`Provider ${providerName} not found`)
    }
  }

  getCurrentProvider(): string {
    return this.currentProvider
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys())
  }

  async generateResponse(messages: any[], options: any = {}): Promise<string> {
    const provider = this.providers.get(this.currentProvider)
    if (!provider) {
      throw new Error(`No provider found: ${this.currentProvider}`)
    }
    
    return provider.generateResponse(messages, options)
  }

  async generateWithFallback(messages: any[], options: any = {}): Promise<{ response: string; provider: string }> {
    const providers = this.getAvailableProviders()
    
    for (const providerName of providers) {
      try {
        this.setProvider(providerName)
        const response = await this.generateResponse(messages, options)
        return { response, provider: providerName }
      } catch (error) {
        console.error(`Provider ${providerName} failed:`, error)
        continue
      }
    }
    
    throw new Error('All AI providers failed')
  }
}

// Singleton instance
export const aiManager = new AIManager()

// Helper functions for specific use cases
export async function generateChatResponse(message: string, conversationHistory: any[] = []) {
  const messages = [
    {
      role: 'system',
      content: `You are an AI Academic Assistant for VTU (Visvesvaraya Technological University) students. Your role is to help with:

1. **Study Materials**: Summarize notes, explain concepts, provide examples
2. **Practice Quizzes**: Generate relevant questions for any subject
3. **Doubt Solving**: Clear academic doubts with clear explanations
4. **Assignment Help**: Provide guidance and approaches for assignments
5. **Exam Preparation**: Suggest study strategies and important topics

Guidelines:
- Be friendly, encouraging, and professional
- Provide clear, step-by-step explanations
- Use examples and analogies when helpful
- For programming questions, include code examples
- Encourage critical thinking and problem-solving
- Keep responses concise but comprehensive
- Use markdown formatting for better readability
- Include relevant emojis to make learning engaging

Focus on VTU curriculum subjects like:
- Computer Science & Engineering
- Information Science & Engineering
- Electronics & Communication
- Mechanical Engineering
- Civil Engineering
- Electrical & Electronics

Always maintain academic integrity and promote genuine learning.`
    },
    ...conversationHistory,
    {
      role: 'user',
      content: message
    }
  ]

  const result = await aiManager.generateWithFallback(messages, {
    temperature: 0.7,
    max_tokens: 1000,
    top_p: 0.9,
    frequency_penalty: 0.5,
    presence_penalty: 0.5
  })

  return result
}

export async function generateQuizQuestions(subject: string, topic: string, difficulty: string, questionCount: number) {
  const prompt = `Generate ${questionCount} multiple choice questions for ${subject} - ${topic} at ${difficulty} difficulty level.

For each question, provide:
1. A clear question statement
2. 4 options (A, B, C, D)
3. The correct answer number (0-3)
4. A detailed explanation

Format the response as a JSON array with the following structure:
[
  {
    "id": "1",
    "question": "question text",
    "options": ["option A", "option B", "option C", "option D"],
    "correctAnswer": 0,
    "explanation": "detailed explanation",
    "difficulty": "${difficulty}",
    "subject": "${subject}",
    "topic": "${topic}"
  }
]

Requirements:
- Questions should be appropriate for VTU (Visvesvaraya Technological University) curriculum
- Difficulty level: ${difficulty} (easy: basic concepts, medium: application, hard: complex problem-solving)
- All options should be plausible but only one correct answer
- Explanations should be educational and help students understand the concept
- Cover different aspects of the topic
- Make questions practical and relevant to exams`

  const messages = [
    {
      role: 'system',
      content: 'You are an expert educational content creator specializing in VTU curriculum. Generate high-quality, accurate multiple-choice questions that help students learn and prepare for exams.'
    },
    {
      role: 'user',
      content: prompt
    }
  ]

  const result = await aiManager.generateWithFallback(messages, {
    temperature: 0.7,
    max_tokens: 2000,
    top_p: 0.9,
    frequency_penalty: 0.5,
    presence_penalty: 0.5
  })

  return result
}

export async function summarizeNotes(content: string, subject: string, topic: string) {
  const prompt = `Please summarize the following ${subject} notes on ${topic}. Create a comprehensive yet concise summary that:

1. **Main Concepts**: Extract and explain the key concepts
2. **Important Points**: Highlight crucial information for exams
3. **Examples**: Include relevant examples if mentioned
4. **Study Tips**: Add suggestions for remembering the material

Content to summarize:
${content}

Format the summary with:
- Clear headings and bullet points
- Bold important terms
- Include relevant emojis for better engagement
- Keep it structured and easy to review`

  const messages = [
    {
      role: 'system',
      content: 'You are an expert academic summarizer specializing in VTU curriculum. Create clear, concise, and helpful summaries that help students study effectively.'
    },
    {
      role: 'user',
      content: prompt
    }
  ]

  const result = await aiManager.generateWithFallback(messages, {
    temperature: 0.6,
    max_tokens: 1500,
    top_p: 0.9,
    frequency_penalty: 0.3,
    presence_penalty: 0.3
  })

  return result
}

export async function explainConcept(concept: string, subject: string, context?: string) {
  const prompt = `Please explain the concept of "${concept}" in ${subject}${context ? ` within the context of: ${context}` : ''}.

Your explanation should:
1. **Simple Definition**: Start with a clear, easy-to-understand definition
2. **Detailed Explanation**: Break down the concept into understandable parts
3. **Real-world Examples**: Provide practical examples or analogies
4. **Visual Description**: Suggest diagrams or visual aids if helpful
5. **Common Mistakes**: Highlight common misconceptions
6. **Exam Tips**: Mention what's important for exams

Make it engaging and suitable for VTU students. Use markdown formatting, emojis, and clear structure.`

  const messages = [
    {
      role: 'system',
      content: 'You are an expert teacher specializing in VTU curriculum. Explain complex concepts in a simple, engaging, and comprehensive way.'
    },
    {
      role: 'user',
      content: prompt
    }
  ]

  const result = await aiManager.generateWithFallback(messages, {
    temperature: 0.7,
    max_tokens: 1200,
    top_p: 0.9,
    frequency_penalty: 0.4,
    presence_penalty: 0.4
  })

  return result
}