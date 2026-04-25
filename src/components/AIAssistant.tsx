'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Bot, Sparkles, MessageSquare, Zap, X, Send, Copy, ArrowRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function AIAssistant() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messages.length > 0) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const aiFeatures = [
    {
      id: 'smart-tutor',
      title: 'Smart Tutor',
      description: 'Personalized learning assistance tailored to your pace',
      icon: <Bot size={24} />,
      bg: '#E5F0A0',
      systemPrompt: 'You are a helpful AI tutor for VTU students.'
    },
    {
      id: 'content-generator',
      title: 'Content Generator',
      description: 'Auto-generate summaries, notes and study guides',
      icon: <Sparkles size={24} />,
      bg: '#D4E4C8',
      systemPrompt: 'You are an AI that generates study materials.'
    },
    {
      id: 'qa-assistant',
      title: 'Q&A Assistant',
      description: 'Get instant, accurate answers to any question',
      icon: <MessageSquare size={24} />,
      bg: '#E8EDF3',
      systemPrompt: 'You are a Q&A assistant.'
    },
    {
      id: 'summarizer',
      title: 'Quick Summarizer',
      description: 'Summarize long texts and documents in seconds',
      icon: <Zap size={24} />,
      bg: '#D4E4C8',
      systemPrompt: 'You are a text summarizer.'
    }
  ]

  const handleFeatureClick = (featureId: string) => {
    setSelectedFeature(featureId)
    const feature = aiFeatures.find(f => f.id === featureId)
    setMessages([{
      id: '1',
      role: 'assistant',
      content: `Hello! I'm your **${feature?.title}**. ${feature?.description}. How can I help you today?`,
      timestamp: new Date()
    }])
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ messages: [...messages, userMessage], feature: selectedFeature })
      })

      const data = await response.json()
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const copyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const feature = aiFeatures.find(f => f.id === selectedFeature)

  if (selectedFeature && feature) {
    return (
      <div className="flex flex-col h-[calc(100vh-220px)] min-h-[500px] animate-in fade-in zoom-in-95 duration-300">
        {/* Chat Header */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#DDE3EA]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: feature.bg }}>
              <span className="text-[#1E1E1E]">{feature.icon}</span>
            </div>
            <div>
              <h3 className="text-[#1E1E1E] font-bold text-lg">{feature.title}</h3>
              <p className="text-[#8A919B] text-xs">{feature.description}</p>
            </div>
          </div>
          <button
            onClick={() => { setSelectedFeature(null); setMessages([]); }}
            className="flex items-center gap-2 bg-[#F4F6F8] hover:bg-[#DDE3EA] text-[#8A919B] hover:text-[#1E1E1E] border border-[#DDE3EA] px-4 py-2 rounded-xl text-sm font-medium transition-all"
          >
            <X size={14} /> Close
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl flex items-center justify-center mr-2 shrink-0 mt-1" style={{ backgroundColor: feature.bg }}>
                  <Bot size={14} className="text-[#1E1E1E]" />
                </div>
              )}
              <div className="max-w-[80%] group relative">
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all ${
                    message.role === 'user'
                      ? 'bg-[#1E1E1E] text-white rounded-tr-sm shadow-black/5'
                      : 'bg-white border border-[#DDE3EA] text-[#1E1E1E] rounded-tl-sm'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="prose max-w-none prose-p:text-[#1E1E1E] prose-headings:text-[#1E1E1E] prose-strong:text-[#1E1E1E] prose-code:text-[#1E1E1E] prose-code:bg-[#E8EDF3] prose-code:rounded prose-li:text-[#1E1E1E]">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="font-medium">{message.content}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[#B0B7BF] text-[9px] font-bold">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {message.role === 'assistant' && (
                    <button onClick={() => copyMessage(message.id, message.content)} className="p-1 hover:bg-[#F4F6F8] rounded-md text-[#B0B7BF] hover:text-[#1E1E1E] transition-all">
                      <Copy size={10} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mr-2" style={{ backgroundColor: feature.bg }}>
                <Bot size={14} className="text-[#1E1E1E]" />
              </div>
              <div className="bg-[#F4F6F8] border border-[#DDE3EA] rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1.5 items-center h-4">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#8A919B] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input */}
        <div className="mt-4 pt-4 border-t border-[#DDE3EA]">
          <div className="flex gap-3">
            <input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
              placeholder="Ask anything..."
              disabled={isLoading}
              className="flex-1 bg-white border border-[#DDE3EA] text-[#1E1E1E] placeholder-[#B0B7BF] rounded-2xl px-5 py-3 outline-none focus:border-[#1E1E1E] transition-colors text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="w-11 h-11 rounded-2xl flex items-center justify-center bg-[#1E1E1E] text-white font-bold transition-all hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <p className="text-[#8A919B] text-xs font-semibold uppercase tracking-[0.2em] mb-1">Powered by AI</p>
        <h3 className="text-2xl font-extrabold text-[#1E1E1E] tracking-tight">AI Assistant</h3>
        <p className="text-[#8A919B] text-sm mt-1">Choose a tool to supercharge your learning</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {aiFeatures.map((feat, idx) => (
          <button
            key={feat.id}
            onClick={() => handleFeatureClick(feat.id)}
            className="group relative text-left bg-white border border-[#DDE3EA] rounded-3xl p-8 hover:border-[#1E1E1E] transition-all duration-500 overflow-hidden shadow-sm hover:shadow-md"
          >
            <div className="absolute -right-8 -top-8 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity rounded-full blur-2xl" style={{ backgroundColor: feat.bg }}></div>
            
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-black/5 group-hover:-translate-y-1" style={{ backgroundColor: feat.bg }}>
              <span className="text-[#1E1E1E]">{feat.icon}</span>
            </div>
            <h4 className="text-[#1E1E1E] font-black text-xl mb-2 tracking-tight">{feat.title}</h4>
            <p className="text-[#8A919B] text-sm leading-relaxed font-medium mb-6">{feat.description}</p>
            <div className="flex items-center gap-2 font-black text-xs text-[#1E1E1E] uppercase tracking-widest">
              Try it now <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      {/* Example prompts */}
      <div className="bg-white border border-[#DDE3EA] rounded-2xl p-6">
        <h4 className="text-[#1E1E1E] font-bold mb-4">Quick Prompts</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Explain the concept of dynamic programming',
            'Summarize the OSI model in simple terms',
            'Create a study plan for data structures',
            'What is the difference between TCP and UDP?'
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => { handleFeatureClick('qa-assistant'); setInputMessage(prompt); }}
              className="text-left px-4 py-3 bg-[#F4F6F8] border border-[#DDE3EA] rounded-xl text-[#8A919B] text-sm hover:bg-[#EDF0F4] hover:text-[#1E1E1E] transition-all"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
