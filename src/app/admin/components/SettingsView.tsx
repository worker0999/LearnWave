import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { 
  Globe,
  Mail,
  CreditCard,
  Shield,
  Zap,
  RefreshCw,
  Save,
  Users,
  Bell,
  Database,
  Star,
  Megaphone
} from 'lucide-react'

export function SettingsView() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)
  
  const [settings, setSettings] = useState<any>({
    general: {
      platformName: 'LearnWave',
      platformDescription: 'AI-Powered Academic Support Platform',
      contactEmail: 'support@learnwave.com',
      supportPhone: '+91 8012345678',
      maintenanceMode: false,
      maintenanceMessage: 'Platform is under maintenance.'
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
      twoFactorAuth: false
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
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings || settings)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async (category: string) => {
    setSaving(category)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ category, settings: settings[category] })
      })

      if (response.ok) {
        toast({ title: "Success", description: `${category} settings saved` })
      } else {
        toast({ title: "Error", description: "Failed to save settings", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save settings", variant: "destructive" })
    } finally {
      setSaving(null)
    }
  }

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      [category]: { ...prev[category], [key]: value }
    }))
  }

  useEffect(() => {
    if (user) fetchSettings()
  }, [user])

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-[#42413b] dark:text-[#f4f4f0] tracking-tight">Platform Settings</h1>
          <p className="text-[#a9a29e] mt-1 text-lg">Configure system preferences</p>
        </div>
        <Button 
          onClick={fetchSettings} 
          variant="outline" 
          className="border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0] bg-transparent hover:bg-[#f4f4f0] dark:hover:bg-[#1c1b19]"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <Card className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] shadow-sm rounded-2xl">
          <CardHeader className="border-b border-[#dfd3c3] dark:border-[#42413b] bg-gray-50/50 dark:bg-black/10">
            <CardTitle className="text-[#42413b] dark:text-[#f4f4f0] flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#c8ced8]" /> General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-[#a9a29e] text-xs font-semibold uppercase tracking-wider block mb-1">Platform Name</label>
                <Input
                  value={settings.general.platformName}
                  onChange={(e) => updateSetting('general', 'platformName', e.target.value)}
                  className="bg-[#f4f4f0] dark:bg-[#1c1b19] border-[#dfd3c3] dark:border-[#42413b] focus-visible:ring-[#c8ced8] text-[#42413b] dark:text-[#f4f4f0] rounded-xl"
                />
              </div>
              <div>
                <label className="text-[#a9a29e] text-xs font-semibold uppercase tracking-wider block mb-1">Description</label>
                <Textarea
                  value={settings.general.platformDescription}
                  onChange={(e) => updateSetting('general', 'platformDescription', e.target.value)}
                  className="bg-[#f4f4f0] dark:bg-[#1c1b19] border-[#dfd3c3] dark:border-[#42413b] focus-visible:ring-[#c8ced8] text-[#42413b] dark:text-[#f4f4f0] rounded-xl min-h-[80px]"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-[#f4f4f0] dark:bg-[#1c1b19] rounded-xl border border-[#dfd3c3] dark:border-[#42413b]">
                <div>
                  <p className="text-[#42413b] dark:text-[#f4f4f0] font-medium">Maintenance Mode</p>
                  <p className="text-[#a9a29e] text-sm">Disable platform access for users</p>
                </div>
                <Switch
                  checked={settings.general.maintenanceMode}
                  onCheckedChange={(checked) => updateSetting('general', 'maintenanceMode', checked)}
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button
                onClick={() => saveSettings('general')}
                disabled={saving === 'general'}
                className="bg-[#c8ced8] hover:bg-[#b5bcc7] text-[#42413b] shadow-sm transform hover:-translate-y-0.5 transition-all active:translate-y-0 dark:bg-[#c8ced8]/90 dark:hover:bg-[#c8ced8]"
              >
                {saving === 'general' ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Feature Toggles */}
        <Card className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] shadow-sm rounded-2xl">
          <CardHeader className="border-b border-[#dfd3c3] dark:border-[#42413b] bg-gray-50/50 dark:bg-black/10">
            <CardTitle className="text-[#42413b] dark:text-[#f4f4f0] flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#c8ced8]" /> Features
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              {[
                { id: 'aiAssistantEnabled', label: 'AI Assistant', icon: <Bell className="w-4 h-4" /> },
                { id: 'forumEnabled', label: 'Forum', icon: <Users className="w-4 h-4" /> },
                { id: 'resourcesEnabled', label: 'Resources', icon: <Database className="w-4 h-4" /> },
                { id: 'mentorshipEnabled', label: 'Mentorship', icon: <Star className="w-4 h-4" /> },
                { id: 'announcementsEnabled', label: 'Announcements', icon: <Megaphone className="w-4 h-4" /> }
              ].map(feat => (
                <div key={feat.id} className="flex items-center justify-between p-3 bg-[#f4f4f0] dark:bg-[#1c1b19] rounded-xl border border-[#dfd3c3] dark:border-[#42413b]">
                  <div className="flex items-center gap-3 text-[#42413b] dark:text-[#f4f4f0]">
                    <div className="p-1.5 bg-[#ffffff] dark:bg-[#2a2826] rounded-md shadow-sm border border-[#dfd3c3] dark:border-[#42413b]">
                      {feat.icon}
                    </div>
                    <span className="font-medium">{feat.label}</span>
                  </div>
                  <Switch
                    checked={settings.features[feat.id]}
                    onCheckedChange={(c) => updateSetting('features', feat.id, c)}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <Button
                onClick={() => saveSettings('features')}
                disabled={saving === 'features'}
                className="bg-[#c8ced8] hover:bg-[#b5bcc7] text-[#42413b] shadow-sm transform hover:-translate-y-0.5 transition-all active:translate-y-0 dark:bg-[#c8ced8]/90 dark:hover:bg-[#c8ced8]"
              >
                {saving === 'features' ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Features
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
