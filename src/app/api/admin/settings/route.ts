import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Get platform settings
    let settings = await db.platform_settings.findUnique({
      where: { id: 'global' }
    })

    // If it doesn't exist, create default
    if (!settings) {
      settings = await db.platform_settings.create({
        data: {
          id: 'global'
        }
      })
    }

    // Map to frontend structure
    const mappedSettings = {
      general: {
        platformName: settings.platform_name,
        platformDescription: settings.platform_description,
        maintenanceMode: settings.maintenance_mode,
        contactEmail: 'support@learnwave.com', // Defaults
        supportPhone: '+91 8012345678', // Defaults
        maintenanceMessage: 'Platform is under maintenance.' // Defaults
      },
      features: {
        aiAssistantEnabled: settings.ai_assistant_enabled,
        forumEnabled: settings.forum_enabled,
        resourcesEnabled: settings.resources_enabled,
        mentorshipEnabled: settings.mentorship_enabled,
        announcementsEnabled: settings.announcements_enabled
      }
    }

    return NextResponse.json({
      success: true,
      settings: mappedSettings
    })

  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { category, settings } = body

    if (!category || !settings) {
      return NextResponse.json(
        { error: 'Category and settings are required' },
        { status: 400 }
      )
    }

    const updateData: any = {}

    if (category === 'general') {
      if (settings.platformName !== undefined) updateData.platform_name = settings.platformName
      if (settings.platformDescription !== undefined) updateData.platform_description = settings.platformDescription
      if (settings.maintenanceMode !== undefined) updateData.maintenance_mode = settings.maintenanceMode
    } else if (category === 'features') {
      if (settings.aiAssistantEnabled !== undefined) updateData.ai_assistant_enabled = settings.aiAssistantEnabled
      if (settings.forumEnabled !== undefined) updateData.forum_enabled = settings.forumEnabled
      if (settings.resourcesEnabled !== undefined) updateData.resources_enabled = settings.resourcesEnabled
      if (settings.mentorshipEnabled !== undefined) updateData.mentorship_enabled = settings.mentorshipEnabled
      if (settings.announcementsEnabled !== undefined) updateData.announcements_enabled = settings.announcementsEnabled
    }

    if (Object.keys(updateData).length > 0) {
      await db.platform_settings.upsert({
        where: { id: 'global' },
        update: updateData,
        create: {
          id: 'global',
          ...updateData
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: `${category} settings updated successfully`
    })

  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
