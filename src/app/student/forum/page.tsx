'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { 
  MessageSquare, 
  Search, 
  Plus,
  Filter,
  ThumbsUp,
  MessageCircle,
  Eye,
  Pin,
  Lock,
  Users,
  TrendingUp,
  Clock,
  Tag,
  Flag,
  Share2,
  Bookmark,
  MoreHorizontal,
  Flame,
  Star,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  BookOpen,
  Target
} from 'lucide-react'

interface Post {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar?: string
    role: string
    semester?: number
  }
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
  views: number
  likes: number
  replies: number
  isPinned: boolean
  isLocked: boolean
  isSolved: boolean
  attachments?: string[]
}

interface Reply {
  id: string
  content: string
  author: {
    name: string
    avatar?: string
    role: string
    semester?: number
  }
  createdAt: string
  likes: number
  isAnswer: boolean
}

// The forum author may optionally include semester for student authors; make it optional on Reply.author by using `any` where needed in mock data

const categories = [
  { id: 'general', name: 'General Discussion', icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'doubts', name: 'Academic Doubts', icon: <HelpCircle className="w-4 h-4" /> },
  { id: 'resources', name: 'Study Resources', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'exams', name: 'Exam Preparation', icon: <Target className="w-4 h-4" /> },
  { id: 'placements', name: 'Placement Talk', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'projects', name: 'Project Ideas', icon: <Lightbulb className="w-4 h-4" /> }
]

const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Best resources for Data Structures preparation?',
    content: 'Hey everyone! I\'m preparing for my Data Structures exam and looking for the best resources. Can you recommend some good books, online courses, or YouTube channels?',
    author: {
      name: 'Alex Kumar',
      avatar: '/avatars/alex.jpg',
      role: 'Student',
      semester: 5
    },
    category: 'doubts',
    tags: ['data-structures', 'resources', 'exam-prep'],
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
    views: 234,
    likes: 12,
    replies: 8,
    isPinned: false,
    isLocked: false,
    isSolved: true
  },
  {
    id: '2',
    title: 'Anyone interested in forming a study group for Algorithm Analysis?',
    content: 'Looking for dedicated students to form a study group for Algorithm Analysis. We can meet weekly and solve problems together. Let me know if you\'re interested!',
    author: {
      name: 'Priya Sharma',
      avatar: '/avatars/priya.jpg',
      role: 'Student',
      semester: 5
    },
    category: 'general',
    tags: ['study-group', 'algorithms', 'collaboration'],
    createdAt: '2024-01-19T15:45:00Z',
    updatedAt: '2024-01-19T15:45:00Z',
    views: 156,
    likes: 18,
    replies: 12,
    isPinned: true,
    isLocked: false,
    isSolved: false
  },
  {
    id: '3',
    title: 'VTU Exam Schedule Released for Semester 5',
    content: 'The VTU exam schedule for Semester 5 has been released. Exams will start from February 15th. Check the official VTU website for detailed timetable.',
    author: {
      name: 'Admin',
      avatar: '/avatars/admin.jpg',
      role: 'Administrator'
    },
    category: 'exams',
    tags: ['vtu', 'exam-schedule', 'important'],
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-18T09:00:00Z',
    views: 892,
    likes: 45,
    replies: 23,
    isPinned: true,
    isLocked: true,
    isSolved: false
  }
]

const mockReplies: Reply[] = [
  {
    id: '1',
    content: 'I highly recommend "Data Structures and Algorithm Analysis in C" by Mark Allen Weiss. It\'s comprehensive and has great examples.',
    author: {
      name: 'Dr. Sarah Johnson',
      avatar: '/avatars/sarah.jpg',
      role: 'Mentor'
    },
    createdAt: '2024-01-20T11:15:00Z',
    likes: 8,
    isAnswer: true
  },
  {
    id: '2',
    content: 'For video content, check out Abdul Bari\'s YouTube channel. His explanations are very clear and easy to follow.',
    author: {
      name: 'Mike Chen',
      avatar: '/avatars/mike.jpg',
      role: 'Student',
      semester: 6
    },
    createdAt: '2024-01-20T11:30:00Z',
    likes: 5,
    isAnswer: false
  }
]

export default function CommunityForum() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSort, setSelectedSort] = useState<string>('latest')
  const [newPostDialogOpen, setNewPostDialogOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [postDetailDialogOpen, setPostDetailDialogOpen] = useState(false)
  const [replies, setReplies] = useState<Reply[]>([])

  // New post form state
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: ''
  })

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setPosts(mockPosts)
      setFilteredPosts(mockPosts)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    filterPosts()
  }, [posts, searchTerm, selectedCategory, selectedSort])

  const filterPosts = () => {
    let filtered = posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory

      return matchesSearch && matchesCategory
    })

    // Sort posts
    filtered.sort((a, b) => {
      switch (selectedSort) {
        case 'latest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'popular':
          return b.likes - a.likes
        case 'views':
          return b.views - a.views
        case 'replies':
          return b.replies - a.replies
        default:
          return 0
      }
    })

    // Pinned posts first
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return 0
    })

    setFilteredPosts(filtered)
  }

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content) return

    const post: Post = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      author: {
        name: 'John Doe', // Current user
        role: 'Student',
        semester: 5
      },
      category: newPost.category,
      tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      replies: 0,
      isPinned: false,
      isLocked: false,
      isSolved: false
    }

    setPosts(prev => [post, ...prev])
    setNewPostDialogOpen(false)
    setNewPost({ title: '', content: '', category: 'general', tags: '' })
  }

  const handleViewPost = (post: Post) => {
    setSelectedPost(post)
    setReplies(mockReplies)
    setPostDetailDialogOpen(true)
    
    // Increment view count
    setPosts(prev => prev.map(p => 
      p.id === post.id ? { ...p, views: p.views + 1 } : p
    ))
  }

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, likes: p.likes + 1 } : p
    ))
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      general: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      doubts: 'bg-green-500/20 text-green-300 border-green-500/30',
      resources: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      exams: 'bg-red-500/20 text-red-300 border-red-500/30',
      placements: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      projects: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
    }
    return colors[category] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  if (loading) {
    return (
      <DashboardLayout userRole="STUDENT">
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading forum...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="STUDENT">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Community Forum</h1>
            <p className="text-purple-200">
              Connect with peers, share knowledge, and solve doubts together
            </p>
          </div>
          <Dialog open={newPostDialogOpen} onOpenChange={setNewPostDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-white/20 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogDescription className="text-purple-200">
                  Share your thoughts, questions, or resources with the community
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    placeholder="Enter post title..."
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-slate-800 border-white/20 text-white placeholder-purple-300"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={newPost.category} onValueChange={(value) => setNewPost(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="bg-slate-800 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Content</label>
                  <Textarea
                    placeholder="Write your post content..."
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    className="bg-slate-800 border-white/20 text-white placeholder-purple-300"
                    rows={6}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Tags (comma-separated)</label>
                  <Input
                    placeholder="e.g., data-structures, algorithms, help"
                    value={newPost.tags}
                    onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
                    className="bg-slate-800 border-white/20 text-white placeholder-purple-300"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setNewPostDialogOpen(false)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePost}
                  disabled={!newPost.title || !newPost.content}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Create Post
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-4 h-4" />
                  <Input
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-purple-300 focus:border-purple-400"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={selectedSort} onValueChange={setSelectedSort}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="views">Most Viewed</SelectItem>
                  <SelectItem value="replies">Most Discussed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Forum Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{posts.length}</div>
              <div className="text-sm text-purple-200">Total Posts</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {posts.reduce((sum, post) => sum + post.replies, 0)}
              </div>
              <div className="text-sm text-purple-200">Total Replies</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {posts.filter(post => post.isSolved).length}
              </div>
              <div className="text-sm text-purple-200">Solved</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {posts.filter(post => post.isPinned).length}
              </div>
              <div className="text-sm text-purple-200">Pinned</div>
            </CardContent>
          </Card>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all cursor-pointer" onClick={() => handleViewPost(post)}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>
                        {post.author.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-white font-semibold">{post.author.name}</h3>
                        <Badge variant="outline" className="border-purple-400 text-purple-200 text-xs">
                          {post.author.role}
                        </Badge>
                        {post.author.semester && (
                          <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-200">
                            Sem {post.author.semester}
                          </Badge>
                        )}
                      </div>
                      <div className="text-purple-300 text-sm">
                        {formatTimeAgo(post.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {post.isPinned && <Pin className="w-4 h-4 text-yellow-400" />}
                    {post.isLocked && <Lock className="w-4 h-4 text-red-400" />}
                    {post.isSolved && <CheckCircle className="w-4 h-4 text-green-400" />}
                    <Badge className={getCategoryColor(post.category)}>
                      {categories.find(c => c.id === post.category)?.name}
                    </Badge>
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-white mb-2">{post.title}</h2>
                <p className="text-purple-200 mb-4 line-clamp-2">{post.content}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-purple-500/20 text-purple-200">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-purple-300">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {post.views} views
                    </span>
                    <span className="flex items-center">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {post.likes} likes
                    </span>
                    <span className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {post.replies} replies
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleLikePost(post.id)
                    }}
                    className="text-purple-300 hover:text-white hover:bg-white/10"
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    Like
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-purple-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No posts found</h3>
              <p className="text-purple-200">
                Be the first to start a discussion or try adjusting your filters.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Post Detail Dialog */}
        <Dialog open={postDetailDialogOpen} onOpenChange={setPostDetailDialogOpen}>
          <DialogContent className="bg-slate-900 border-white/20 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
            {selectedPost && (
              <>
                <DialogHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <DialogTitle className="text-xl mb-2">{selectedPost.title}</DialogTitle>
                      <DialogDescription className="text-purple-200">
                        Posted by {selectedPost.author.name} • {formatTimeAgo(selectedPost.createdAt)}
                      </DialogDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedPost.isPinned && <Pin className="w-4 h-4 text-yellow-400" />}
                      {selectedPost.isLocked && <Lock className="w-4 h-4 text-red-400" />}
                      {selectedPost.isSolved && <CheckCircle className="w-4 h-4 text-green-400" />}
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Post Content */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-purple-100 whitespace-pre-wrap">{selectedPost.content}</p>
                    
                    <div className="flex flex-wrap gap-1 mt-4">
                      {selectedPost.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-purple-500/20 text-purple-200">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Replies */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      {replies.length} Replies
                    </h3>
                    <div className="space-y-4">
                      {replies.map((reply) => (
                        <div key={reply.id} className="bg-white/5 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={reply.author.avatar} />
                              <AvatarFallback>
                                {reply.author.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-white font-medium">{reply.author.name}</span>
                                <Badge variant="outline" className="border-purple-400 text-purple-200 text-xs">
                                  {reply.author.role}
                                </Badge>
                                {reply.isAnswer && (
                                  <Badge className="bg-green-500 text-white text-xs">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Best Answer
                                  </Badge>
                                )}
                                <span className="text-purple-300 text-sm">
                                  {formatTimeAgo(reply.createdAt)}
                                </span>
                              </div>
                              <p className="text-purple-100">{reply.content}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <Button variant="ghost" size="sm" className="text-purple-300 hover:text-white hover:bg-white/10">
                                  <ThumbsUp className="w-4 h-4 mr-1" />
                                  {reply.likes}
                                </Button>
                                <Button variant="ghost" size="sm" className="text-purple-300 hover:text-white hover:bg-white/10">
                                  Reply
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reply Form */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Add Reply</h3>
                    <Textarea
                      placeholder="Write your reply..."
                      className="bg-slate-800 border-white/20 text-white placeholder-purple-300"
                      rows={4}
                    />
                    <div className="flex justify-end mt-2">
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                        Post Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}