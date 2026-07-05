'use client'

import React from 'react'
import { X, ZoomIn, ZoomOut, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Document, Page, pdfjs } from 'react-pdf'

// Set worker source for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFPreviewProps {
    url: string | null
    title?: string
    fileName?: string
    isOpen?: boolean
    onClose: () => void
    onDownload?: () => void
}

export function PDFPreview({ url, title, fileName, isOpen = true, onClose, onDownload }: PDFPreviewProps) {
    const [numPages, setNumPages] = React.useState<number | null>(null)
    const [pageNumber, setPageNumber] = React.useState(1)
    const [scale, setScale] = React.useState(1.0)

    // Use fileName if title is not explicitly provided
    const displayTitle = title || fileName || 'PDF Preview';

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages)
    }

    if (!url) return null

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0 bg-slate-900 border-slate-700">
                <DialogHeader className="p-4 border-b border-slate-700 bg-slate-900 flex flex-row items-center justify-between space-y-0">
                    <DialogTitle className="text-slate-100">{displayTitle}</DialogTitle>
                    <div className="flex items-center space-x-2">
                        {onDownload && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onDownload}
                                className="text-slate-400 hover:text-slate-100 mr-2"
                            >
                                <Download className="w-4.5 h-4.5" />
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
                            className="text-slate-400 hover:text-slate-100"
                        >
                            <ZoomOut className="w-4 h-4" />
                        </Button>
                        <span className="text-slate-400 text-sm w-12 text-center">
                            {Math.round(scale * 100)}%
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setScale(s => Math.min(3.0, s + 0.1))}
                            className="text-slate-400 hover:text-slate-100"
                        >
                            <ZoomIn className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-100"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-auto bg-slate-800 flex justify-center p-4">
                    <Document
                        file={url}
                        onLoadSuccess={onDocumentLoadSuccess}
                        className="flex flex-col gap-4"
                        loading={
                            <div className="flex items-center justify-center h-full text-slate-400">
                                Loading PDF...
                            </div>
                        }
                    >
                        {Array.from(new Array(numPages), (el, index) => (
                            <Page
                                key={`page_${index + 1}`}
                                pageNumber={index + 1}
                                scale={scale}
                                className="shadow-lg"
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                            />
                        ))}
                    </Document>
                </div>

                {numPages && (
                    <div className="p-2 border-t border-slate-700 bg-slate-900 text-center text-slate-400 text-sm">
                        Showing {numPages} pages
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
