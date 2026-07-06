'use client';
import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Plus, Flame, TrendingUp, Users, Hash, MoreHorizontal } from 'lucide-react';

export function Community() {
    const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

    const posts = [
        {
            id: 1,
            author: 'Sarah Chen',
            role: 'CS Student · 5th Sem',
            avatar: 'SC',
            content: 'Just finished the "Advanced Algorithms" course! The section on Dynamic Programming was particularly helpful. Highly recommend it to anyone preparing for interviews.',
            likes: 24,
            comments: 5,
            time: '2 hours ago',
            tags: ['Algorithms', 'Study Tips']
        },
        {
            id: 2,
            author: 'David Kumar',
            role: 'Mentor · System Design',
            avatar: 'DK',
            content: 'Hosting a live Q&A session on "System Design Basics" this weekend. Join if you want to learn about scalability and load balancing! Link in bio.',
            likes: 56,
            comments: 12,
            time: '5 hours ago',
            tags: ['System Design', 'Event']
        },
        {
            id: 3,
            author: 'Priya Patel',
            role: 'Student · CSE',
            avatar: 'PP',
            content: 'Anyone interested in forming a study group for the upcoming Data Structures mid-term? We can meet virtually on weekends.',
            likes: 15,
            comments: 8,
            time: '1 day ago',
            tags: ['Study Group', 'Collaboration']
        }
    ];

    const trending = ['#DataStructures', '#VTUExams', '#AILearning', '#StudyGroup'];

    const toggleLike = (id: number) => {
        setLikedPosts(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[#8A919B] text-xs font-semibold uppercase tracking-[0.2em] mb-1">Connect</p>
                    <h3 className="text-2xl font-extrabold text-[#1E1E1E] tracking-tight">Community Forum</h3>
                    <p className="text-[#8A919B] text-sm mt-1">Learn together, grow together</p>
                </div>
                <button className="flex items-center gap-2 bg-[#1E1E1E] text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#333] transition-colors">
                    <Plus size={16} /> New Post
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Feed */}
                <div className="lg:col-span-2 space-y-5">
                    {posts.map((post, idx) => {
                        const isLiked = likedPosts.has(post.id);
                        return (
                            <div 
                                key={post.id} 
                                className="bg-white border border-[#DDE3EA] rounded-[32px] p-8 hover:border-[#1E1E1E] transition-all duration-500 group relative overflow-hidden shadow-sm animate-in slide-in-from-bottom-2 duration-300"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="text-[#8A919B] hover:text-[#1E1E1E] transition-colors"><MoreHorizontal size={20} /></button>
                                </div>

                                {/* Author */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm text-[#1E1E1E] bg-[#E5F0A0] transition-transform group-hover:scale-110 duration-500">
                                        {post.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[#1E1E1E] font-black text-base tracking-tight">{post.author}</p>
                                        <p className="text-[#8A919B] text-xs font-bold uppercase tracking-wider">{post.role}</p>
                                    </div>
                                    <span className="text-[#B0B7BF] text-[10px] font-bold bg-[#F4F6F8] px-3 py-1 rounded-full">{post.time}</span>
                                </div>

                                {/* Content */}
                                <p className="text-[#1E1E1E] text-sm leading-relaxed mb-6 font-medium">{post.content}</p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {post.tags.map(tag => (
                                        <span key={tag} className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-2 bg-[#F4F6F8] text-[#1E1E1E] border border-transparent hover:border-[#DDE3EA] transition-all cursor-pointer">
                                            <Hash size={10} className="text-[#D4E4C8]" />{tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-6 pt-6 border-t border-[#DDE3EA]">
                                    <button
                                        onClick={() => toggleLike(post.id)}
                                        className="flex items-center gap-2.5 text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
                                        style={{ color: isLiked ? '#E85D5D' : '#1E1E1E' }}
                                    >
                                        <Heart size={18} fill={isLiked ? '#E85D5D' : 'none'} className="transition-transform group-active:scale-125" />
                                        {post.likes + (isLiked ? 1 : 0)}
                                    </button>
                                    <button className="flex items-center gap-2.5 text-xs font-black uppercase tracking-widest text-[#1E1E1E] hover:text-[#8A919B] transition-colors">
                                        <MessageCircle size={18} /> {post.comments}
                                    </button>
                                    <button className="flex items-center gap-2.5 text-xs font-black uppercase tracking-widest text-[#1E1E1E] hover:text-[#8A919B] transition-colors ml-auto">
                                        <Share2 size={18} /> Share
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Stats */}
                    <div className="bg-white border border-[#DDE3EA] rounded-2xl p-5">
                        <h5 className="text-[#1E1E1E] font-bold mb-4 flex items-center gap-2">
                            <Flame size={16} className="text-[#1E1E1E]" /> Community Stats
                        </h5>
                        {[
                            { label: 'Members', value: '2,847' },
                            { label: 'Posts this week', value: '124' },
                            { label: 'Active mentors', value: '38' },
                        ].map((stat, i) => (
                            <div key={i} className="flex justify-between items-center py-2.5 border-b border-[#DDE3EA] last:border-0">
                                <span className="text-[#8A919B] text-sm">{stat.label}</span>
                                <span className="font-extrabold text-sm text-[#1E1E1E]">{stat.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Trending */}
                    <div className="bg-white border border-[#DDE3EA] rounded-2xl p-5">
                        <h5 className="text-[#1E1E1E] font-bold mb-4 flex items-center gap-2">
                            <TrendingUp size={16} /> Trending
                        </h5>
                        {trending.map((tag, i) => (
                            <button key={i} className="w-full flex items-center gap-2 py-2.5 text-sm text-[#8A919B] hover:text-[#1E1E1E] transition-colors border-b border-[#DDE3EA] last:border-0 text-left">
                                <Hash size={12} className="shrink-0" />
                                {tag.replace('#', '')}
                            </button>
                        ))}
                    </div>

                    {/* Active Users */}
                    <div className="bg-white border border-[#DDE3EA] rounded-2xl p-5">
                        <h5 className="text-[#1E1E1E] font-bold mb-4 flex items-center gap-2">
                            <Users size={16} /> Active Now
                        </h5>
                        <div className="flex -space-x-2">
                            {['SC', 'DK', 'PP', 'AR', 'MK'].map((init, i) => (
                                <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#1E1E1E] border-2 border-white"
                                    style={{ backgroundColor: ['#E5F0A0', '#D4E4C8', '#E8EDF3', '#E5F0A0', '#D4E4C8'][i] }}>
                                    {init}
                                </div>
                            ))}
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-[#8A919B] bg-[#F4F6F8] border-2 border-white">
                                +24
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
