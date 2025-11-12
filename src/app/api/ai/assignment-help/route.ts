import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import ZAI from 'z-ai-web-dev-sdk'

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

    const { topic, type = 'essay' } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    // Initialize ZAI SDK
    const zai = await ZAI.create()

    // Create assignment help prompt based on type
    let typePrompt = ''
    switch (type) {
      case 'essay':
        typePrompt = 'Provide an essay outline, key points to cover, suggested structure, and thesis statement ideas.'
        break
      case 'research':
        typePrompt = 'Provide research methodology suggestions, key areas to investigate, potential sources, and structure for a research paper.'
        break
      case 'presentation':
        typePrompt = 'Provide presentation structure, key slides to include, talking points, and visual suggestions.'
        break
      case 'report':
        typePrompt = 'Provide report structure, sections to include, key findings to highlight, and professional formatting tips.'
        break
      case 'case-study':
        typePrompt = 'Provide case study analysis framework, key questions to address, and suggested approach.'
        break
      case 'proposal':
        typePrompt = 'Provide project proposal structure, objectives, methodology, timeline, and evaluation criteria.'
        break
      default:
        typePrompt = 'Provide comprehensive guidance for this assignment type.'
    }

    const prompt = `Help a VTU student with their assignment on "${topic}". This is for a ${type}.

${typePrompt}

Please provide:
1. A clear structure/outline
2. Key points and concepts to cover
3. Suggestions for research or content development
4. Tips for successful completion
5. Common pitfalls to avoid

Make sure your guidance is:
- Educational and helpful
- Specific to the topic
- Practical and actionable
- Appropriate for university-level work

IMPORTANT: This is meant to be a guide and starting point. The student should use their own analysis and writing.`

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an academic advisor helping students with their assignments. Provide helpful guidance while encouraging original work and critical thinking.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    const help = completion.choices[0]?.message?.content || 'Unable to generate assignment help. Please try again.'

    return NextResponse.json({ help })

  } catch (error) {
    console.error('Assignment help error:', error)
    return NextResponse.json(
      { error: 'Failed to generate assignment help' },
      { status: 500 }
    )
  }
}