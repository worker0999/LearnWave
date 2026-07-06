'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Sparkles, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription } from '@/components/ui/alert'
import ReactMarkdown from 'react-markdown'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

interface Message {
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

interface RAGChatProps {
    embed?: boolean
}

export default function RAGChat({ embed = false }: RAGChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Hello! I am your AI learning assistant. Ask me anything about your course materials, lecture notes, or general concepts. I can answer questions based on the uploaded resources.',
            timestamp: new Date()
        }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const { toast } = useToast()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage = input.trim()
        setInput('')

        // Add user message immediately
        setMessages(prev => [...prev, {
            role: 'user',
            content: userMessage,
            timestamp: new Date()
        }])

        setIsLoading(true)

        try {
            const token = localStorage.getItem('token')
            const response = await fetch('/api/ai/rag-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: userMessage })
            })

            if (!response.ok) {
                throw new Error('Failed to get response')
            }

            const data = await response.json()

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.response || "I'm sorry, I couldn't process that request.",
                timestamp: new Date()
            }])
        } catch (error) {
            console.error('Chat error:', error)
            toast({
                title: "Error",
                description: "Failed to get AI response. Please try again.",
                variant: "destructive"
            })
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Sorry, I encountered an error. Please try asking again.",
                timestamp: new Date()
            }])
        } finally {
            setIsLoading(false)
        }
    }

    const chatContent = (
        <div className="flex flex-col h-[calc(100vh-100px)]">
            <Card className="flex-1 flex flex-col bg-slate-900 border-slate-800 shadow-xl overflow-hidden">
                <CardHeader className="bg-slate-900 border-b border-slate-800 pb-4">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-white">AI Learning Assistant</CardTitle>
                            <CardDescription className="text-slate-400">
                                Powered by RAG technology using your course materials
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-0 min-h-0 relative">
                    <ScrollArea className="flex-1 p-4 md:p-6">
                        <div className="space-y-6 max-w-3xl mx-auto">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                        }`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-cyan-600 text-white'
                                            }`}
                                    >
                                        {message.role === 'user' ? (
                                            <User className="w-5 h-5" />
                                        ) : (
                                            <Bot className="w-5 h-5" />
                                        )}
                                    </div>

                                    <div
                                        className={`rounded-2xl px-5 py-3 max-w-[85%] shadow-md ${message.role === 'user'
                                                ? 'bg-blue-600 text-white rounded-tr-none'
                                                : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                                            }`}
                                    >
                                        {message.role === 'assistant' ? (
                                            <div className="prose prose-invert prose-sm max-w-none">
                                                <ReactMarkdown>{message.content}</ReactMarkdown>
                                            </div>
                                        ) : (
                                            <p className="whitespace-pre-wrap">{message.content}</p>
                                        )}

                                        <div className={`text-[10px] mt-1 opacity-70 ${message.role === 'user' ? 'text-blue-100' : 'text-slate-400'
                                            }`}>
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center flex-shrink-0">
                                        <Sparkles className="w-4 h-4 text-white animate-pulse" />
                                    </div>
                                    <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-none px-5 py-4 flex items-center space-x-2">
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>

                    <div className="p-4 bg-slate-900 border-t border-slate-800">
                        <div className="max-w-3xl mx-auto">
                            <form onSubmit={handleSubmit} className="relative flex items-center">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask a question about your course..."
                                    className="pr-12 py-6 bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus-visible:ring-cyan-500 rounded-full shadow-inner"
                                    disabled={isLoading}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-cyan-600 hover:bg-cyan-500 rounded-full w-9 h-9 transition-all"
                                    disabled={!input.trim() || isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                                    ) : (
                                        <Send className="w-4 h-4 text-white" />
                                    )}
                                </Button>
                            </form>
                            <div className="text-center mt-2">
                                <p className="text-xs text-slate-500">
                                    AI can make mistakes. Consider checking important information.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )

    if (embed) {
        return chatContent
    }

    return (
        <DashboardLayout userRole="STUDENT">
            {chatContent}
        </DashboardLayout>
    )
}
