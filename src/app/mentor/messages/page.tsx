'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

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

export default function MentorMessages() {
  const [chats, setChats] = useState<Chat[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    // TODO: Fetch actual chats from API
    setChats([
      {
        id: '1',
        user: {
          id: '101',
          name: 'John Doe',
          avatar: '/avatars/john.jpg'
        },
        lastMessage: 'When is our next session?',
        unread: 2
      },
      {
        id: '2',
        user: {
          id: '102',
          name: 'Jane Smith',
          avatar: '/avatars/jane.jpg'
        },
        lastMessage: 'Thanks for the help!',
        unread: 0
      }
    ])
  }, [])

  useEffect(() => {
    if (selectedChat) {
      // TODO: Fetch actual messages for selected chat
      setMessages([
        {
          id: '1',
          sender: {
            id: '101',
            name: 'John Doe',
            avatar: '/avatars/john.jpg'
          },
          content: 'Hi, when is our next session?',
          timestamp: '2023-11-09T10:00:00Z'
        },
        {
          id: '2',
          sender: {
            id: 'mentor',
            name: 'You',
            avatar: '/avatars/mentor.jpg'
          },
          content: 'Hello! We have it scheduled for tomorrow at 2 PM.',
          timestamp: '2023-11-09T10:05:00Z'
        }
      ])
    }
  }, [selectedChat])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return

    // TODO: Implement message sending
    const message: Message = {
      id: Date.now().toString(),
      sender: {
        id: 'mentor',
        name: 'You',
        avatar: '/avatars/mentor.jpg'
      },
      content: newMessage,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* Chat List */}
        <Card className="col-span-12 md:col-span-4 backdrop-blur-md bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh]">
              <div className="space-y-4">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`flex items-center space-x-4 p-3 rounded-lg cursor-pointer ${
                      selectedChat === chat.id ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                    onClick={() => setSelectedChat(chat.id)}
                  >
                    <Avatar>
                      <AvatarImage src={chat.user.avatar} />
                      <AvatarFallback>{chat.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white">{chat.user.name}</p>
                      {chat.lastMessage && (
                        <p className="text-sm text-gray-300 truncate">{chat.lastMessage}</p>
                      )}
                    </div>
                    {chat.unread > 0 && (
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Message Area */}
        <Card className="col-span-12 md:col-span-8 backdrop-blur-md bg-white/10 border-white/20">
          <CardContent className="p-0 h-full flex flex-col">
            {selectedChat ? (
              <>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender.id === 'mentor' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.sender.id === 'mentor' ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-200'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">{new Date(message.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage}>Send</Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-300">Select a chat to start messaging</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}