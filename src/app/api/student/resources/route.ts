import { getTokenFromRequest } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const semester = searchParams.get('semester');
    const subject = searchParams.get('subject');
    const type = searchParams.get('type'); // notes, model, previous

    // Build query filters
    const where: any = {};
    if (semester) where.semester = parseInt(semester);
    if (subject) where.subject = { contains: subject, mode: 'insensitive' };
    if (type) where.type = type.toUpperCase();

    const resourcesList = await db.resources.findMany({
      where,
      orderBy: {
        created_at: 'desc'
      },
      include: {
        users: {
          select: {
            user_profiles: {
              select: {
                first_name: true,
                last_name: true
              }
            },
            role: true
          }
        }
      },
      take: 50
    });

    const formattedResources = resourcesList.map((resource: any) => ({
      id: resource.id,
      title: resource.title,
      description: resource.description,
      fileUrl: resource.fileUrl,
      fileSize: resource.fileSize,
      resourceType: resource.type,
      subject: {
        code: resource.subject,
        name: resource.subject,
        semester: resource.semester,
        credits: 4 // Mock credits as it's not in resources table
      },
      uploadedBy: resource.users?.user_profiles ? `${resource.users.user_profiles.first_name} ${resource.users.user_profiles.last_name}` : 'Staff',
      uploadedByRole: resource.users?.role || 'STAFF',
      downloads: 0, // Not available in current schema
      rating: 0,
      createdAt: resource.created_at
    }));

    return NextResponse.json({ resources: formattedResources });
  } catch (error) {
    console.error('Resources fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get subjects with resource counts
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { semester } = await req.json();

    const resources = await db.resources.findMany({
      where: semester ? { semester: parseInt(semester) } : {},
      select: {
        subject: true,
        type: true
      }
    });

    // Group by subject
    const subjectMap: Record<string, any> = {};
    resources.forEach((r: any) => {
      if (!subjectMap[r.subject]) {
        subjectMap[r.subject] = {
          code: r.subject,
          name: r.subject,
          semester: semester || 0,
          credits: 4,
          resources: { notes: 0, modelPapers: 0, previousPapers: 0 }
        };
      }

      const type = r.type.toLowerCase();
      if (type === 'notes') subjectMap[r.subject].resources.notes++;
      else if (type === 'model') subjectMap[r.subject].resources.modelPapers++;
      else if (type === 'previous') subjectMap[r.subject].resources.previousPapers++;
    });

    return NextResponse.json({ subjects: Object.values(subjectMap) });
  } catch (error) {
    console.error('Subjects fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
