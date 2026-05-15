import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { awardXP } from '@/lib/xp-engine';
import { ActionType } from '@/lib/xp-config';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let userId: string;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { action, metadata } = await req.json();
    
    if (!action) {
      return NextResponse.json({ error: 'Action type is required' }, { status: 400 });
    }

    const result = await awardXP(userId, action as ActionType, metadata);

    return NextResponse.json(result);
  } catch (error) {
    console.error('XP award API error:', error);
    return NextResponse.json({ 
      error: 'Failed to award XP',
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
