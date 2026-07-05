import { getTokenFromRequest } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Since forumPost model doesn't exist in current schema, we'll return mock data for now
        // to keep the frontend working while the user decides on the schema.
        const mockPosts = [
            {
                id: '1',
                author: 'Anya Sharma',
                role: 'STUDENT',
                avatar: 'AS',
                content: 'Just finished the Module 5 notes for Data Structures. They are really helpful! Check them out in the Resource Hub.',
                likes: 12,
                comments: 3,
                time: '2 hours ago',
                tags: ['resource', 'dsa']
            },
            {
                id: '2',
                author: 'Rahul Verma',
                role: 'STUDENT',
                avatar: 'RV',
                content: 'Does anyone have the model papers for Operating Systems? The exams are approaching.',
                likes: 5,
                comments: 7,
                time: '5 hours ago',
                tags: ['exam', 'os']
            }
        ];

        return NextResponse.json({ posts: mockPosts });
    } catch (error) {
        console.error('Community posts fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
