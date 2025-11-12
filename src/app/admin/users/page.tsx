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
  Filter,
  Trash2,
  RefreshCw,
  Star,
  UserPlus,
  Eye,
  Edit,
  Calendar
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
    hourlyRate?: number
    expertise?: string[]
  }
  _count?: {
    mentorSessions: number
    studentSessions: number
  }
}

export default function AdminUsersPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Pagination and filtering
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')

  const fetchUsers = async (page = 1, search = '', role = 'ALL') => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(role !== 'ALL' && { role })
      })

      const response = await fetch(`/api/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        setTotalPages(data.pagination.pages)
        setCurrentPage(data.pagination.page)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    setActionLoading(userId)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "User deleted successfully",
        })
        
        // Refresh data
        fetchUsers(currentPage, searchTerm, roleFilter)
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to delete user",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      })
    } finally {
      setActionLoading(null)
    }
  }

  useEffect(() => {
    if (user) {
      fetchUsers()
    }
  }, [user])

  useEffect(() => {
    fetchUsers(currentPage, searchTerm, roleFilter)
  }, [currentPage, searchTerm, roleFilter])

  return (
    <DashboardLayout userRole="ADMIN">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">User Management</h1>
            <p className="text-purple-200">Manage all platform users</p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => fetchUsers()}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Total Users</CardTitle>
              <Users className="h-4 w-4 text-purple-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{users.length}</div>
              <p className="text-xs text-purple-300">Registered users</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Students</CardTitle>
              <UserPlus className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {users.filter(u => u.role === 'STUDENT').length}
              </div>
              <p className="text-xs text-purple-300">Active students</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Mentors</CardTitle>
              <Star className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {users.filter(u => u.role === 'MENTOR').length}
              </div>
              <p className="text-xs text-purple-300">Expert mentors</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Admins</CardTitle>
              <Eye className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {users.filter(u => u.role === 'ADMIN').length}
              </div>
              <p className="text-xs text-purple-300">Platform admins</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-4 h-4" />
                  <Input
                    placeholder="Search by name, email, or USN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-purple-300"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Roles</SelectItem>
                    <SelectItem value="STUDENT">Students</SelectItem>
                    <SelectItem value="MENTOR">Mentors</SelectItem>
                    <SelectItem value="ADMIN">Admins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">All Users</CardTitle>
            <CardDescription className="text-purple-200">
              Manage and monitor platform users
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 text-purple-300 animate-spin" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No users found</h3>
                <p className="text-purple-200">
                  {searchTerm || roleFilter !== 'ALL' 
                    ? 'Try adjusting your filters' 
                    : 'No users have registered yet'
                  }
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="text-purple-200">User</TableHead>
                        <TableHead className="text-purple-200">Role</TableHead>
                        <TableHead className="text-purple-200">Details</TableHead>
                        <TableHead className="text-purple-200">Sessions</TableHead>
                        <TableHead className="text-purple-200">Joined</TableHead>
                        <TableHead className="text-purple-200">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id} className="border-white/10">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-white font-medium">{user.name}</p>
                                <p className="text-purple-300 text-sm">{user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                user.role === 'ADMIN' ? 'bg-red-500' :
                                user.role === 'MENTOR' ? 'bg-blue-500' : 'bg-green-500'
                              }
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-purple-200 text-sm">
                              {user.usn && <p>USN: {user.usn}</p>}
                              {user.branch && <p>Branch: {user.branch}</p>}
                              {user.semester && <p>Semester: {user.semester}</p>}
                              {user.mentorProfile && (
                                <div className="mt-1">
                                  <p>Rating: {user.mentorProfile.rating || 'N/A'}</p>
                                  <p>Rate: ₹{user.mentorProfile.hourlyRate || 0}/hr</p>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-purple-200 text-sm">
                              <p>Mentor: {user._count?.mentorSessions || 0}</p>
                              <p>Student: {user._count?.studentSessions || 0}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-purple-200">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-purple-400 text-purple-200"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-purple-400 text-purple-200"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={actionLoading === user.id}
                              >
                                {actionLoading === user.id ? (
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      Previous
                    </Button>
                    <span className="text-purple-200">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}