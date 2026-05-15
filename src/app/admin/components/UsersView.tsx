import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import {
  Users,
  Search,
  RefreshCw,
  Trash2,
  Eye,
  Star
} from 'lucide-react'

export function UsersView() {
  const { user: currentUser } = useAuth()
  const { toast } = useToast()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(roleFilter !== 'ALL' && { role: roleFilter })
      })

      const res = await fetch(`/api/admin/users?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (res.ok) {
        const data = await res.json()
        setUsers(data.users)
        setTotalPages(data.pagination.pages)
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to fetch users", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        toast({ title: "Success", description: "User deleted" })
        fetchUsers()
      }
    } catch (err) {
      toast({ title: "Error", description: "Delete failed", variant: "destructive" })
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [currentPage, searchTerm, roleFilter])

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-[#42413b] dark:text-[#f4f4f0] tracking-tight">User Management</h1>
          <p className="text-[#a9a29e] mt-1 text-lg">Manage all students, mentors, and admins</p>
        </div>
        <Button 
          onClick={fetchUsers} 
          variant="outline" 
          className="border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0] bg-transparent hover:bg-[#f4f4f0] dark:hover:bg-[#1c1b19]"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <Card className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-[#dfd3c3] dark:border-[#42413b] bg-gray-50/50 dark:bg-black/10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a9a29e]" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#ffffff] dark:bg-[#1c1b19] border-[#dfd3c3] dark:border-[#42413b] focus-visible:ring-[#c8ced8] text-[#42413b] dark:text-[#f4f4f0] h-10 rounded-xl"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48 bg-[#ffffff] dark:bg-[#1c1b19] border-[#dfd3c3] dark:border-[#42413b] focus:ring-[#c8ced8] text-[#42413b] dark:text-[#f4f4f0] h-10 rounded-xl">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b]">
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="STUDENT">Students</SelectItem>
                <SelectItem value="MENTOR">Mentors</SelectItem>
                <SelectItem value="ADMIN">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-[#dfd3c3] dark:border-[#42413b] hover:bg-transparent">
                <TableHead className="text-[#a9a29e] font-medium h-12 px-6">User</TableHead>
                <TableHead className="text-[#a9a29e] font-medium h-12">Role</TableHead>
                <TableHead className="text-[#a9a29e] font-medium h-12">Details</TableHead>
                <TableHead className="text-[#a9a29e] font-medium h-12">Joined</TableHead>
                <TableHead className="text-right text-[#a9a29e] font-medium h-12 px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id} className="border-[#dfd3c3] dark:border-[#42413b] hover:bg-[#f4f4f0]/50 dark:hover:bg-[#1c1b19]/50 transition-colors group">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#f4f4f0] dark:bg-[#1c1b19] border border-[#dfd3c3] dark:border-[#42413b] flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-[#a9a29e]" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#42413b] dark:text-[#f4f4f0]">{u.name}</div>
                        <div className="text-sm text-[#a9a29e]">{u.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      u.role === 'ADMIN' ? 'bg-[#42413b] text-[#f4f4f0] hover:bg-[#42413b]/90 border-none' :
                      u.role === 'MENTOR' ? 'bg-[#c8ced8] text-[#42413b] hover:bg-[#b5bcc7] border-none' :
                      'bg-[#f4f4f0] dark:bg-[#1c1b19] text-[#42413b] dark:text-[#f4f4f0] border-[#dfd3c3] dark:border-[#42413b] hover:bg-[#e8eaec] dark:hover:bg-[#2a2826]'
                    }>
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#a9a29e] text-sm">
                    {u.role === 'STUDENT' ? `${u.branch || 'N/A'} (Sem ${u.semester || '?'})` :
                      u.role === 'MENTOR' ? (
                        <div className="flex items-center gap-1.5 font-medium text-[#42413b] dark:text-[#f4f4f0]">
                          <Star className="w-3.5 h-3.5 text-[#dfd3c3] fill-[#dfd3c3]" />
                          {u.mentorProfile?.rating || 'No rating'}
                        </div>
                      ) : '-'}
                  </TableCell>
                  <TableCell className="text-[#a9a29e] text-sm">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="ghost" className="text-[#a9a29e] hover:text-[#42413b] dark:hover:text-[#f4f4f0] h-8 w-8 rounded-full">
                        <Eye size={16} />
                      </Button>
                      {u.id !== currentUser?.id && (
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteUser(u.id)} className="text-[#a9a29e] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 h-8 w-8 rounded-full transition-colors">
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 py-4 bg-gray-50/50 dark:bg-black/10 border-t border-[#dfd3c3] dark:border-[#42413b]">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0] h-9 rounded-lg"
              >
                Previous
              </Button>
              <div className="text-sm font-medium text-[#a9a29e]">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0] h-9 rounded-lg"
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
