'use client'

import { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import PDF components to avoid SSR issues
const Document = dynamic(() => import('react-pdf').then(mod => ({ default: mod.Document })), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-96"><div className="text-gray-500">Loading PDF viewer...</div></div>
})

const Page = dynamic(() => import('react-pdf').then(mod => ({ default: mod.Page })), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-96"><div className="text-gray-500">Loading page...</div></div>
})

import { pdfjs } from 'react-pdf'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, RefreshCw, ExternalLink } from 'lucide-react'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

// Configure PDF.js worker with a more reliable CDN
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
}

interface PDFPreviewProps {
  url: string
  fileName: string
  onClose: () => void
  onDownload: () => void
}

export function PDFPreview({ url, fileName, onClose, onDownload }: PDFPreviewProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState<number>(0)
  const [useFallback, setUseFallback] = useState<boolean>(false)

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('⏰ PDF loading timeout - switching to fallback')
        setError('PDF loading timed out. The file might be too large or the server is slow to respond.')
        setLoading(false)
      }
    }, 30000) // 30 second timeout

    return () => clearTimeout(timeout)
  }, [loading, retryKey])

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    console.log('📄 PDF loaded successfully, pages:', numPages)
    setNumPages(numPages)
    setLoading(false)
    setError(null)
  }, [])

  const onDocumentLoadError = useCallback((error: any) => {
    console.error('❌ PDF load error:', error)
    setError('Failed to load PDF. The file might be corrupted or requires authentication.')
    setLoading(false)
  }, [])

  const changePage = useCallback((offset: number) => {
    setPageNumber(prevPageNumber => Math.min(Math.max(1, prevPageNumber + offset), numPages))
  }, [numPages])

  const previousPage = useCallback(() => changePage(-1), [changePage])
  const nextPage = useCallback(() => changePage(1), [changePage])

  const zoomIn = useCallback(() => {
    setScale(prevScale => Math.min(prevScale + 0.2, 3.0))
  }, [])

  const zoomOut = useCallback(() => {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5))
  }, [])

  const retryLoad = useCallback(() => {
    setLoading(true)
    setError(null)
    setRetryKey(prev => prev + 1)
    setUseFallback(false)
  }, [])

  const openInNewTab = useCallback(() => {
    const token = localStorage.getItem('token')
    if (token) {
      // Create a new window with the PDF URL
      const newWindow = window.open(url, '_blank')
      if (newWindow) {
        newWindow.focus()
      }
    }
  }, [url])

  // Create a authenticated PDF file object
  const createPDFFile = useCallback(() => {
    const token = localStorage.getItem('token')
    
    // Return a function that react-pdf can call to get the PDF data
    return async () => {
      if (!token) {
        throw new Error('No authentication token found')
      }
      
      try {
        console.log('🔍 Loading PDF with authentication...')
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`)
        }

        const arrayBuffer = await response.arrayBuffer()
        console.log('✅ PDF data loaded successfully, size:', arrayBuffer.byteLength)
        return arrayBuffer
      } catch (error) {
        console.error('❌ Failed to load PDF data:', error)
        throw error
      }
    }
  }, [url])

  useEffect(() => {
    console.log('🔍 PDF Preview Debug - URL:', url)
    console.log('🔍 PDF Preview Debug - File name:', fileName)
  }, [url, fileName])

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 truncate">
            {fileName}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={openInNewTab}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in New Tab
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={previousPage}
                disabled={pageNumber <= 1}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <span className="text-sm text-gray-600 min-w-[80px] text-center">
                Page {pageNumber} of {numPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={pageNumber >= numPages}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={zoomOut}
                disabled={scale <= 0.5}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              
              <span className="text-sm text-gray-600 min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={zoomIn}
                disabled={scale >= 3.0}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              
              {(error || useFallback) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={retryLoad}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              )}
            </div>
          </div>
          
          {/* PDF Viewer */}
          <div className="overflow-auto max-h-[60vh] border border-gray-200 rounded-lg bg-gray-50">
            {loading && (
              <div className="flex items-center justify-center h-96">
                <div className="text-gray-500 flex flex-col items-center">
                  <RefreshCw className="w-6 h-6 animate-spin mb-2" />
                  Loading PDF...
                  <div className="text-xs mt-2 text-gray-400">This may take a moment for large files</div>
                </div>
              </div>
            )}
            
            {error && !useFallback && (
              <div className="flex items-center justify-center h-96">
                <div className="text-red-500 flex flex-col items-center text-center max-w-md">
                  <div className="mb-4">❌</div>
                  <div className="font-semibold mb-2">Failed to load PDF</div>
                  <div className="text-sm mb-4">{error}</div>
                  <div className="flex flex-col space-y-2">
                    <Button onClick={retryLoad} variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                    <Button onClick={openInNewTab} variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open in New Tab
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {!useFallback ? (
              <Document
                key={retryKey}
                // react-pdf accepts many file types; createPDFFile returns a loader function
                // cast to any to satisfy the typing in this wrapper.
                file={createPDFFile() as any}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="flex items-center justify-center h-96">
                    <div className="text-gray-500 flex flex-col items-center">
                      <RefreshCw className="w-6 h-6 animate-spin mb-2" />
                      Loading PDF...
                    </div>
                  </div>
                }
                error={
                  <div className="flex items-center justify-center h-96">
                    <div className="text-red-500 flex flex-col items-center text-center max-w-md">
                      <div className="mb-4">❌</div>
                      <div className="font-semibold mb-2">Failed to load PDF</div>
                      <div className="text-sm mb-4">Please check if the file is a valid PDF</div>
                      <div className="flex flex-col space-y-2">
                        <Button onClick={retryLoad} variant="outline" size="sm">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Try Again
                        </Button>
                        <Button onClick={openInNewTab} variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open in New Tab
                        </Button>
                      </div>
                    </div>
                  </div>
                }
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  className="flex justify-center"
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  onRenderError={(error) => {
                    console.error('❌ Page render error:', error)
                    setError('Failed to render PDF page. Please try again.')
                  }}
                />
              </Document>
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="text-gray-500 text-center">
                  <div className="mb-4">📄</div>
                  <div className="font-semibold mb-2">PDF Preview Unavailable</div>
                  <div className="text-sm mb-4">Please use the options above to view the PDF</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Page Navigation Info */}
          <div className="mt-4 text-center text-sm text-gray-500">
            Use navigation controls to browse through pages or zoom in/out for better readability
          </div>
        </CardContent>
      </Card>
    </div>
  )
}