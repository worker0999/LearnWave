'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'

export function MentorResources() {
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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <h1 className="text-4xl font-black text-[#335765] tracking-tight">Resources</h1>
        <p className="text-[#74A8A4] font-medium">Upload, manage, and share learning materials</p>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="bg-[#DBE2DC] border border-[#B6D9E0] rounded-xl p-1 mb-6">
          <TabsTrigger
            value="upload"
            className="rounded-lg data-[state=active]:bg-[#335765] data-[state=active]:text-white text-[#74A8A4] font-bold transition-all"
          >
            Upload Resources
          </TabsTrigger>
          <TabsTrigger
            value="manage"
            className="rounded-lg data-[state=active]:bg-[#335765] data-[state=active]:text-white text-[#74A8A4] font-bold transition-all"
          >
            Manage Resources
          </TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload">
          <Card className="bg-white border-[#B6D9E0] shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-[#DBE2DC]/30 border-b border-[#B6D9E0]">
              <CardTitle className="text-xl font-bold text-[#335765]">Upload New Resource</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-[#74A8A4] font-bold">
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="Enter resource title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-[#F4F6F8] border-[#B6D9E0] rounded-xl h-12 text-[#335765] placeholder:text-[#74A8A4]/60 focus:border-[#335765] transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-[#74A8A4] font-bold">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter resource description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-[#F4F6F8] border-[#B6D9E0] rounded-xl p-4 text-[#335765] placeholder:text-[#74A8A4]/60 focus:border-[#335765] transition-colors resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file" className="text-[#74A8A4] font-bold">
                  File
                </Label>
                <div className="relative">
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    className="bg-[#F4F6F8] border-[#B6D9E0] rounded-xl h-12 text-[#335765] file:text-[#335765] file:font-bold file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:bg-[#B6D9E0]/50 hover:file:bg-[#B6D9E0] transition-colors cursor-pointer"
                  />
                </div>
                {selectedFile && (
                  <p className="text-sm text-[#74A8A4] mt-2 font-medium">
                    Selected file: <span className="font-bold text-[#335765]">{selectedFile.name}</span>
                  </p>
                )}
              </div>

              <Button
                onClick={handleUpload}
                disabled={!selectedFile}
                className="w-full md:w-auto bg-[#335765] hover:bg-[#7F543D] text-white font-bold h-12 px-8 rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                Upload Resource
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manage Tab */}
        <TabsContent value="manage">
          <Card className="bg-white border-[#B6D9E0] shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-[#DBE2DC]/30 border-b border-[#B6D9E0]">
              <CardTitle className="text-xl font-bold text-[#335765]">Your Resources</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {/* TODO: Replace with dynamic resource list */}
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-[#DBE2DC] rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-[#B6D9E0] font-black text-2xl">?</span>
                </div>
                <p className="text-[#335765] font-bold text-lg mb-1">No resources found</p>
                <p className="text-[#74A8A4] text-sm">Upload some materials to share with your students.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
