'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { Send, Search, Mail, Loader2 } from 'lucide-react'
import { useRef } from 'react'
import { useEffect as useIsomorphicLayoutEffect } from 'react'

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

export function StudentMessages() {
    const { user } = useAuth()
    const { toast } = useToast()
    const [chats, setChats] = useState<Chat[]>([])
    const [messages, setMessages] = useState<Message[]>([])
    const [selectedChat, setSelectedChat] = useState<string | null>(null)
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
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

                // Handle initial chat selection from local storage
                const initialChatUserId = localStorage.getItem('initialChatUserId')
                if (initialChatUserId) {
                    const targetRoom = transformedRooms.find((r: any) => r.user.id === initialChatUserId)
                    if (targetRoom) {
                        setSelectedChat(targetRoom.id)
                    }
                    localStorage.removeItem('initialChatUserId')
                }
            }
        } catch (error) {
            console.error('Error fetching chat rooms:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRooms()
    }, [])

    // Real-time sync: Polling for messages
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
                    // Only update if message count changed or different
                    setMessages(data.messages)
                }
            } catch (error) {
                console.error('Error fetching messages:', error)
            }
        }

        fetchMessages()
        const interval = setInterval(fetchMessages, 5000) // Poll every 5s
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
        <div className="flex h-[calc(100vh-280px)] gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden min-h-[400px]">
            {/* Chats List */}
            <Card className="w-80 bg-white border-[#E8DFD3] flex flex-col shadow-sm">
                <CardHeader className="p-4 border-b border-[#E8DFD3]">
                    <CardTitle className="text-lg font-bold text-[#4A3F33]">Messages</CardTitle>
                    <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9B8B7E]" />
                        <Input
                            placeholder="Search chats..."
                            className="pl-9 bg-[#FDFBF9] border-[#E8DFD3] text-sm h-9 rounded-xl"
                        />
                    </div>
                </CardHeader>
                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-1">
                        {chats.length === 0 && !loading && (
                            <div className="text-center py-8 px-4">
                                <p className="text-xs text-[#9B8B7E]">No conversations yet. Connect with a mentor to start chatting!</p>
                            </div>
                        )}
                        {chats.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => setSelectedChat(chat.id)}
                                className={`w-full p-3 rounded-2xl flex items-center space-x-3 transition-all ${selectedChat === chat.id
                                    ? 'bg-[#E8DFD3] text-[#6B5844]'
                                    : 'hover:bg-[#F5F0EA] text-[#9B8B7E]'
                                    }`}
                            >
                                <Avatar className="h-10 w-10 border border-white/50">
                                    <AvatarImage src={chat.user.avatar} />
                                    <AvatarFallback className="bg-[#D4C4B0] text-[#6B5844]">{chat.user.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 text-left min-w-0">
                                    <div className="flex justify-between items-center">
                                        <p className="font-bold text-sm truncate text-[#4A3F33]">{chat.user.name}</p>
                                        {chat.unread > 0 && (
                                            <span className="bg-[#6B5844] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                                {chat.unread}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs truncate opacity-70">{chat.lastMessage || 'Start a conversation'}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </Card>

            {/* Chat Area */}
            <Card className="flex-1 bg-white border-[#E8DFD3] flex flex-col shadow-sm overflow-hidden">
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-[#E8DFD3] flex items-center space-x-3 bg-white">
                            <Avatar className="h-10 w-10 border border-[#E8DFD3]">
                                <AvatarImage src={chats.find(c => c.id === selectedChat)?.user.avatar} />
                                <AvatarFallback className="bg-[#E8DFD3] text-[#6B5844]">
                                    {chats.find(c => c.id === selectedChat)?.user.name[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="font-bold text-[#4A3F33]">
                                    {chats.find(c => c.id === selectedChat)?.user.name}
                                </h2>
                                <p className="text-xs text-green-600 font-medium">Mentor</p>
                            </div>
                        </div>

                        {/* Messages Scroll Area */}
                        <ScrollArea className="flex-1 p-6 bg-[#FDFBF9]">
                            <div className="space-y-6">
                                {messages.length === 0 && (
                                    <div className="text-center py-20 text-[#9B8B7E]">
                                        <Mail size={40} className="mx-auto opacity-20 mb-4" />
                                        <p>No messages yet. Say hi!</p>
                                    </div>
                                )}
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.sender.id === user?.id ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex flex-col ${message.sender.id === user?.id ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                            <div
                                                className={`p-3 rounded-2xl shadow-sm ${message.sender.id === user?.id
                                                    ? 'bg-[#6B5844] text-white rounded-tr-none'
                                                    : 'bg-white border border-[#E8DFD3] text-[#4A3F33] rounded-tl-none'
                                                    }`}
                                            >
                                                <p className="text-sm leading-relaxed">{message.content}</p>
                                            </div>
                                            <span className="text-[10px] text-[#9B8B7E] mt-1 px-1">
                                                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-[#E8DFD3] shrink-0">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    handleSendMessage()
                                }}
                                className="flex space-x-2"
                            >
                                <Input
                                    placeholder="Type your message here..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-1 bg-[#FDFBF9] border-[#E8DFD3] rounded-xl focus-visible:ring-[#6B5844]"
                                />
                                <Button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="bg-[#6B5844] hover:bg-[#4A3F33] text-white rounded-xl h-10 w-10 p-0 shrink-0"
                                >
                                    <Send size={18} />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-[#9B8B7E] space-y-4">
                        <div className="h-20 w-20 rounded-full bg-[#F5F0EA] flex items-center justify-center text-[#D4C4B0]">
                            <Mail size={40} />
                        </div>
                        <div className="text-center">
                            <h3 className="font-bold text-[#4A3F33]">Your Conversations</h3>
                            <p className="text-sm">Select a mentor to start or continue your chat.</p>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    )
}
