'use client'

import { useState } from 'react'
import { Download, Eye, X, BookOpen, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface DownloaderProps {
  resourceId: string
  fileName: string
  title: string
}

export function PublicResourceDownloader({ resourceId, fileName, title }: DownloaderProps) {
  const [downloading, setDownloading] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAction = async (preview: boolean) => {
    setDownloading(true)
    setError(null)
    try {
      const url = `/api/uploads?id=${resourceId}${preview ? '&preview=true' : ''}`
      const response = await fetch(url)
      
      if (response.status === 429) {
        setShowPaywall(true)
        setDownloading(false)
        return
      }

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to download file')
      }

      if (preview) {
        // Open file in a new tab for preview
        window.open(url, '_blank')
      } else {
        // Trigger direct file download
        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = fileName || title || 'download'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => handleAction(true)}
          disabled={downloading}
          className="px-3.5 py-2 bg-white border border-[#DDE3EA] hover:border-[#1E1E1E] text-[#1E1E1E] hover:bg-[#F4F6F8] rounded-xl flex items-center justify-center gap-1.5 font-bold text-xs transition-all shadow-sm disabled:opacity-50 cursor-pointer"
        >
          <Eye size={14} className="stroke-[2.5]" />
          <span>Preview</span>
        </button>
        <button
          onClick={() => handleAction(false)}
          disabled={downloading}
          className="px-3.5 py-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl flex items-center justify-center gap-1.5 font-bold text-xs transition-all shadow-sm disabled:opacity-50 cursor-pointer"
        >
          <Download size={14} className="stroke-[2.5]" />
          <span>{downloading ? 'Loading...' : 'Download'}</span>
        </button>
      </div>

      {error && (
        <p className="text-[10px] text-red-500 font-semibold mt-1.5">{error}</p>
      )}

      {/* Modern Signup Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FDFBF9] border border-[#dfd3c3] rounded-[2rem] w-full max-w-md p-8 relative shadow-2xl animate-in fade-in zoom-in duration-200 text-center font-sans">
            <button
              onClick={() => setShowPaywall(false)}
              className="absolute right-5 top-5 p-1.5 bg-[#F4F6F8] hover:bg-red-50 text-[#8A919B] hover:text-red-500 rounded-full transition-all border border-[#DDE3EA]"
            >
              <X size={16} />
            </button>

            <div className="w-16 h-16 bg-[#4f46e5]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#4f46e5]">
              <BookOpen size={32} />
            </div>

            <h3 className="text-2xl font-black text-[#1E1E1E] tracking-tight mb-2">Limit Reached!</h3>
            <p className="text-sm text-[#8A919B] leading-relaxed mb-6">
              You've downloaded 20 resources this hour. Sign up for a free account to unlock unlimited access and start learning smarter.
            </p>

            <div className="space-y-4">
              <Link href="/auth/register" className="block w-full">
                <button className="w-full py-3 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <Sparkles size={16} />
                  <span>Start Learning Free</span>
                  <ArrowRight size={14} />
                </button>
              </Link>
              <button
                onClick={() => setShowPaywall(false)}
                className="w-full py-3 bg-white border border-[#DDE3EA] hover:border-[#1E1E1E] text-[#8A919B] hover:text-[#1E1E1E] rounded-xl font-bold text-sm transition-all cursor-pointer"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
