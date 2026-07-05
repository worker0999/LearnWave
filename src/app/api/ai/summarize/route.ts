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

    const { text, length = 'medium' } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // Initialize ZAI SDK
    const zai = await ZAI.create()

    // Determine summary length
    let lengthInstruction = ''
    switch (length) {
      case 'short':
        lengthInstruction = 'Create a brief summary of 2-3 sentences.'
        break
      case 'long':
        lengthInstruction = 'Create a detailed summary of 2-3 paragraphs.'
        break
      default:
        lengthInstruction = 'Create a medium-length summary of 1 paragraph.'
    }

    const prompt = `Please summarize the following text for a VTU student. ${lengthInstruction}

Text to summarize:
"""
${text}
"""

Focus on the key concepts, main ideas, and important details. Make it easy to understand and retain.`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert at creating clear, concise summaries of academic content. Help students understand complex material quickly.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 800
    })

    const summary = completion.choices[0]?.message?.content || 'Unable to generate summary. Please try again.'

    return NextResponse.json({ summary })

  } catch (error) {
    console.error('Summarization error:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
}
