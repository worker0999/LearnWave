import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { Megaphone, Plus, BellRing, Calendar, Users, RefreshCw } from 'lucide-react'

export function AnnouncementsView() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [filter, setFilter] = useState('ALL')
  
  // Form state
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [target, setTarget] = useState('ALL')
  const [creating, setCreating] = useState(false)

  const fetchAnnouncements = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/announcements?type=${filter}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data.announcements || [])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchAnnouncements()
  }, [user, filter])

  const handleCreate = async () => {
    if (!title || !content) {
      toast({ title: 'Error', description: 'Title and content are required', variant: 'destructive' })
      return
    }
    
    setCreating(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content, type: target })
      })
      
      if (response.ok) {
        toast({ title: 'Success', description: 'Announcement created successfully' })
        setCreateDialogOpen(false)
        setTitle('')
        setContent('')
        setTarget('ALL')
        fetchAnnouncements()
      } else {
        toast({ title: 'Error', description: 'Failed to create announcement', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create announcement', variant: 'destructive' })
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-[#42413b] dark:text-[#f4f4f0] tracking-tight">Announcements</h1>
          <p className="text-[#a9a29e] mt-1 text-lg">Broadcast notices to users</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={fetchAnnouncements} 
            variant="outline" 
            className="border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0] bg-transparent hover:bg-[#f4f4f0] dark:hover:bg-[#1c1b19]"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button 
            onClick={() => setCreateDialogOpen(true)}
            className="bg-[#42413b] hover:bg-[#2a2826] text-[#f4f4f0] dark:bg-[#f4f4f0] dark:text-[#42413b] dark:hover:bg-[#dfd3c3] shadow-sm transform hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-4 h-4 mr-2" /> New Notice
          </Button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-[#dfd3c3] dark:border-[#42413b] pb-4">
        {['ALL', 'STUDENTS', 'MENTORS'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === f 
                ? 'bg-[#42413b] text-[#f4f4f0] dark:bg-[#f4f4f0] dark:text-[#42413b]' 
                : 'bg-[#f4f4f0] text-[#a9a29e] dark:bg-[#1c1b19] dark:text-[#a9a29e] hover:text-[#42413b] dark:hover:text-[#f4f4f0]'
            }`}
          >
            {f === 'ALL' ? 'All Notices' : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcements.map((notice) => {
          let targetDisplay = 'Everyone'
          if (notice.target_roles?.includes('STUDENT') && !notice.target_roles?.includes('MENTOR')) targetDisplay = 'Students'
          if (notice.target_roles?.includes('MENTOR') && !notice.target_roles?.includes('STUDENT')) targetDisplay = 'Mentors'
          
          return (
            <Card key={notice.id} className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] shadow-sm rounded-2xl group hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 border-b border-[#dfd3c3]/50 dark:border-[#42413b]/50">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-[#f4f4f0] dark:bg-[#1c1b19] rounded-xl text-[#42413b] dark:text-[#f4f4f0]">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <Badge className={notice.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-none' : 'bg-[#f4f4f0] text-[#a9a29e] dark:bg-[#1c1b19] border-none'}>
                    {notice.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <CardTitle className="mt-4 text-lg text-[#42413b] dark:text-[#f4f4f0] line-clamp-1">{notice.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <p className="text-[#a9a29e] text-sm line-clamp-2">{notice.content}</p>
                
                <div className="flex items-center justify-between text-xs text-[#a9a29e] pt-4 border-t border-[#dfd3c3]/50 dark:border-[#42413b]/50">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {new Date(notice.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {targetDisplay}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
        {announcements.length === 0 && !loading && (
          <div className="col-span-full text-center py-12 text-[#a9a29e]">
            No announcements found.
          </div>
        )}
      </div>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#42413b] dark:text-[#f4f4f0] flex items-center gap-2">
              <BellRing className="w-5 h-5 text-[#c8ced8]" /> Create Notice
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <div>
              <label className="text-xs font-semibold text-[#a9a29e] uppercase tracking-wider mb-1 block">Title</label>
              <Input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Scheduled Maintenance" 
                className="bg-[#f4f4f0] dark:bg-[#1c1b19] border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0]" 
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#a9a29e] uppercase tracking-wider mb-1 block">Target Audience</label>
              <Select value={target} onValueChange={setTarget}>
                <SelectTrigger className="bg-[#f4f4f0] dark:bg-[#1c1b19] border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Everyone</SelectItem>
                  <SelectItem value="STUDENTS">Only Students</SelectItem>
                  <SelectItem value="MENTORS">Only Mentors</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#a9a29e] uppercase tracking-wider mb-1 block">Message Content</label>
              <Textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your announcement here..." 
                className="bg-[#f4f4f0] dark:bg-[#1c1b19] border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0] min-h-[120px]" 
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)} className="border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0] hover:bg-[#f4f4f0] dark:hover:bg-[#1c1b19]">Cancel</Button>
            <Button 
              onClick={handleCreate}
              disabled={creating}
              className="bg-[#42413b] hover:bg-[#2a2826] text-[#f4f4f0] dark:bg-[#f4f4f0] dark:text-[#42413b] dark:hover:bg-[#dfd3c3]"
            >
              {creating ? 'Broadcasting...' : 'Broadcast Notice'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
