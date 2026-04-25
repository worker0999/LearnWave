'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Clock, Mail, ArrowRight } from 'lucide-react'

export default function MentorSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-white mb-2">Application Submitted!</CardTitle>
            <CardDescription className="text-cyan-200 text-lg">
              Your mentor application is under review
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-cyan-200">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span>Review process typically takes 24-48 hours</span>
              </div>
              <div className="flex items-center space-x-3 text-cyan-200">
                <Mail className="w-5 h-5 text-blue-400" />
                <span>You'll receive an email once approved</span>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-2">What happens next?</h3>
              <ul className="text-cyan-200 text-sm space-y-1 text-left">
                <li>• Admin will review your profile and resume</li>
                <li>• You may be contacted for verification</li>
                <li>• Once approved, you can start mentoring</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Link href="/auth/login">
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white transition-all transform hover:scale-105">
                  Go to Login
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full border-cyan-400 text-cyan-200 hover:bg-cyan-500 hover:text-white transition-all">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}
