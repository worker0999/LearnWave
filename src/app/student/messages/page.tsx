'use client'

import { useEffect, useState, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import {
    Send, Search, Mail, Bell, User, ChevronDown, ChevronLeft, UserCircle, LogOut,
    Settings as SettingsIcon, MessageCircle, Paperclip, Smile, Video,
    Plus, Shield, Clock, MapPin, ExternalLink, Info
} from 'lucide-react'
import { Sidebar } from '@/components/Sidebar'
import { useRouter } from 'next/navigation'
import { useUI } from '@/contexts/UIContext'

interface Message {
    id: string
    sender: { id: string; name: string; avatar?: string }
    content: string
    timestamp: string
}

interface Chat {
    id: string
    user: { id: string; name: string; avatar?: string }
    lastMessage?: string
    unread: number
}

export default function StudentMessagesPage() {
    const { user, isAuthenticated, logout } = useAuth()
    const { navType, isSideExpanded } = useUI()
    const { toast } = useToast()
    const router = useRouter()

    const [chats, setChats] = useState<Chat[]>([])
    const [messages, setMessages] = useState<Message[]>([])
    const [selectedChat, setSelectedChat] = useState<string | null>(null)
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState(true)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showInfoPanel, setShowInfoPanel] = useState(true)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (messages.length > 0) {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    const fetchRooms = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('/api/messages/rooms', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                const transformed = data.rooms.map((room: any) => ({
                    id: room.id,
                    user: room.users[0] || { id: 'unknown', name: 'Unknown User' },
                    lastMessage: room.lastMessage,
                    unread: 0
                }))
                setChats(transformed)
                const initId = localStorage.getItem('initialChatUserId')
                if (initId) {
                    const target = transformed.find((r: any) => r.user.id === initId)
                    if (target) setSelectedChat(target.id)
                    localStorage.removeItem('initialChatUserId')
                }
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isAuthenticated) fetchRooms()
    }, [isAuthenticated])

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedChat) return
            try {
                const token = localStorage.getItem('token')
                const response = await fetch(`/api/messages/rooms/${selectedChat}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (response.ok) {
                    const data = await response.json()
                    setMessages(data.messages)
                }
            } catch (e) {
                console.error(e)
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
                body: JSON.stringify({ roomId: selectedChat, content: newMessage })
            })
            if (response.ok) {
                const data = await response.json()
                setMessages(prev => [...prev, data.message])
                setNewMessage('')
                setChats(prev =>
                    prev.map(c => c.id === selectedChat ? { ...c, lastMessage: newMessage } : c)
                )
            }
        } catch (e) {
            toast({ title: 'Error', description: 'Failed to send message', variant: 'destructive' })
        }
    }

    if (!isAuthenticated || !user) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#E8EDF3]">
                <div className="text-[#1E1E1E] text-xl font-medium">Please log in to access your messages</div>
            </div>
        )
    }

    const selectedChatData = chats.find(c => c.id === selectedChat)

    const groupedMessages: Record<string, Message[]> = messages.reduce(
        (acc: Record<string, Message[]>, msg: Message) => {
            const date = new Date(msg.timestamp).toDateString()
            if (!acc[date]) acc[date] = []
            acc[date].push(msg)
            return acc
        },
        {}
    )

    const sideOffset = navType === 'side'
        ? (isSideExpanded ? 'md:pl-[280px] pl-0 pb-[90px] md:pb-0' : 'md:pl-[88px] pl-0 pb-[90px] md:pb-0')
        : 'pb-[90px]'

    return (
        <div className="h-screen bg-[#E8EDF3] overflow-hidden">
            <Sidebar
                expanded={expanded}
                onToggle={() => setExpanded(!expanded)}
                currentPage="messages"
                onNavClick={(page) => {
                    if (page !== 'messages') router.push(`/student?page=${page}`)
                }}
            />

            <div className={`transition-all duration-300 ease-in-out flex flex-col h-screen overflow-hidden w-full ${sideOffset}`}>

                {/* Header */}
                <header className="h-16 px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40 bg-[#E8EDF3]/80 backdrop-blur-md shrink-0">
                    <div className="flex items-center gap-2">
                        <MessageCircle size={20} className="text-[#8A919B]" />
                        <h1 className="text-lg font-extrabold text-[#1E1E1E] tracking-tight">Messages</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            placeholder="Search messages..."
                            className="w-48 pl-3 pr-3 py-1.5 bg-[#F4F6F8] border border-[#DDE3EA] rounded-xl text-sm text-[#1E1E1E] placeholder-[#B0B7BF] focus:border-[#1E1E1E] outline-none"
                        />
                        <button className="p-2 bg-[#E5F0A0] rounded-xl hover:bg-[#D4E4C8] transition-colors" title="New Chat">
                            <Plus size={18} className="text-[#1E1E1E]" />
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-[#8A919B] hover:text-[#1E1E1E] hover:bg-white rounded-xl transition-all relative">
                            <Bell size={18} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D4E4C8] border-2 border-[#E8EDF3] rounded-full" />
                        </button>
                        <div className="flex items-center gap-3 pl-3 border-l border-[#DDE3EA] relative">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-[#1E1E1E]">{user.name}</p>
                                <p className="text-[10px] text-[#8A919B] font-medium uppercase tracking-wider">{user.role}</p>
                            </div>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-1.5 hover:bg-white p-1.5 rounded-xl transition-colors"
                            >
                                <div className="w-9 h-9 rounded-2xl bg-[#D4E4C8] flex items-center justify-center text-[#1E1E1E]">
                                    <User size={16} />
                                </div>
                                <ChevronDown size={14} className="text-[#8A919B]" />
                            </button>
                            {showUserMenu && (
                                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#DDE3EA] rounded-2xl shadow-lg py-2 z-50">
                                    <button
                                        onClick={() => { router.push('/student?page=profile'); setShowUserMenu(false) }}
                                        className="w-full px-4 py-2.5 text-left hover:bg-[#F4F6F8] flex items-center gap-3 text-[#1E1E1E] text-sm"
                                    >
                                        <UserCircle size={16} className="text-[#8A919B]" />
                                        <span className="font-medium">My Profile</span>
                                    </button>
                                    <button
                                        onClick={() => { router.push('/student?page=settings'); setShowUserMenu(false) }}
                                        className="w-full px-4 py-2.5 text-left hover:bg-[#F4F6F8] flex items-center gap-3 text-[#1E1E1E] text-sm"
                                    >
                                        <SettingsIcon size={16} className="text-[#8A919B]" />
                                        <span className="font-medium">Settings</span>
                                    </button>
                                    <div className="my-2 border-t border-[#DDE3EA]" />
                                    <button
                                        onClick={() => { logout(); router.push('/auth/login') }}
                                        className="w-full px-4 py-2.5 text-left hover:bg-red-50 flex items-center gap-3 text-red-500 text-sm"
                                    >
                                        <LogOut size={16} />
                                        <span className="font-medium">Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 lg:p-6 min-h-0 overflow-hidden">
                    <div className="h-full flex gap-4 min-h-0 overflow-hidden">

                        {/* Chats List */}
                        <div className={`w-full md:w-64 shrink-0 bg-white border border-[#DDE3EA] rounded-2xl flex flex-col overflow-hidden ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
                            <div className="p-3 border-b border-[#DDE3EA] flex items-center gap-2">
                                <Search className="h-4 w-4 text-[#8A919B] shrink-0" />
                                <input
                                    placeholder="Search chats..."
                                    className="flex-1 px-2 py-1.5 bg-[#F4F6F8] border border-[#DDE3EA] rounded-xl text-sm text-[#1E1E1E] placeholder-[#B0B7BF] focus:border-[#1E1E1E] outline-none transition-colors"
                                />
                                <button className="p-1 bg-[#E5F0A0] rounded-full hover:bg-[#D4E4C8] transition-colors shrink-0" title="New Chat">
                                    <Plus size={14} className="text-[#1E1E1E]" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                {!loading && chats.length === 0 && (
                                    <div className="text-center py-12 px-4">
                                        <div className="w-12 h-12 bg-[#F4F6F8] rounded-2xl flex items-center justify-center mx-auto mb-3">
                                            <Mail className="h-5 w-5 text-[#B0B7BF]" />
                                        </div>
                                        <p className="text-sm font-semibold text-[#1E1E1E]">No chats yet</p>
                                        <p className="text-xs text-[#8A919B] mt-1">Start a conversation by clicking the + button.</p>
                                    </div>
                                )}
                                {loading && (
                                    <div className="text-center py-12">
                                        <div className="w-5 h-5 border-2 border-[#DDE3EA] border-t-[#1E1E1E] rounded-full animate-spin mx-auto" />
                                    </div>
                                )}
                                {chats.map((chat) => (
                                    <button
                                        key={chat.id}
                                        onClick={() => setSelectedChat(chat.id)}
                                        className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all text-left ${
                                            selectedChat === chat.id
                                                ? 'bg-[#E5F0A0] text-[#1E1E1E]'
                                                : 'hover:bg-[#F4F6F8] text-[#1E1E1E]'
                                        }`}
                                    >
                                        {chat.unread > 0 && (
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#6BBF8A] text-xs font-bold text-white">
                                                {chat.unread}
                                            </span>
                                        )}
                                        <Avatar className="h-10 w-10 shrink-0">
                                            <AvatarImage src={chat.user.avatar} />
                                            <AvatarFallback className="bg-[#D4E4C8] text-[#1E1E1E] font-bold text-sm">
                                                {chat.user.name[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate">{chat.user.name}</p>
                                            <p className="text-xs truncate text-[#8A919B] mt-0.5">
                                                {chat.lastMessage || 'Start a conversation'}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className={`flex-1 bg-white border border-[#DDE3EA] rounded-2xl flex flex-col overflow-hidden ${selectedChat ? 'flex' : 'hidden md:flex'}`}>
                            {selectedChat && selectedChatData ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="px-5 py-4 border-b border-[#DDE3EA] flex items-center justify-between shrink-0">
                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => setSelectedChat(null)}
                                                className="md:hidden p-2 rounded-xl text-[#8A919B] hover:bg-[#F4F6F8] hover:text-[#1E1E1E] transition-colors mr-1 shrink-0"
                                            >
                                                <ChevronLeft size={20} />
                                            </button>
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={selectedChatData.user.avatar} />
                                                <AvatarFallback className="bg-[#D4E4C8] text-[#1E1E1E] font-bold">
                                                    {selectedChatData.user.name[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h2 className="font-bold text-[#1E1E1E] text-base">{selectedChatData.user.name}</h2>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 bg-[#6BBF8A] rounded-full" />
                                                    <p className="text-xs text-[#8A919B] font-medium">Mentor</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setShowInfoPanel(!showInfoPanel)}
                                                className={`p-2 rounded-xl transition-colors ${showInfoPanel ? 'bg-[#E5F0A0] text-[#1E1E1E]' : 'text-[#8A919B] hover:bg-[#F4F6F8]'}`}
                                                title="Conversation Info"
                                            >
                                                <Info size={20} />
                                            </button>
                                            <button className="p-2 bg-[#E5F0A0] rounded-xl hover:bg-[#D4E4C8] transition-colors" title="Video Call">
                                                <Video size={20} className="text-[#1E1E1E]" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex overflow-hidden">
                                        {/* Messages Column */}
                                        <div className="flex-1 flex flex-col overflow-hidden border-r border-[#DDE3EA]">
                                            <div className="flex-1 overflow-y-auto p-5 bg-[#F4F6F8] space-y-4">
                                                {messages.length === 0 && (
                                                    <div className="flex flex-col items-center justify-center h-full text-center py-20">
                                                        <div className="w-14 h-14 bg-white border border-[#DDE3EA] rounded-2xl flex items-center justify-center mb-3">
                                                            <Mail size={24} className="text-[#B0B7BF]" />
                                                        </div>
                                                        <p className="font-semibold text-[#1E1E1E] text-sm">No messages yet</p>
                                                        <p className="text-xs text-[#8A919B] mt-1">Start the conversation!</p>
                                                    </div>
                                                )}
                                                {Object.entries(groupedMessages).map(([date, group]) => (
                                                    <div key={date}>
                                                        <div className="flex items-center gap-4 my-6">
                                                            <div className="h-px flex-1 bg-[#DDE3EA]" />
                                                            <span className="text-[10px] text-[#8A919B] font-bold uppercase tracking-[0.1em]">{date}</span>
                                                            <div className="h-px flex-1 bg-[#DDE3EA]" />
                                                        </div>
                                                        <div className="space-y-4">
                                                            {group.map((message) => {
                                                                const isOwn = message.sender.id === user.id
                                                                return (
                                                                    <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                                                        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[72%]`}>
                                                                            <div className={`group relative px-4 py-3 rounded-2xl text-sm shadow-sm transition-all ${
                                                                                isOwn
                                                                                    ? 'bg-[#1E1E1E] text-white rounded-tr-sm hover:bg-[#333]'
                                                                                    : 'bg-white border border-[#DDE3EA] text-[#1E1E1E] rounded-tl-sm hover:border-[#B0B7BF]'
                                                                            }`}>
                                                                                {message.content}
                                                                                <div className={`absolute ${isOwn ? '-left-12' : '-right-12'} top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white border border-[#DDE3EA] p-1 rounded-lg shadow-sm`}>
                                                                                    <button className="text-xs grayscale hover:grayscale-0 transition-all">👍</button>
                                                                                    <button className="text-xs grayscale hover:grayscale-0 transition-all">❤️</button>
                                                                                </div>
                                                                            </div>
                                                                            <span className="text-[9px] text-[#B0B7BF] mt-1 px-1 font-bold tracking-tight">
                                                                                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                                <div ref={scrollRef} />
                                            </div>

                                            {/* Input Bar */}
                                            <div className="px-5 py-4 border-t border-[#DDE3EA] shrink-0">
                                                <form
                                                    onSubmit={(e) => { e.preventDefault(); handleSendMessage() }}
                                                    className="flex items-center gap-3"
                                                >
                                                    <div className="relative flex-1">
                                                        <Paperclip size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A919B]" />
                                                        <input
                                                            placeholder="Type a message..."
                                                            value={newMessage}
                                                            onChange={(e) => setNewMessage(e.target.value)}
                                                            className="w-full pl-10 pr-12 bg-[#F4F6F8] border border-[#DDE3EA] rounded-2xl h-11 text-sm text-[#1E1E1E] placeholder-[#B0B7BF] focus:border-[#1E1E1E] outline-none transition-colors"
                                                        />
                                                        <Smile size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A919B] cursor-pointer" />
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        disabled={!newMessage.trim()}
                                                        className="bg-[#1E1E1E] hover:bg-[#333] text-white rounded-2xl h-11 w-11 flex items-center justify-center shrink-0 transition-all disabled:opacity-30"
                                                    >
                                                        <Send size={20} />
                                                    </button>
                                                </form>
                                            </div>
                                        </div>

                                        {/* Info Panel */}
                                        {showInfoPanel && (
                                            <div className="bg-white overflow-hidden hidden md:flex flex-col shrink-0 w-[280px]">
                                                <div className="p-6 flex flex-col items-center text-center border-b border-[#DDE3EA]">
                                                    <Avatar className="h-20 w-20 mb-4 border-2 border-[#E5F0A0] p-1">
                                                        <AvatarImage src={selectedChatData.user.avatar} className="rounded-full" />
                                                        <AvatarFallback className="bg-[#D4E4C8] text-[#1E1E1E] font-bold text-xl">
                                                            {selectedChatData.user.name[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <h3 className="font-extrabold text-[#1E1E1E] text-lg">{selectedChatData.user.name}</h3>
                                                    <p className="text-xs font-bold text-[#6BBF8A] uppercase tracking-wider mb-2">Verified Mentor</p>
                                                    <div className="flex gap-2">
                                                        <button className="p-2 bg-[#F4F6F8] rounded-xl hover:bg-[#E5F0A0] transition-colors border border-[#DDE3EA]">
                                                            <User size={16} />
                                                        </button>
                                                        <button className="p-2 bg-[#F4F6F8] rounded-xl hover:bg-[#E5F0A0] transition-colors border border-[#DDE3EA]">
                                                            <Bell size={16} />
                                                        </button>
                                                        <button className="p-2 bg-[#F4F6F8] rounded-xl hover:bg-[#E5F0A0] transition-colors border border-[#DDE3EA]">
                                                            <Shield size={16} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                                    <div>
                                                        <h4 className="text-[10px] font-bold text-[#8A919B] uppercase tracking-[0.2em] mb-3">About</h4>
                                                        <p className="text-xs text-[#1E1E1E] leading-relaxed">
                                                            Passionate mentor helping students excel in UI/UX Design and Web Development. Available for career guidance.
                                                        </p>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-3 text-[#1E1E1E]">
                                                            <Clock size={14} className="text-[#8A919B]" />
                                                            <span className="text-xs font-medium">Available 09:00 - 18:00</span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-[#1E1E1E]">
                                                            <MapPin size={14} className="text-[#8A919B]" />
                                                            <span className="text-xs font-medium">New York, USA</span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-[#1E1E1E]">
                                                            <ExternalLink size={14} className="text-[#8A919B]" />
                                                            <a href="#" className="text-xs font-bold text-[#1E1E1E] underline decoration-[#E5F0A0] decoration-2">portfolio.design</a>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[10px] font-bold text-[#8A919B] uppercase tracking-[0.2em] mb-3">Shared Files</h4>
                                                        <div className="space-y-2">
                                                            {[1, 2].map((i) => (
                                                                <div key={i} className="p-2 bg-[#F4F6F8] rounded-xl flex items-center gap-3 border border-[#DDE3EA]">
                                                                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[10px] font-bold">PDF</div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-[10px] font-bold truncate">Guideline_V0{i}.pdf</p>
                                                                        <p className="text-[8px] text-[#8A919B]">2.4 MB</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                                    <div className="w-16 h-16 bg-[#F4F6F8] border border-[#DDE3EA] rounded-3xl flex items-center justify-center mb-4">
                                        <Mail size={28} className="text-[#B0B7BF]" />
                                    </div>
                                    <h3 className="text-lg font-extrabold text-[#1E1E1E] mb-1">Mentor Chat</h3>
                                    <p className="text-sm text-[#8A919B] max-w-xs">Select a conversation from the list to start chatting with your mentor.</p>
                                </div>
                            )}
                        </div>

                    </div>
                </main>
            </div>
        </div>
    )
}
