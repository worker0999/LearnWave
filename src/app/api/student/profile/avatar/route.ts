import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { mkdir, writeFile, readdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(req: NextRequest) {
    try {
        // Get token from Authorization header
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

        // Parse FormData
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Validate image mimetype
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Uploaded file is not an image' }, { status: 400 });
        }

        // Determine extension
        const originalName = file.name || 'avatar.jpg';
        const fileExtension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
        
        // 📁 Ensure uploads/avatars folder exists in public/
        const avatarsDir = join(process.cwd(), 'public', 'uploads', 'avatars');
        await mkdir(avatarsDir, { recursive: true });

        // Cleanup old avatars for this user to save space
        try {
            if (existsSync(avatarsDir)) {
                const files = await readdir(avatarsDir);
                for (const filename of files) {
                    if (filename.startsWith(userId + '_')) {
                        await unlink(join(avatarsDir, filename)).catch(() => {});
                    }
                }
            }
        } catch (err) {
            console.error('Failed to clean up old avatars:', err);
        }

        // Save new file
        const timestamp = Date.now();
        const newFileName = `${userId}_${timestamp}.${fileExtension}`;
        const filePath = join(avatarsDir, newFileName);

        const bytes = await file.arrayBuffer();
        await writeFile(filePath, Buffer.from(bytes));

        const avatarUrl = `/uploads/avatars/${newFileName}`;

        // Update database user_profiles
        await db.user_profiles.upsert({
            where: { user_id: userId },
            update: {
                avatar_url: avatarUrl
            },
            create: {
                user_id: userId,
                first_name: 'User',
                last_name: '',
                avatar_url: avatarUrl
            }
        });

        return NextResponse.json({
            success: true,
            avatarUrl
        });
    } catch (error) {
        console.error('Avatar upload error:', error);
        return NextResponse.json({
            error: 'Failed to upload avatar',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
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

        // Remove old avatar files
        const avatarsDir = join(process.cwd(), 'public', 'uploads', 'avatars');
        try {
            if (existsSync(avatarsDir)) {
                const files = await readdir(avatarsDir);
                for (const filename of files) {
                    if (filename.startsWith(userId + '_')) {
                        await unlink(join(avatarsDir, filename)).catch(() => {});
                    }
                }
            }
        } catch (err) {
            console.error('Failed to delete avatar files:', err);
        }

        // Update database to null
        await db.user_profiles.update({
            where: { user_id: userId },
            data: {
                avatar_url: null
            }
        });

        return NextResponse.json({
            success: true,
            avatarUrl: null
        });
    } catch (error) {
        console.error('Avatar delete error:', error);
        return NextResponse.json({
            error: 'Failed to delete avatar',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
