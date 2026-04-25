import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Standard resources table has a type field
        const circulars = await db.resources.findMany({
            where: {
                type: 'CIRCULAR'
            },
            orderBy: {
                created_at: 'desc'
            },
            take: 20,
            select: {
                id: true,
                title: true,
                description: true,
                fileUrl: true,
                fileSize: true,
                created_at: true,
            }
        });

        // Format for consistent UI
        const formattedCirculars = circulars.map((c: any) => ({
            id: c.id,
            title: c.title,
            category: 'Official',
            fileUrl: c.fileUrl,
            fileSize: c.fileSize,
            createdAt: c.created_at,
        }));

        return NextResponse.json({ circulars: formattedCirculars });
    } catch (error) {
        console.error('Circulars fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
