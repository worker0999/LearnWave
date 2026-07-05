import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { topic, difficulty, questionCount = 5 } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    // Initialize ZAI SDK
    const zai = await ZAI.create()

    // Create quiz generation prompt
    const difficultyLevel = difficulty === 'easy' ? 'basic' : difficulty === 'hard' ? 'advanced' : 'intermediate'

    const prompt = `Generate ${questionCount} multiple-choice questions about "${topic}" for ${difficultyLevel} level students.

For each question, provide:
1. The question
2. 4 options (A, B, C, D)
3. The correct answer (0-3)
4. A brief explanation

Format your response as a JSON array like this:
[
  {
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Explanation here"
  }
]

Make sure the questions are educational, clear, and appropriate for VTU students.`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert educational content creator. Generate high-quality quiz questions that are accurate and educational.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    const response = completion.choices[0]?.message?.content || '[]'

    // Parse the JSON response
    let questions
    try {
      questions = JSON.parse(response)
    } catch (parseError) {
      console.error('Failed to parse quiz questions:', parseError)
      // Return a default quiz if parsing fails
      questions = [
        {
          question: `What is the main concept of ${topic}?`,
          options: [
            "Option A - Basic definition",
            "Option B - Advanced concept",
            "Option C - Related theory",
            "Option D - Practical application"
          ],
          correctAnswer: 0,
          explanation: "This is a default question. Please try generating a new quiz."
        }
      ]
    }

    return NextResponse.json({ questions })

  } catch (error) {
    console.error('Quiz generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    )
  }
}
