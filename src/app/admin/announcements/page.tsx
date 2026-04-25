'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { Bell, Plus, Trash2, RefreshCw } from 'lucide-react'

interface Announcement {
  id: string
  title: string
  content: string
  type: string
  createdAt: string
}

export default function AdminAnnouncementsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', type: 'GENERAL' })

  const fetchAnnouncements = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/admin/announcements', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setAnnouncements(data.announcements || [])
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to load announcements", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!form.title || !form.content) {
      toast({ title: "Validation Error", description: "Title and content are required", variant: "destructive" })
      return
    }
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })
      if (res.ok) {
        toast({ title: "Success", description: "Announcement published" })
        setShowDialog(false)
        setForm({ title: '', content: '', type: 'GENERAL' })
        fetchAnnouncements()
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to create", variant: "destructive" })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this announcement?')) return
    setIsDeleting(id)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/admin/announcements?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        toast({ title: "Success", description: "Announcement deleted" })
        fetchAnnouncements()
      }
    } catch (err) {
      toast({ title: "Error", description: "Delete failed", variant: "destructive" })
    } finally {
      setIsDeleting(null)
    }
  }

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  return (
    <DashboardLayout userRole="ADMIN">
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-[#4A3F33]">Announcements</h1>
            <p className="text-[#9B8B7E]">Broadcast important updates to all users</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={fetchAnnouncements} variant="outline" className="border-[#E8DFD3] text-[#6B5844]">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
            <Button onClick={() => setShowDialog(true)} className="bg-[#6B5844] hover:bg-[#4A3F33] text-white">
              <Plus className="w-4 h-4 mr-2" /> New Announcement
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {announcements.length === 0 && !loading && (
            <Card className="bg-white border-[#E8DFD3] p-12 text-center">
              <Bell className="w-12 h-12 text-[#E8DFD3] mx-auto mb-4" />
              <p className="text-[#9B8B7E]">No announcements yet. Create one to get started.</p>
            </Card>
          )}

          {announcements.map((ann) => (
            <Card key={ann.id} className="bg-white border-[#E8DFD3]">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-xl text-[#4A3F33]">{ann.title}</CardTitle>
                    <Badge className={
                      ann.type === 'URGENT' ? 'bg-red-100 text-red-600' :
                        ann.type === 'INFO' ? 'bg-blue-100 text-blue-600' :
                          'bg-[#F5F0EA] text-[#6B5844]'
                    }>
                      {ann.type}
                    </Badge>
                  </div>
                  <CardDescription className="text-[#9B8B7E]">
                    Posted on {new Date(ann.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={isDeleting === ann.id}
                  onClick={() => handleDelete(ann.id)}
                  className="text-red-400 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={18} />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-[#6B5844] whitespace-pre-wrap">{ann.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="bg-white border-[#E8DFD3]">
            <DialogHeader>
              <DialogTitle className="text-[#4A3F33]">Create New Announcement</DialogTitle>
              <DialogDescription>Fill in the details below to broadcast an update.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#6B5844]">Title</label>
                <Input
                  placeholder="e.g. Schedule Update"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="border-[#E8DFD3]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#6B5844]">Type</label>
                <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                  <SelectTrigger className="border-[#E8DFD3]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GENERAL">General</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                    <SelectItem value="INFO">Information</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#6B5844]">Content</label>
                <Textarea
                  placeholder="Type your announcement here..."
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  className="border-[#E8DFD3] min-h-[150px]"
                />
              </div>
              <Button onClick={handleCreate} className="w-full bg-[#6B5844] hover:bg-[#4A3F33] text-white">
                Publish Announcement
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
