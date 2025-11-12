import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { aiManager } from '@/lib/ai-config'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { message, context } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Create system prompt based on context
    let systemPrompt = `You are an AI academic assistant for VTU students. You are helpful, knowledgeable, and provide accurate educational information. `
    
    switch (context) {
      case 'academic_help':
        systemPrompt += `You specialize in helping students with their studies, homework, and exam preparation. Provide clear, step-by-step explanations and be encouraging.`
        break
      case 'doubt_solver':
        systemPrompt += `You are a doubt solver. Help students understand concepts, solve problems, and clarify their questions. Be patient and thorough.`
        break
      default:
        systemPrompt += `You help students with various academic tasks including learning, problem-solving, and assignment guidance.`
    }

  // Use singleton aiManager (Gemini-only)
    let response: string
    try {
      const result = await aiManager.generateWithFallback([
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: message
        }
      ], {
        temperature: 0.7,
        max_tokens: 1000
      })
      response = result.response
    } catch (aiError) {
      console.error('AI generation failed with all providers:', aiError)
      return NextResponse.json(
        { error: 'AI service temporarily unavailable. Please ensure GEMINI_API_KEY is set or .z-ai-config is properly configured.' },
        { status: 503 }
      )
    }

    return NextResponse.json({ response })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}