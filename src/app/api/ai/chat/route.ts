import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import { aiManager } from '@/lib/ai-config';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');
    const authHeader = req.headers.get('authorization');

    let token: string | undefined;

    if (tokenCookie) {
      token = tokenCookie.value;
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const { messages, feature } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    // Get system prompt based on feature
    const systemPrompts: Record<string, string> = {
      'smart-tutor': 'You are a helpful AI tutor for VTU (Visvesvaraya Technological University) students. Provide clear, educational explanations with examples. Focus on computer science and engineering topics. Be encouraging and patient.',
      'content-generator': 'You are an AI that generates study materials, summaries, and notes for VTU students. Create well-structured, comprehensive content that helps students learn effectively.',
      'qa-assistant': 'You are a Q&A assistant for VTU students. Provide concise, accurate answers to questions about computer science, engineering, and academic topics. Include relevant examples when helpful.',
      'summarizer': 'You are a text summarizer for students. Create concise, well-organized summaries that capture the key points of provided content. Use bullet points and clear structure.'
    };

    const systemPrompt = systemPrompts[feature] || systemPrompts['smart-tutor'];

    // Prepare messages for AI Manager
    const aiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    try {
      const result = await aiManager.generateWithFallback(aiMessages, {
        temperature: 0.7,
        max_tokens: 1000,
      });

      return NextResponse.json({
        response: result.response,
        feature
      });
    } catch (error) {
      console.error('AI Manager error:', error);
      throw error;
    }



  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json({
      error: 'Failed to generate response',
      response: 'I apologize, but I encountered an error. Please try again or rephrase your question.'
    }, { status: 500 });
  }
}
