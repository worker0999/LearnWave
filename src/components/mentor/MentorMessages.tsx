'use client'

import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

interface Message {
  id: string
  sender: {
    id: string
    name: string
    avatar?: string
  }
  content: string
  timestamp: string
}

interface Chat {
  id: string
  user: {
    id: string
    name: string
    avatar?: string
  }
  lastMessage?: string
  unread: number
}

export function MentorMessages() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [chats, setChats] = useState<Chat[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages])

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/messages/rooms', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        const transformedRooms = data.rooms.map((room: any) => ({
          id: room.id,
          user: room.users[0] || { id: 'unknown', name: 'Unknown User' },
          lastMessage: room.lastMessage,
          unread: 0
        }))
        setChats(transformedRooms)

        // Handle initial selection from roster redirection
        const initialUserId = localStorage.getItem('initialChatUserId')
        if (initialUserId) {
          const target = transformedRooms.find((r: any) => r.user.id === initialUserId)
          if (target) {
            setSelectedChat(target.id)
          }
          localStorage.removeItem('initialChatUserId')
        }
      }
    } catch (error) {
      console.error('Error fetching chat rooms:', error)
      toast({
        title: "Error",
        description: "Failed to load chats",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  // Sync: Polling for new messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`/api/messages/rooms/${selectedChat}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setMessages(data.messages)
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }
    fetchMessages()
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [selectedChat])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          roomId: selectedChat,
          content: newMessage
        })
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(prev => [...prev, data.message])
        setNewMessage('')

        // Update the chat list last message
        setChats(prev => prev.map(chat =>
          chat.id === selectedChat
            ? { ...chat, lastMessage: newMessage }
            : chat
        ))
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col overflow-hidden max-w-7xl mx-auto">
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        {/* Chat List */}
        <Card className="col-span-12 md:col-span-4 lg:col-span-3 flex flex-col bg-white border-[#B6D9E0] overflow-hidden rounded-[24px]">
          <CardHeader className="py-4 px-4 border-b border-[#B6D9E0] bg-[#DBE2DC]/30">
            <CardTitle className="text-lg text-[#335765] font-bold">Recent Chats</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto custom-scrollbar">
              <div className="divide-y divide-[#B6D9E0]/50">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`flex items-center space-x-3 p-4 cursor-pointer transition-colors ${selectedChat === chat.id ? 'bg-[#DBE2DC]' : 'hover:bg-[#DBE2DC]/30'
                      }`}
                    onClick={() => setSelectedChat(chat.id)}
                  >
                    <Avatar className="h-10 w-10 border border-[#B6D9E0]">
                      <AvatarImage src={chat.user.avatar} />
                      <AvatarFallback className="bg-[#B6D9E0] text-[#335765] font-bold">{chat.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <p className="font-bold text-[#335765] truncate">{chat.user.name}</p>
                        {chat.unread > 0 && (
                          <span className="bg-[#335765] text-white px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                      {chat.lastMessage && (
                        <p className="text-xs text-[#74A8A4] truncate mt-0.5">{chat.lastMessage}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Message Area */}
        <Card className="col-span-12 md:col-span-8 lg:col-span-9 flex flex-col bg-white border-[#B6D9E0] overflow-hidden rounded-[24px]">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-[#B6D9E0] flex items-center space-x-3 bg-white">
                <Avatar className="h-10 w-10 border border-[#B6D9E0]">
                  <AvatarImage src={chats.find(c => c.id === selectedChat)?.user.avatar} />
                  <AvatarFallback className="bg-[#B6D9E0] text-[#335765] font-bold">
                    {chats.find(c => c.id === selectedChat)?.user.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-bold text-[#335765]">
                    {chats.find(c => c.id === selectedChat)?.user.name}
                  </h2>
                  <p className="text-xs text-green-600 font-medium">Online</p>
                </div>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-6 bg-white custom-scrollbar">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender.id === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                    >
                      <div className={`flex flex-col ${message.sender.id === user?.id ? 'items-end' : 'items-start'} max-w-[75%]`}>
                        <div
                          className={`p-3 rounded-2xl shadow-sm ${message.sender.id === user?.id
                            ? 'bg-[#335765] text-white rounded-tr-none'
                            : 'bg-white border border-[#B6D9E0] text-[#335765] rounded-tl-none'
                            }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>
                        <span className="text-[10px] text-[#74A8A4] mt-1 px-1 font-bold">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={scrollRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-[#B6D9E0]">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message here..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendMessage()
                    }}
                    className="bg-[#DBE2DC]/30 border-[#B6D9E0] focus:ring-[#335765] focus:border-[#335765] rounded-xl h-12 text-[#335765]"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-[#335765] hover:bg-[#7F543D] text-white px-6 rounded-xl h-12 font-bold shadow-md"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-white">
              <div className="w-20 h-20 bg-[#DBE2DC] rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-[#335765]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#335765] mb-2">No Conversation Selected</h3>
              <p className="text-[#74A8A4] max-w-xs font-medium">
                Select a student from the sidebar to view your conversation history or start a new chat.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
