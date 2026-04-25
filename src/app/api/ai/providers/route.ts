import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { aiManager } = await import('@/lib/ai-config')
    
    const providers = aiManager.getAvailableProviders()
    const currentProvider = aiManager.getCurrentProvider()

    return NextResponse.json({
      providers,
      currentProvider,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('AI Providers API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to get AI providers',
        message: error.message || 'An unexpected error occurred'
      },
      { status: 500 }
    )
  }
}
