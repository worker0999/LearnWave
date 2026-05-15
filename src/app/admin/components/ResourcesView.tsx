import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { Search, Plus, FileText, Download, Trash2, RefreshCw, UploadCloud, FileType, Filter } from 'lucide-react'

export function ResourcesView() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [resources, setResources] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('ALL')

  // Mock data for UI demonstration since the API might not exist yet
  const fetchResources = async () => {
    setLoading(true)
    try {
      // Simulate API call
      setTimeout(() => {
        setResources([
          { id: '1', title: 'Data Structures Complete Notes', category: 'Computer Science', type: 'PDF', size: '2.4 MB', uploadedBy: 'Admin', date: '2026-05-10' },
          { id: '2', title: 'React Hooks Cheat Sheet', category: 'Web Development', type: 'PDF', size: '1.1 MB', uploadedBy: 'Admin', date: '2026-05-12' },
          { id: '3', title: 'Machine Learning Basics', category: 'AI & ML', type: 'DOCX', size: '3.8 MB', uploadedBy: 'Admin', date: '2026-05-14' },
          { id: '4', title: 'System Design Interview Prep', category: 'Computer Science', type: 'PDF', size: '5.2 MB', uploadedBy: 'Admin', date: '2026-05-15' },
        ])
        setLoading(false)
      }, 600)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResources()
  }, [])

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'ALL' || res.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-[#42413b] dark:text-[#f4f4f0] tracking-tight">Resource Library</h1>
          <p className="text-[#a9a29e] mt-1 text-lg">Manage global learning materials and files</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={fetchResources} 
            variant="outline" 
            className="border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0] bg-transparent hover:bg-[#f4f4f0] dark:hover:bg-[#1c1b19]"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button 
            onClick={() => setUploadDialogOpen(true)}
            className="bg-[#42413b] hover:bg-[#2a2826] text-[#f4f4f0] dark:bg-[#f4f4f0] dark:text-[#42413b] dark:hover:bg-[#dfd3c3] shadow-sm transform hover:-translate-y-0.5 transition-all active:translate-y-0"
          >
            <Plus className="w-4 h-4 mr-2" /> Upload Resource
          </Button>
        </div>
      </div>

      <Card className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-[#dfd3c3] dark:border-[#42413b] bg-gray-50/50 dark:bg-black/10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a9a29e] w-4 h-4" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#ffffff] dark:bg-[#1c1b19] border-[#dfd3c3] dark:border-[#42413b] focus-visible:ring-[#c8ced8] text-[#42413b] dark:text-[#f4f4f0] h-10 rounded-xl"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48 bg-[#ffffff] dark:bg-[#1c1b19] border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0] h-10 rounded-xl">
                <Filter className="w-4 h-4 mr-2 text-[#a9a29e]" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b]">
                <SelectItem value="ALL">All Categories</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Web Development">Web Development</SelectItem>
                <SelectItem value="AI & ML">AI & ML</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-[#dfd3c3] dark:border-[#42413b] hover:bg-transparent">
                <TableHead className="text-[#a9a29e] font-medium h-12 px-6">File Name</TableHead>
                <TableHead className="text-[#a9a29e] font-medium h-12">Category</TableHead>
                <TableHead className="text-[#a9a29e] font-medium h-12">Type & Size</TableHead>
                <TableHead className="text-[#a9a29e] font-medium h-12">Uploaded</TableHead>
                <TableHead className="text-right text-[#a9a29e] font-medium h-12 px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.map((res) => (
                <TableRow key={res.id} className="border-[#dfd3c3] dark:border-[#42413b] hover:bg-[#f4f4f0]/50 dark:hover:bg-[#1c1b19]/50 transition-colors group">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#c8ced8]/30 dark:bg-[#42413b] flex items-center justify-center flex-shrink-0 text-[#42413b] dark:text-[#f4f4f0]">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="font-semibold text-[#42413b] dark:text-[#f4f4f0]">{res.title}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-[#a9a29e]">{res.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium bg-[#f4f4f0] dark:bg-[#1c1b19] border border-[#dfd3c3] dark:border-[#42413b] px-2 py-1 rounded text-[#42413b] dark:text-[#f4f4f0]">
                        {res.type}
                      </span>
                      <span className="text-sm text-[#a9a29e]">{res.size}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[#a9a29e] text-sm">{res.date}</TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="ghost" className="text-[#a9a29e] hover:text-[#42413b] dark:hover:text-[#f4f4f0] h-8 w-8 rounded-full">
                        <Download size={16} />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-[#a9a29e] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 h-8 w-8 rounded-full transition-colors">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredResources.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-[#a9a29e]">
                    No resources found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#42413b] dark:text-[#f4f4f0]">Upload Resource</DialogTitle>
            <DialogDescription className="text-[#a9a29e]">Upload a new document to the global library.</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            <div>
              <label className="text-xs font-semibold text-[#a9a29e] uppercase tracking-wider mb-1 block">Title</label>
              <Input placeholder="e.g., Computer Networks Notes" className="bg-[#f4f4f0] dark:bg-[#1c1b19] border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#a9a29e] uppercase tracking-wider mb-1 block">Category</label>
              <Select defaultValue="Computer Science">
                <SelectTrigger className="bg-[#f4f4f0] dark:bg-[#1c1b19] border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Web Development">Web Development</SelectItem>
                  <SelectItem value="AI & ML">AI & ML</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="border-2 border-dashed border-[#dfd3c3] dark:border-[#42413b] rounded-xl p-8 text-center bg-[#f4f4f0]/50 dark:bg-[#1c1b19]/50 hover:bg-[#f4f4f0] dark:hover:bg-[#1c1b19] transition-colors cursor-pointer group">
              <UploadCloud className="w-10 h-10 text-[#a9a29e] group-hover:text-[#42413b] dark:group-hover:text-[#f4f4f0] mx-auto mb-3 transition-colors" />
              <p className="text-sm font-medium text-[#42413b] dark:text-[#f4f4f0]">Click to upload or drag and drop</p>
              <p className="text-xs text-[#a9a29e] mt-1">PDF, DOCX, PPTX up to 50MB</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)} className="border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0] hover:bg-[#f4f4f0] dark:hover:bg-[#1c1b19]">Cancel</Button>
            <Button className="bg-[#42413b] hover:bg-[#2a2826] text-[#f4f4f0] dark:bg-[#f4f4f0] dark:text-[#42413b] dark:hover:bg-[#dfd3c3]">Upload File</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
