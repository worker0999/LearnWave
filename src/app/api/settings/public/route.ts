import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const settings = await db.platform_settings.findUnique({
      where: { id: 'global' },
      select: {
        maintenance_mode: true,
      }
    })

    return NextResponse.json({
      maintenanceMode: settings?.maintenance_mode || false
    })
  } catch (error) {
    // Fail open if database is down
    return NextResponse.json({ maintenanceMode: false })
  }
}
