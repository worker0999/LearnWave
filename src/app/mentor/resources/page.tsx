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
          <h1 className="text-3xl font-bold text-white">Resources</h1>
          <p className="text-purple-200">Upload, manage, and share learning materials</p>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="upload" className="text-white">
          <TabsList className="bg-white/10 border border-white/20 rounded-xl backdrop-blur-md mb-4">
            <TabsTrigger
              value="upload"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Upload Resources
            </TabsTrigger>
            <TabsTrigger
              value="manage"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Manage Resources
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Upload New Resource</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-purple-200">
                    Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter resource title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-purple-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-purple-200">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Enter resource description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-purple-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file" className="text-purple-200">
                    File
                  </Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    className="bg-white/5 border-white/20 text-white file:text-purple-300"
                  />
                  {selectedFile && (
                    <p className="text-sm text-purple-300">
                      Selected file: <span className="font-semibold">{selectedFile.name}</span>
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Upload Resource
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Tab */}
          <TabsContent value="manage">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Your Resources</CardTitle>
              </CardHeader>
              <CardContent>
                {/* TODO: Replace with dynamic resource list */}
                <p className="text-purple-200 italic">No resources uploaded yet.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
