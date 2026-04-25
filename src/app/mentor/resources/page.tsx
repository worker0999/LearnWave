'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { toast } from '@/hooks/use-toast'

export default function MentorResources() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !title) {
      toast({
        title: 'Missing information',
        description: 'Please provide a title and select a file before uploading.',
      })
      return
    }

    // TODO: Connect to actual API upload logic
    toast({
      title: 'Uploading...',
      description: `Uploading ${selectedFile.name}`,
    })

    console.log('Uploading:', selectedFile.name)
  }

  return (
    <DashboardLayout userRole="MENTOR">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#4A3F33]">Resources</h1>
          <p className="text-[#9B8B7E]">Upload, manage, and share learning materials</p>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="upload" className="text-[#4A3F33]">
          <TabsList className="bg-[#F5F0EA] border border-[#E8DFD3] rounded-xl backdrop-blur-md mb-4">
            <TabsTrigger
              value="upload"
              className="data-[state=active]:bg-cyan-600 data-[state=active]:text-[#4A3F33]"
            >
              Upload Resources
            </TabsTrigger>
            <TabsTrigger
              value="manage"
              className="data-[state=active]:bg-cyan-600 data-[state=active]:text-[#4A3F33]"
            >
              Manage Resources
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload">
            <Card className="bg-white border-[#E8DFD3]">
              <CardHeader>
                <CardTitle className="text-[#4A3F33]">Upload New Resource</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-[#9B8B7E]">
                    Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter resource title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-white border-[#E8DFD3] text-[#4A3F33] placeholder:text-[#6B5844]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-[#9B8B7E]">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Enter resource description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-white border-[#E8DFD3] text-[#4A3F33] placeholder:text-[#6B5844]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file" className="text-[#9B8B7E]">
                    File
                  </Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    className="bg-white border-[#E8DFD3] text-[#4A3F33] file:text-[#6B5844]"
                  />
                  {selectedFile && (
                    <p className="text-sm text-[#6B5844]">
                      Selected file: <span className="font-semibold">{selectedFile.name}</span>
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile}
                  className="bg-cyan-600 hover:bg-cyan-700 text-[#4A3F33]"
                >
                  Upload Resource
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Tab */}
          <TabsContent value="manage">
            <Card className="bg-white border-[#E8DFD3]">
              <CardHeader>
                <CardTitle className="text-[#4A3F33]">Your Resources</CardTitle>
              </CardHeader>
              <CardContent>
                {/* TODO: Replace with dynamic resource list */}
                <p className="text-[#9B8B7E] italic">No resources uploaded yet.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

