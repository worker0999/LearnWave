'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { 
  Settings, 
  Shield,
  Mail,
  CreditCard,
  Users,
  Globe,
  Smartphone,
  Database,
  Key,
  RefreshCw,
  Save,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  Lock,
  Bell,
  Palette,
  Star,
  Megaphone
} from 'lucide-react'

interface PlatformSettings {
  general: {
    platformName: string
    platformDescription: string
    contactEmail: string
    supportPhone: string
    maintenanceMode: boolean
    maintenanceMessage: string
  }
  email: {
    smtpHost: string
    smtpPort: number
    smtpUser: string
    smtpPassword: string
    emailFrom: string
    emailNotifications: boolean
  }
  payment: {
    razorpayKeyId: string
    razorpayKeySecret: string
    paymentEnabled: boolean
    mentorCommission: number
    minimumSessionAmount: number
  }
  security: {
    sessionTimeout: number
    maxLoginAttempts: number
    passwordMinLength: number
    twoFactorAuth: boolean
    ipWhitelist: string[]
  }
  features: {
    aiAssistantEnabled: boolean
    forumEnabled: boolean
    resourcesEnabled: boolean
    mentorshipEnabled: boolean
    announcementsEnabled: boolean
  }
}

export default function AdminSettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)
  const [settings, setSettings] = useState<PlatformSettings>({
    general: {
      platformName: 'LearnWave',
      platformDescription: 'AI-Powered Academic Support Platform for VTU Students',
      contactEmail: 'support@learnwave.com',
      supportPhone: '+91 8012345678',
      maintenanceMode: false,
      maintenanceMessage: 'Platform is under maintenance. Please try again later.'
    },
    email: {
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      emailFrom: 'noreply@learnwave.com',
      emailNotifications: true
    },
    payment: {
      razorpayKeyId: '',
      razorpayKeySecret: '',
      paymentEnabled: true,
      mentorCommission: 10,
      minimumSessionAmount: 100
    },
    security: {
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      twoFactorAuth: false,
      ipWhitelist: []
    },
    features: {
      aiAssistantEnabled: true,
      forumEnabled: true,
      resourcesEnabled: true,
      mentorshipEnabled: true,
      announcementsEnabled: true
    }
  })

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings || settings)
      } else {
        toast({
          title: "Info",
          description: "Using default settings",
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async (category: keyof PlatformSettings) => {
    setSaving(category)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category,
          settings: settings[category]
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `${category.charAt(0).toUpperCase() + category.slice(1)} settings saved successfully`,
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to save settings",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      })
    } finally {
      setSaving(null)
    }
  }

  const updateSetting = (category: keyof PlatformSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
  }

  useEffect(() => {
    if (user) {
      fetchSettings()
    }
  }, [user])

  return (
    <DashboardLayout userRole="ADMIN">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Platform Settings</h1>
            <p className="text-purple-200">Configure platform settings and preferences</p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => fetchSettings()}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 text-purple-300 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* General Settings */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-blue-400" />
                  General Settings
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Basic platform configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Platform Name</label>
                    <Input
                      value={settings.general.platformName}
                      onChange={(e) => updateSetting('general', 'platformName', e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Contact Email</label>
                    <Input
                      type="email"
                      value={settings.general.contactEmail}
                      onChange={(e) => updateSetting('general', 'contactEmail', e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Platform Description</label>
                  <Textarea
                    value={settings.general.platformDescription}
                    onChange={(e) => updateSetting('general', 'platformDescription', e.target.value)}
                    className="bg-white/10 border-white/20 text-white min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Support Phone</label>
                    <Input
                      value={settings.general.supportPhone}
                      onChange={(e) => updateSetting('general', 'supportPhone', e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.general.maintenanceMode}
                      onCheckedChange={(checked) => updateSetting('general', 'maintenanceMode', checked)}
                    />
                    <label className="text-white text-sm">Maintenance Mode</label>
                    {settings.general.maintenanceMode && (
                      <Badge className="bg-orange-500">Active</Badge>
                    )}
                  </div>
                </div>

                {settings.general.maintenanceMode && (
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Maintenance Message</label>
                    <Textarea
                      value={settings.general.maintenanceMessage}
                      onChange={(e) => updateSetting('general', 'maintenanceMessage', e.target.value)}
                      className="bg-white/10 border-white/20 text-white min-h-[60px]"
                    />
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    onClick={() => saveSettings('general')}
                    disabled={saving === 'general'}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {saving === 'general' ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save General Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Email Settings */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-green-400" />
                  Email Settings
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Configure email notifications and SMTP settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">SMTP Host</label>
                    <Input
                      value={settings.email.smtpHost}
                      onChange={(e) => updateSetting('email', 'smtpHost', e.target.value)}
                      placeholder="smtp.gmail.com"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">SMTP Port</label>
                    <Input
                      type="number"
                      value={settings.email.smtpPort}
                      onChange={(e) => updateSetting('email', 'smtpPort', parseInt(e.target.value))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">SMTP Username</label>
                    <Input
                      value={settings.email.smtpUser}
                      onChange={(e) => updateSetting('email', 'smtpUser', e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">From Email</label>
                    <Input
                      type="email"
                      value={settings.email.emailFrom}
                      onChange={(e) => updateSetting('email', 'emailFrom', e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white text-sm font-medium mb-2 block">SMTP Password</label>
                  <Input
                    type="password"
                    value={settings.email.smtpPassword}
                    onChange={(e) => updateSetting('email', 'smtpPassword', e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.email.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('email', 'emailNotifications', checked)}
                  />
                  <label className="text-white text-sm">Enable Email Notifications</label>
                  {settings.email.emailNotifications && (
                    <Badge className="bg-green-500">Active</Badge>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => saveSettings('email')}
                    disabled={saving === 'email'}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {saving === 'email' ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Email Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payment Settings */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-yellow-400" />
                  Payment Settings
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Configure payment gateway and commission settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Razorpay Key ID</label>
                    <Input
                      value={settings.payment.razorpayKeyId}
                      onChange={(e) => updateSetting('payment', 'razorpayKeyId', e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Razorpay Key Secret</label>
                    <Input
                      type="password"
                      value={settings.payment.razorpayKeySecret}
                      onChange={(e) => updateSetting('payment', 'razorpayKeySecret', e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Mentor Commission (%)</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={settings.payment.mentorCommission}
                      onChange={(e) => updateSetting('payment', 'mentorCommission', parseInt(e.target.value))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Min Session Amount (₹)</label>
                    <Input
                      type="number"
                      min="0"
                      value={settings.payment.minimumSessionAmount}
                      onChange={(e) => updateSetting('payment', 'minimumSessionAmount', parseInt(e.target.value))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.payment.paymentEnabled}
                      onCheckedChange={(checked) => updateSetting('payment', 'paymentEnabled', checked)}
                    />
                    <label className="text-white text-sm">Enable Payments</label>
                    {settings.payment.paymentEnabled && (
                      <Badge className="bg-green-500">Active</Badge>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => saveSettings('payment')}
                    disabled={saving === 'payment'}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {saving === 'payment' ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Payment Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-red-400" />
                  Security Settings
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Configure security and authentication settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Session Timeout (hours)</label>
                    <Input
                      type="number"
                      min="1"
                      max="168"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Max Login Attempts</label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Min Password Length</label>
                    <Input
                      type="number"
                      min="6"
                      max="20"
                      value={settings.security.passwordMinLength}
                      onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(checked) => updateSetting('security', 'twoFactorAuth', checked)}
                  />
                  <label className="text-white text-sm">Enable Two-Factor Authentication</label>
                  {settings.security.twoFactorAuth && (
                    <Badge className="bg-green-500">Active</Badge>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => saveSettings('security')}
                    disabled={saving === 'security'}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {saving === 'security' ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Security Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Feature Settings */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-purple-400" />
                  Feature Settings
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Enable or disable platform features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-white font-medium">AI Assistant</p>
                        <p className="text-purple-300 text-sm">AI-powered learning support</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.features.aiAssistantEnabled}
                      onCheckedChange={(checked) => updateSetting('features', 'aiAssistantEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-white font-medium">Forum</p>
                        <p className="text-purple-300 text-sm">Discussion boards</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.features.forumEnabled}
                      onCheckedChange={(checked) => updateSetting('features', 'forumEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Database className="w-5 h-5 text-yellow-400" />
                      <div>
                        <p className="text-white font-medium">Resources</p>
                        <p className="text-purple-300 text-sm">Study materials</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.features.resourcesEnabled}
                      onCheckedChange={(checked) => updateSetting('features', 'resourcesEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-white font-medium">Mentorship</p>
                        <p className="text-purple-300 text-sm">1:1 mentoring sessions</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.features.mentorshipEnabled}
                      onCheckedChange={(checked) => updateSetting('features', 'mentorshipEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Megaphone className="w-5 h-5 text-red-400" />
                      <div>
                        <p className="text-white font-medium">Announcements</p>
                        <p className="text-purple-300 text-sm">Platform notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.features.announcementsEnabled}
                      onCheckedChange={(checked) => updateSetting('features', 'announcementsEnabled', checked)}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => saveSettings('features')}
                    disabled={saving === 'features'}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {saving === 'features' ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Feature Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}