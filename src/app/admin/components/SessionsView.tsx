import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { Search, Calendar, DollarSign, Clock, RefreshCw, Eye, AlertTriangle } from 'lucide-react'

export function SessionsView() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const fetchSessions = async () => {
    setLoading(true)
    // Mock Data
    setTimeout(() => {
      setSessions([
        { id: '1', student: 'Rahul Sharma', mentor: 'Dr. Jane Doe', date: '2026-05-16', time: '10:00 AM', duration: '60 min', amount: 500, status: 'Upcoming' },
        { id: '2', student: 'Priya Patel', mentor: 'Prof. Smith', date: '2026-05-15', time: '02:00 PM', duration: '30 min', amount: 300, status: 'Completed' },
        { id: '3', student: 'Amit Kumar', mentor: 'Dr. Alan Turing', date: '2026-05-14', time: '11:00 AM', duration: '60 min', amount: 800, status: 'Cancelled' },
        { id: '4', student: 'Sneha Gupta', mentor: 'Dr. Jane Doe', date: '2026-05-15', time: '05:00 PM', duration: '45 min', amount: 450, status: 'Disputed' },
      ])
      setLoading(false)
    }, 600)
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  const filteredSessions = sessions.filter(s => {
    const matchesSearch = s.student.toLowerCase().includes(searchTerm.toLowerCase()) || s.mentor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Upcoming': return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none">Upcoming</Badge>
      case 'Completed': return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-none">Completed</Badge>
      case 'Cancelled': return <Badge className="bg-[#f4f4f0] text-[#a9a29e] dark:bg-[#1c1b19] border-none">Cancelled</Badge>
      case 'Disputed': return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-none flex items-center gap-1"><AlertTriangle size={12} /> Disputed</Badge>
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
            <div className="text-2xl font-bold text-[#42413b] dark:text-[#f4f4f0]">1,248</div>
            <p className="text-xs text-emerald-500 mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#a9a29e]">Platform Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-[#c8ced8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#42413b] dark:text-[#f4f4f0]">₹24,500</div>
            <p className="text-xs text-emerald-500 mt-1">Based on 10% commission</p>
          </CardContent>
        </Card>
        <Card className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#a9a29e]">Disputed Sessions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#42413b] dark:text-[#f4f4f0]">3</div>
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
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="Disputed">Disputed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-[#dfd3c3] dark:border-[#42413b] hover:bg-transparent">
                <TableHead className="text-[#a9a29e] font-medium h-12 px-6">Participants</TableHead>
                <TableHead className="text-[#a9a29e] font-medium h-12">Schedule</TableHead>
                <TableHead className="text-[#a9a29e] font-medium h-12">Amount</TableHead>
                <TableHead className="text-[#a9a29e] font-medium h-12">Status</TableHead>
                <TableHead className="text-right text-[#a9a29e] font-medium h-12 px-6">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSessions.map((session) => (
                <TableRow key={session.id} className="border-[#dfd3c3] dark:border-[#42413b] hover:bg-[#f4f4f0]/50 dark:hover:bg-[#1c1b19]/50 transition-colors group">
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#42413b] dark:text-[#f4f4f0]">{session.student}</span>
                      <span className="text-sm text-[#a9a29e]">with {session.mentor}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-[#42413b] dark:text-[#f4f4f0] flex items-center gap-1.5"><Calendar size={14} className="text-[#a9a29e]"/> {session.date}</span>
                      <span className="text-sm text-[#a9a29e] flex items-center gap-1.5"><Clock size={14}/> {session.time} ({session.duration})</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-[#42413b] dark:text-[#f4f4f0]">₹{session.amount}</span>
                      <span className="text-xs text-emerald-500">Platform: ₹{(session.amount * 0.1).toFixed(0)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(session.status)}
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <Button size="sm" variant="ghost" className="text-[#a9a29e] hover:text-[#42413b] dark:hover:text-[#f4f4f0]">
                      <Eye size={16} className="mr-2" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredSessions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-[#a9a29e]">
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
