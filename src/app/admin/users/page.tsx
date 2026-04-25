'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
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

interface User {
  id: string
  name: string
  email: string
  role: string
  usn?: string
  branch?: string
  semester?: number
  createdAt: string
  mentorProfile?: {
    approved: boolean
    rating?: number
    expertise?: string[]
  }
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
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
    <DashboardLayout userRole="ADMIN">
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-[#4A3F33]">User Management</h1>
            <p className="text-[#9B8B7E]">Manage all students, mentors, and admins</p>
          </div>
          <Button onClick={fetchUsers} variant="outline" className="border-[#E8DFD3] text-[#6B5844]">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>

        <Card className="bg-white border-[#E8DFD3]">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B8B7E]" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-[#E8DFD3]"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-48 border-[#E8DFD3]">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Roles</SelectItem>
                  <SelectItem value="STUDENT">Students</SelectItem>
                  <SelectItem value="MENTOR">Mentors</SelectItem>
                  <SelectItem value="ADMIN">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-[#E8DFD3]">
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id} className="border-[#E8DFD3]">
                    <TableCell>
                      <div>
                        <div className="font-medium text-[#4A3F33]">{u.name}</div>
                        <div className="text-sm text-[#9B8B7E]">{u.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        u.role === 'ADMIN' ? 'bg-red-100 text-red-700 hover:bg-red-100' :
                          u.role === 'MENTOR' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' :
                            'bg-green-100 text-green-700 hover:bg-green-100'
                      }>
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#6B5844] text-sm">
                      {u.role === 'STUDENT' ? `${u.branch || 'N/A'} (Sem ${u.semester || '?'})` :
                        u.role === 'MENTOR' ? (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            {u.mentorProfile?.rating || 'No rating'}
                          </div>
                        ) : '-'}
                    </TableCell>
                    <TableCell className="text-[#9B8B7E] text-sm">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="ghost" className="text-[#9B8B7E] hover:text-[#6B5844]">
                          <Eye size={18} />
                        </Button>
                        {u.id !== currentUser?.id && (
                          <Button size="icon" variant="ghost" onClick={() => handleDeleteUser(u.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50">
                            <Trash2 size={18} />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="border-[#E8DFD3]"
                >
                  Previous
                </Button>
                <div className="flex items-center px-4 text-[#6B5844]">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="border-[#E8DFD3]"
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
