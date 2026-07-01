import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { Search, Calendar, DollarSign, Clock, RefreshCw, XCircle, AlertTriangle } from 'lucide-react'

export function SessionsView() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  
  // Stats
  const [totalSessions, setTotalSessions] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [disputedCount, setDisputedCount] = useState(0)

  const fetchSessions = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/admin/sessions', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        const fetchedSessions = data.sessions || []
        setSessions(fetchedSessions)
        
        // Calculate Stats
        setTotalSessions(fetchedSessions.length)
        const revenue = fetchedSessions.reduce((acc: number, curr: any) => acc + (curr.price || 0), 0)
        setTotalRevenue(revenue * 0.1) // Platform takes 10%
        const disputed = fetchedSessions.filter((s: any) => s.status === 'DISPUTED').length
        setDisputedCount(disputed)
      }
    } catch (err) {
      console.error(err)
      toast({ title: 'Error', description: 'Failed to fetch sessions', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  const handleCancelSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to cancel this session?')) return
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/admin/sessions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sessionId, status: 'CANCELLED' })
      })
      
      if (res.ok) {
        toast({ title: 'Success', description: 'Session cancelled successfully' })
        fetchSessions()
      } else {
        toast({ title: 'Error', description: 'Failed to cancel session', variant: 'destructive' })
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to cancel session', variant: 'destructive' })
    }
  }

  const filteredSessions = sessions.filter(s => {
    const sName = s.studentName?.toLowerCase() || ''
    const mName = s.mentorName?.toLowerCase() || ''
    const matchesSearch = sName.includes(searchTerm.toLowerCase()) || mName.includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none">Scheduled</Badge>
      case 'COMPLETED': return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-none">Completed</Badge>
      case 'CANCELLED': return <Badge className="bg-[#f4f4f0] text-[#a9a29e] dark:bg-[#1c1b19] border-none">Cancelled</Badge>
      case 'DISPUTED': return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-none flex items-center gap-1"><AlertTriangle size={12} /> Disputed</Badge>
      default: return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-[#42413b] dark:text-[#f4f4f0] tracking-tight">Sessions & Revenue</h1>
          <p className="text-[#a9a29e] mt-1 text-lg">Monitor platform activity and payments</p>
        </div>
        <Button 
          onClick={fetchSessions} 
          variant="outline" 
          className="border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0] bg-transparent hover:bg-[#f4f4f0] dark:hover:bg-[#1c1b19]"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#a9a29e]">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-[#c8ced8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#42413b] dark:text-[#f4f4f0]">{totalSessions}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#a9a29e]">Platform Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-[#c8ced8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#42413b] dark:text-[#f4f4f0]">₹{totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-emerald-500 mt-1">Based on 10% commission</p>
          </CardContent>
        </Card>
        <Card className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#a9a29e]">Disputed Sessions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#42413b] dark:text-[#f4f4f0]">{disputedCount}</div>
            <p className="text-xs text-[#a9a29e] mt-1">Requires admin resolution</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-[#dfd3c3] dark:border-[#42413b] bg-gray-50/50 dark:bg-black/10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a9a29e] w-4 h-4" />
              <Input
                placeholder="Search by student or mentor name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#ffffff] dark:bg-[#1c1b19] border-[#dfd3c3] dark:border-[#42413b] focus-visible:ring-[#c8ced8] text-[#42413b] dark:text-[#f4f4f0] h-10 rounded-xl"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-[#ffffff] dark:bg-[#1c1b19] border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0] h-10 rounded-xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b]">
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="DISPUTED">Disputed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-[#dfd3c3] dark:border-[#42413b] hover:bg-transparent">
                <TableHead className="text-[#a9a29e] font-medium h-12 px-6">Participants</TableHead>
                <TableHead className="text-[#a9a29e] font-medium h-12">Topic</TableHead>
                <TableHead className="text-[#a9a29e] font-medium h-12">Schedule</TableHead>
                <TableHead className="text-[#a9a29e] font-medium h-12">Amount</TableHead>
                <TableHead className="text-[#a9a29e] font-medium h-12">Status</TableHead>
                <TableHead className="text-right text-[#a9a29e] font-medium h-12 px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSessions.map((session) => (
                <TableRow key={session.id} className="border-[#dfd3c3] dark:border-[#42413b] hover:bg-[#f4f4f0]/50 dark:hover:bg-[#1c1b19]/50 transition-colors group">
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#42413b] dark:text-[#f4f4f0]">{session.studentName}</span>
                      <span className="text-sm text-[#a9a29e]">with {session.mentorName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <span className="text-[#42413b] dark:text-[#f4f4f0] truncate block">{session.topic}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-[#42413b] dark:text-[#f4f4f0] flex items-center gap-1.5">
                        <Calendar size={14} className="text-[#a9a29e]"/> 
                        {new Date(session.scheduledAt).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-[#a9a29e] flex items-center gap-1.5">
                        <Clock size={14}/> 
                        {new Date(session.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-[#42413b] dark:text-[#f4f4f0]">₹{session.price}</span>
                      <span className="text-xs text-emerald-500">Platform: ₹{(session.price * 0.1).toFixed(0)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(session.status)}
                  </TableCell>
                  <TableCell className="text-right px-6">
                    {session.status === 'SCHEDULED' && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleCancelSession(session.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                      >
                        <XCircle size={16} className="mr-2" /> Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredSessions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-[#a9a29e]">
                    No sessions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
