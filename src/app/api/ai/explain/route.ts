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

    const { problem, type = 'detailed' } = await request.json()

    if (!problem) {
      return NextResponse.json({ error: 'Problem is required' }, { status: 400 })
    }

    // Initialize ZAI SDK
    const zai = await ZAI.create()

    // Create explanation prompt based on type
    let explanationPrompt = ''
    switch (type) {
      case 'simple':
        explanationPrompt = 'Explain this in simple terms that anyone can understand. Use everyday language and avoid jargon.'
        break
      case 'step-by-step':
        explanationPrompt = 'Provide a step-by-step explanation. Break it down into clear, numbered steps with explanations for each step.'
        break
      case 'examples':
        explanationPrompt = 'Explain this concept and provide real-world examples to help illustrate the concept.'
        break
      default:
        explanationPrompt = 'Provide a detailed explanation that covers all important aspects of this concept or problem.'
    }

    const prompt = `Please explain the following problem or concept for a VTU student.

${explanationPrompt}

Problem/Concept to explain:
"""
${problem}
"""

Make sure your explanation is:
- Clear and easy to follow
- Accurate and educational
- Helpful for understanding the core concepts
- Suitable for university-level students`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert teacher who can explain complex concepts in ways that students can easily understand. You are patient, thorough, and always provide educational value.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.6,
      max_tokens: 1500
    })

    const explanation = completion.choices[0]?.message?.content || 'Unable to generate explanation. Please try again.'

    return NextResponse.json({ explanation })

  } catch (error) {
    console.error('Explanation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate explanation' },
      { status: 500 }
    )
  }
}
