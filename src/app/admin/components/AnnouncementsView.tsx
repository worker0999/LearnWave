import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { Megaphone, Plus, BellRing, Edit, Trash2, Calendar, Users } from 'lucide-react'

export function AnnouncementsView() {
  const { user } = useAuth()
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    // Mock data
    setAnnouncements([
      { id: '1', title: 'System Maintenance Scheduled', content: 'The platform will undergo maintenance this Sunday at 2 AM.', target: 'ALL', date: '2026-05-15', status: 'Active' },
      { id: '2', title: 'New Mentor Guidelines', content: 'Please review the updated guidelines for booking sessions.', target: 'MENTORS', date: '2026-05-14', status: 'Active' },
      { id: '3', title: 'Welcome to the New Semester', content: 'We hope you have a great learning experience!', target: 'STUDENTS', date: '2026-05-01', status: 'Inactive' },
    ])
  }, [])

  const filteredAnnouncements = filter === 'ALL' ? announcements : announcements.filter(a => a.target === filter)

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-[#42413b] dark:text-[#f4f4f0] tracking-tight">Announcements</h1>
          <p className="text-[#a9a29e] mt-1 text-lg">Broadcast notices to users</p>
        </div>
        <Button 
          onClick={() => setCreateDialogOpen(true)}
          className="bg-[#42413b] hover:bg-[#2a2826] text-[#f4f4f0] dark:bg-[#f4f4f0] dark:text-[#42413b] dark:hover:bg-[#dfd3c3] shadow-sm transform hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-4 h-4 mr-2" /> New Notice
        </Button>
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
        {filteredAnnouncements.map((notice) => (
          <Card key={notice.id} className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] shadow-sm rounded-2xl group hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 border-b border-[#dfd3c3]/50 dark:border-[#42413b]/50">
              <div className="flex justify-between items-start">
                <div className="p-2.5 bg-[#f4f4f0] dark:bg-[#1c1b19] rounded-xl text-[#42413b] dark:text-[#f4f4f0]">
                  <Megaphone className="w-5 h-5" />
                </div>
                <Badge className={notice.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-none' : 'bg-[#f4f4f0] text-[#a9a29e] dark:bg-[#1c1b19] border-none'}>
                  {notice.status}
                </Badge>
              </div>
              <CardTitle className="mt-4 text-lg text-[#42413b] dark:text-[#f4f4f0] line-clamp-1">{notice.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <p className="text-[#a9a29e] text-sm line-clamp-2">{notice.content}</p>
              
              <div className="flex items-center justify-between text-xs text-[#a9a29e] pt-4 border-t border-[#dfd3c3]/50 dark:border-[#42413b]/50">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {notice.date}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> {notice.target}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
              <Input placeholder="e.g., Scheduled Maintenance" className="bg-[#f4f4f0] dark:bg-[#1c1b19] border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#a9a29e] uppercase tracking-wider mb-1 block">Target Audience</label>
              <Select defaultValue="ALL">
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
              <Textarea placeholder="Write your announcement here..." className="bg-[#f4f4f0] dark:bg-[#1c1b19] border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0] min-h-[120px]" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)} className="border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0] hover:bg-[#f4f4f0] dark:hover:bg-[#1c1b19]">Cancel</Button>
            <Button className="bg-[#42413b] hover:bg-[#2a2826] text-[#f4f4f0] dark:bg-[#f4f4f0] dark:text-[#42413b] dark:hover:bg-[#dfd3c3]">Broadcast Notice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
