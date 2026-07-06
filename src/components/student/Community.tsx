'use client';
import React, { useState, useEffect } from 'react';
import { 
  Heart, MessageCircle, Share2, Plus, Flame, TrendingUp, Users, Hash, MoreHorizontal,
  Trophy, Medal, Crown, MapPin, GraduationCap, Calendar, Briefcase, HelpCircle, 
  Search, Award, Sparkles, UserPlus, CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { showXPToast, showLevelUpToast } from '@/lib/gamification-client';

export function Community() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'feed' | 'leaderboards' | 'groups' | 'events'>('feed');

    // Feed States
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [posts, setPosts] = useState<any[]>([]);
    const [postsLoading, setPostsLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostTags, setNewPostTags] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    // Leaderboard States
    const [leaderboardTab, setLeaderboardTab] = useState<'students' | 'colleges'>('students');
    const [studentLeaderboard, setStudentLeaderboard] = useState<any[]>([]);
    const [studentLoading, setStudentLoading] = useState(true);
    const [leaderboardType, setLeaderboardType] = useState('global');
    const [selectedSemester, setSelectedSemester] = useState<string>('all');
    const [collegeRankings, setCollegeRankings] = useState<any[]>([]);
    const [collegeLoading, setCollegeLoading] = useState(true);

    // Study Groups States
    const [studyGroups, setStudyGroups] = useState<any[]>([
        { id: 1, subject: 'Data Structures & Algorithms', semester: 3, members: 8, description: 'Solving VTU question papers modules 1-3.' },
        { id: 2, subject: 'Operating Systems', semester: 4, members: 5, description: 'Discussing process synchronization & semaphore problems.' },
        { id: 3, subject: 'Web Technologies', semester: 5, members: 12, description: 'React and TailwindCSS mini projects collaboration.' }
    ]);
    const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDesc, setNewGroupDesc] = useState('');
    const [newGroupSem, setNewGroupSem] = useState('3');
    const [buddyMatch, setBuddyMatch] = useState<any | null>(null);
    const [matching, setMatching] = useState(false);

    // Events States
    const [events, setEvents] = useState<any[]>([
      { id: 1, title: 'VTU Code Hack 2026', type: 'HACKATHON', college: 'Acharya Institute of Technology', rsvps: 45, date: 'July 15, 2026' },
      { id: 2, title: 'Annual Tech Fest "Insignia"', type: 'FEST', college: 'BMS College of Engineering', rsvps: 180, date: 'July 28, 2026' },
      { id: 3, title: 'Microsoft Placement Drive Experience Q&A', type: 'PLACEMENT', college: 'RV College of Engineering', rsvps: 92, date: 'July 10, 2026' }
    ]);
    const [myRsvps, setMyRsvps] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (activeTab === 'feed') {
            fetchPosts();
        } else if (activeTab === 'leaderboards') {
            if (leaderboardTab === 'students') {
                fetchStudentLeaderboard();
            } else {
                fetchCollegeRankings();
            }
        }
    }, [activeTab, leaderboardTab, leaderboardType, selectedSemester, selectedTag, user]);

    // Feed functions
    const fetchPosts = async () => {
        setPostsLoading(true);
        try {
            const token = localStorage.getItem('token');
            let url = '/api/student/community';
            if (selectedTag) {
                url += `?tag=${encodeURIComponent(selectedTag)}`;
            }
            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPosts(data.posts || []);
            }
        } catch (error) {
            console.error('Failed to fetch community posts:', error);
        } finally {
            setPostsLoading(false);
        }
    };

    const handleCreatePost = async () => {
        if (!newPostContent.trim()) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/student/community/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: newPostContent,
                    tags: newPostTags.split(',').map(t => t.trim()).filter(Boolean),
                    category: 'General'
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.xpGained) {
                    showXPToast(data.xpGained, 'FORUM_POST');
                }
                if (data.leveledUp) {
                    showLevelUpToast(data.level);
                }

                const authorInitials = (user?.name || 'You').split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);
                const newPostObj = {
                    id: Date.now().toString(),
                    author: user?.name || 'You',
                    role: user?.role || 'STUDENT',
                    avatar: authorInitials,
                    content: newPostContent,
                    likes: 0,
                    comments: 0,
                    time: 'Just now',
                    tags: newPostTags.split(',').map(t => t.trim()).filter(Boolean)
                };
                setPosts(prev => [newPostObj, ...prev]);
                setNewPostContent('');
                setNewPostTags('');
                setIsCreateOpen(false);
            }
        } catch (error) {
            console.error('Failed to create post:', error);
        }
    };

    const toggleLike = (id: string) => {
        setLikedPosts(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    // Leaderboard functions
    const fetchStudentLeaderboard = async () => {
        setStudentLoading(true);
        try {
            let url = `/api/gamification/leaderboard?type=${leaderboardType}`;
            if (leaderboardType === 'branch' && user?.branch) {
                url += `&branch=${encodeURIComponent(user.branch)}`;
            }
            if (selectedSemester !== 'all') {
                url += `&semester=${selectedSemester}`;
            }
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setStudentLeaderboard(data.leaderboard || []);
            }
        } catch (error) {
            console.error('Failed to fetch student leaderboard:', error);
        } finally {
            setStudentLoading(false);
        }
    };

    const fetchCollegeRankings = async () => {
        setCollegeLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/community/college-rankings', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCollegeRankings(data.rankings || []);
            }
        } catch (error) {
            console.error('Failed to fetch college rankings:', error);
        } finally {
            setCollegeLoading(false);
        }
    };

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
            case 2: return <Medal className="w-6 h-6 text-slate-300" />;
            case 3: return <Medal className="w-6 h-6 text-amber-600" />;
            default: return <span className="text-sm font-bold text-slate-500 w-6 text-center">{rank}</span>;
        }
    };

    // Study Groups & Matching
    const handleCreateGroup = () => {
        if (!newGroupName.trim() || !newGroupDesc.trim()) return;
        const newGroup = {
            id: Date.now(),
            subject: newGroupName,
            semester: parseInt(newGroupSem),
            members: 1,
            description: newGroupDesc
        };
        setStudyGroups(prev => [newGroup, ...prev]);
        setNewGroupName('');
        setNewGroupDesc('');
        setIsCreateGroupOpen(false);
        showXPToast(15, 'STUDY_GROUP_CREATED');
    };

    const handleMatchBuddy = () => {
        setMatching(true);
        setTimeout(() => {
            setBuddyMatch({
                name: 'Karan Mehra',
                branch: user?.branch || 'Computer Science & Engineering',
                semester: user?.semester || 3,
                commonWeakness: 'Dynamic Programming',
                college: user?.college || 'Acharya Institute of Technology',
                avatar: 'KM'
            });
            setMatching(false);
            showXPToast(10, 'BUDDY_MATCHED');
        }, 1500);
    };

    // Events RSVP
    const handleRsvp = (id: number) => {
        setMyRsvps(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
                setEvents(items => items.map(ev => ev.id === id ? { ...ev, rsvps: ev.rsvps - 1 } : ev));
            } else {
                next.add(id);
                setEvents(items => items.map(ev => ev.id === id ? { ...ev, rsvps: ev.rsvps + 1 } : ev));
                showXPToast(10, 'EVENT_RSVP');
            }
            return next;
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#DDE3EA] pb-6">
                <div>
                    <p className="text-[#8A919B] text-xs font-semibold uppercase tracking-[0.2em] mb-1">Striving for Knowledge</p>
                    <h3 className="text-3xl font-extrabold text-[#1E1E1E] tracking-tight">LearnWave Community</h3>
                    <p className="text-[#8A919B] text-sm mt-1">Connect, collaborate, and rank up together with peers & colleges</p>
                </div>
                
                <div className="flex gap-2">
                    {activeTab === 'feed' && (
                        <button 
                            onClick={() => setIsCreateOpen(true)}
                            className="flex items-center gap-2 bg-[#1E1E1E] text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#333] transition-colors shadow-md"
                        >
                            <Plus size={16} /> New Post
                        </button>
                    )}
                    {activeTab === 'groups' && (
                        <button 
                            onClick={() => setIsCreateGroupOpen(true)}
                            className="flex items-center gap-2 bg-[#1E1E1E] text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#333] transition-colors shadow-md"
                        >
                            <Plus size={16} /> Create Group
                        </button>
                    )}
                </div>
            </div>

            {/* Main Tabs Navigation */}
            <div className="flex border-b border-[#DDE3EA] gap-6 overflow-x-auto pb-1">
                {[
                    { id: 'feed', label: '💬 Active Feed' },
                    { id: 'leaderboards', label: '🏆 Leaderboards' },
                    { id: 'groups', label: '👥 Study Groups' },
                    { id: 'events', label: '📅 Events & Placements' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`pb-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                            activeTab === tab.id 
                                ? 'border-[#1E1E1E] text-[#1E1E1E] scale-102' 
                                : 'border-transparent text-[#8A919B] hover:text-[#1E1E1E]'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* TAB CONTENTS */}
            
            {/* 1. FEED TAB */}
            {activeTab === 'feed' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Feed Column */}
                    <div className="lg:col-span-2 space-y-5">
                        {selectedTag && (
                            <div className="bg-[#1E1E1E] text-white text-xs font-black px-4 py-3 rounded-2xl flex items-center justify-between shadow-sm animate-in slide-in-from-top-1">
                                <span className="flex items-center gap-1.5 uppercase tracking-wider">
                                    <Hash size={14} className="text-cyan-400" /> Filtering by topic: {selectedTag}
                                </span>
                                <button 
                                    onClick={() => setSelectedTag(null)} 
                                    className="bg-white/10 hover:bg-white/20 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        {postsLoading ? (
                            <div className="flex justify-center p-12">
                                <div className="w-8 h-8 border-4 border-[#1E1E1E] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-16 bg-white border border-[#DDE3EA] rounded-[32px]">
                                <p className="text-[#8A919B] font-medium">
                                    {selectedTag ? `No posts found for #${selectedTag}` : 'No posts found. Be the first to start a conversation!'}
                                </p>
                            </div>
                        ) : (
                            posts.map((post, idx) => {
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
                                                {post.avatar || (post.author ? post.author.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) : '??')}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[#1E1E1E] font-black text-base tracking-tight">{post.author}</p>
                                                <p className="text-[#8A919B] text-xs font-bold uppercase tracking-wider">{post.role || 'STUDENT'}</p>
                                            </div>
                                            <span className="text-[#B0B7BF] text-[10px] font-bold bg-[#F4F6F8] px-3 py-1 rounded-full">{post.time}</span>
                                        </div>

                                        {/* Content */}
                                        <p className="text-[#1E1E1E] text-sm leading-relaxed mb-6 font-medium">{post.content}</p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {post.tags && post.tags.map(tag => {
                                                const isActive = selectedTag === tag;
                                                return (
                                                    <span 
                                                        key={tag} 
                                                        onClick={() => setSelectedTag(isActive ? null : tag)}
                                                        className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-2 border transition-all cursor-pointer ${
                                                            isActive 
                                                                ? 'bg-[#1E1E1E] text-white border-transparent' 
                                                                : 'bg-[#F4F6F8] text-[#1E1E1E] border-transparent hover:border-[#DDE3EA]'
                                                        }`}
                                                    >
                                                        <Hash size={10} className={isActive ? 'text-cyan-400' : 'text-[#D4E4C8]'} />{tag}
                                                    </span>
                                                );
                                            })}
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
                                                <MessageCircle size={18} /> {post.comments || 0}
                                            </button>
                                            <button className="flex items-center gap-2.5 text-xs font-black uppercase tracking-widest text-[#1E1E1E] hover:text-[#8A919B] transition-colors ml-auto">
                                                <Share2 size={18} /> Share
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-4">
                        {/* Stats card */}
                        <div className="bg-white border border-[#DDE3EA] rounded-[2rem] p-6 shadow-sm">
                            <h5 className="text-[#1E1E1E] font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Flame size={16} className="text-orange-500" /> Community Stats
                            </h5>
                            {[
                                { label: 'Active Members', value: '3,128' },
                                { label: 'Files Uploaded', value: '412' },
                                { label: 'Verified Mentors', value: '42' },
                            ].map((stat, i) => (
                                <div key={i} className="flex justify-between items-center py-3 border-b border-[#DDE3EA] last:border-0">
                                    <span className="text-[#8A919B] text-sm font-semibold">{stat.label}</span>
                                    <span className="font-extrabold text-sm text-[#1E1E1E]">{stat.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Trending Tag Card */}
                        <div className="bg-white border border-[#DDE3EA] rounded-[2rem] p-6 shadow-sm">
                            <h5 className="text-[#1E1E1E] font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                                <TrendingUp size={16} className="text-cyan-500" /> Trending Topics
                            </h5>
                            {['#DataStructures', '#VTUExams', '#AILearning', '#PlacementPrep'].map((tag, i) => {
                                const cleanTag = tag.replace('#', '');
                                const isActive = selectedTag === cleanTag;
                                return (
                                    <button 
                                        key={i} 
                                        onClick={() => setSelectedTag(isActive ? null : cleanTag)}
                                        className={`w-full flex items-center gap-2 py-2.5 px-3 rounded-xl text-sm transition-all border last:border-0 text-left mb-1 ${
                                            isActive 
                                                ? 'bg-[#1E1E1E] text-white border-transparent' 
                                                : 'text-[#8A919B] hover:text-[#1E1E1E] border-transparent bg-transparent hover:bg-[#F4F6F8]'
                                        }`}
                                    >
                                        <Hash size={12} className={isActive ? 'text-cyan-400' : 'text-slate-400'} />
                                        {cleanTag}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* 2. LEADERBOARDS TAB (COLLEGE & STUDENT RANKINGS) */}
            {activeTab === 'leaderboards' && (
                <div className="space-y-6">
                    {/* Sub tabs */}
                    <div className="flex gap-3 bg-[#F4F6F8] p-1.5 rounded-2xl w-fit">
                        <button
                            onClick={() => setLeaderboardTab('students')}
                            className={`px-5 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                                leaderboardTab === 'students' ? 'bg-white text-[#1E1E1E] shadow-sm' : 'text-[#8A919B] hover:text-[#1E1E1E]'
                            }`}
                        >
                            🎓 Student Rankings
                        </button>
                        <button
                            onClick={() => setLeaderboardTab('colleges')}
                            className={`px-5 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                                leaderboardTab === 'colleges' ? 'bg-white text-[#1E1E1E] shadow-sm' : 'text-[#8A919B] hover:text-[#1E1E1E]'
                            }`}
                        >
                            🏢 College Rankings
                        </button>
                    </div>

                    {/* Student Leaderboard View */}
                    {leaderboardTab === 'students' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                            <div className="lg:col-span-2 space-y-4">
                                {/* Top Controls */}
                                <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-[#DDE3EA] p-4 rounded-2xl">
                                    <div className="flex gap-2">
                                        {['global', 'monthly', 'branch'].map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setLeaderboardType(t)}
                                                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                                                    leaderboardType === t ? 'bg-[#1E1E1E] text-white shadow-md' : 'bg-[#F4F6F8] text-[#8A919B] hover:text-[#1E1E1E]'
                                                }`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-2 bg-[#F4F6F8] px-3 py-1.5 rounded-xl border border-[#DDE3EA]">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Semester:</span>
                                        <select
                                            value={selectedSemester}
                                            onChange={(e) => setSelectedSemester(e.target.value)}
                                            className="bg-transparent text-slate-800 text-xs font-extrabold focus:outline-none cursor-pointer"
                                        >
                                            <option value="all">All</option>
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                                <option key={sem} value={sem.toString()}>Sem {sem}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Rankings List Card */}
                                <div className="bg-white border border-[#DDE3EA] rounded-[2rem] overflow-hidden shadow-sm">
                                    <div className="p-6 border-b border-[#DDE3EA] flex items-center justify-between">
                                        <h4 className="text-base font-black text-[#1E1E1E] flex items-center gap-2">
                                            <Trophy size={18} className="text-yellow-500" />
                                            {leaderboardType.toUpperCase()} LEADERBOARD
                                        </h4>
                                        {leaderboardType === 'branch' && (
                                            <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full uppercase">
                                                {user?.branch || 'General'}
                                            </span>
                                        )}
                                    </div>

                                    {studentLoading ? (
                                        <div className="p-12 text-center text-sm text-[#8A919B] animate-pulse">Updating rankings...</div>
                                    ) : studentLeaderboard.length === 0 ? (
                                        <div className="p-12 text-center text-sm text-[#8A919B]">No records found for this scope.</div>
                                    ) : (
                                        <div className="divide-y divide-[#DDE3EA]">
                                            {studentLeaderboard.map((scholar) => (
                                                <div key={scholar.userId} className="flex items-center gap-4 p-5 hover:bg-[#F4F6F8]/50 transition-colors">
                                                    <div className="w-8 flex justify-center shrink-0">
                                                        {getRankIcon(scholar.rank)}
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-[#1E1E1E] bg-[#E8EDF3]">
                                                        {scholar.avatar ? (
                                                            <img src={scholar.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                                                        ) : (
                                                            scholar.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-extrabold text-[#1E1E1E] truncate">{scholar.name}</p>
                                                        <p className="text-[10px] text-[#8A919B] font-bold uppercase tracking-wider">{scholar.branch || 'General'} · Semester {scholar.semester || 'N/A'}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-black text-cyan-600">{scholar.xp} XP</p>
                                                        <span className="text-[9px] text-[#8A919B] font-extrabold uppercase">LEVEL {scholar.level || 1}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Rankings Sidebar */}
                            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 border border-[#DDE3EA] rounded-[2rem] p-8 text-white space-y-6 shadow-lg">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-yellow-400">
                                    <Crown size={24} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black">LearnWave Hall of Fame</h4>
                                    <p className="text-xs text-white/60 mt-1">Strive to earn maximum XP, contribute premium study resources, and unlock top levels to cement your rank!</p>
                                </div>
                                <div className="space-y-3 pt-4 border-t border-white/10 text-xs text-white/80">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                                        <span>Create community posts (+5 XP)</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                                        <span>Upload helpful resources (+15 XP)</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                                        <span>Participate in quiz challenges (+10 XP)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* College Leaderboard View */}
                    {leaderboardTab === 'colleges' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-in fade-in duration-300">
                            <div className="lg:col-span-2 bg-white border border-[#DDE3EA] rounded-[2rem] overflow-hidden shadow-sm">
                                <div className="p-6 border-b border-[#DDE3EA]">
                                    <h4 className="text-base font-black text-[#1E1E1E] flex items-center gap-2">
                                        🏢 VTU Affiliated Institutions Scoreboard
                                    </h4>
                                </div>

                                {collegeLoading ? (
                                    <div className="p-12 text-center text-sm text-[#8A919B] animate-pulse">Calculating scores...</div>
                                ) : collegeRankings.length === 0 ? (
                                    <div className="p-12 text-center text-sm text-[#8A919B]">No colleges have registered students yet.</div>
                                ) : (
                                    <div className="divide-y divide-[#DDE3EA]">
                                        {collegeRankings.map((col) => (
                                            <div key={col.college} className="flex items-center gap-4 p-5 hover:bg-[#F4F6F8]/50 transition-colors">
                                                <div className="w-8 flex justify-center shrink-0">
                                                    {getRankIcon(col.rank)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-extrabold text-[#1E1E1E] truncate">{col.college}</p>
                                                    <p className="text-[10px] text-[#8A919B] font-bold uppercase tracking-wider">{col.studentCount} active scholars on LearnWave</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-black text-emerald-600">{col.averageXP} Avg XP</p>
                                                    <span className="text-[9px] text-[#8A919B] font-extrabold uppercase">{col.totalXP} Total XP</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="bg-white border border-[#DDE3EA] rounded-[2rem] p-6 shadow-sm space-y-4">
                                <div className="p-3 bg-[#E5F0A0] text-[#1E1E1E] rounded-2xl w-fit">
                                    <Award size={20} />
                                </div>
                                <h5 className="font-extrabold text-[#1E1E1E]">How is College Rank Determined?</h5>
                                <p className="text-xs text-[#8A919B] leading-relaxed">
                                    Colleges are ranked based on the **Average XP** of all their registered student members. This ensures smaller campuses can compete fairly against larger colleges. Help your campus climb by inviting peers and sharing high-quality resources!
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 3. STUDY GROUPS & MATCH TAB */}
            {activeTab === 'groups' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-in fade-in duration-300">
                    <div className="lg:col-span-2 space-y-5">
                        <div className="border-b border-[#DDE3EA] pb-3">
                            <h4 className="text-lg font-black text-[#1E1E1E]">Active Study Rooms</h4>
                            <p className="text-xs text-[#8A919B] mt-0.5">Time-boxed study rooms focused on subjects & semester doubts</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {studyGroups.map((group) => (
                                <div key={group.id} className="bg-white border border-[#DDE3EA] rounded-[2rem] p-6 hover:border-[#1E1E1E] transition-all flex flex-col justify-between shadow-sm min-h-[180px]">
                                    <div>
                                        <span className="text-[10px] font-black uppercase text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full w-fit mb-3 block">
                                            Sem {group.semester} Subject
                                        </span>
                                        <h5 className="font-extrabold text-[#1E1E1E] text-base leading-tight mb-2">{group.subject}</h5>
                                        <p className="text-xs text-[#8A919B] leading-relaxed mb-4">{group.description}</p>
                                    </div>
                                    <div className="flex justify-between items-center border-t border-[#F4F6F8] pt-4">
                                        <span className="text-xs font-semibold text-[#8A919B]">{group.members} students active</span>
                                        <button 
                                            onClick={() => showXPToast(5, 'STUDY_GROUP_JOINED')}
                                            className="text-xs font-black text-[#1E1E1E] hover:underline"
                                        >
                                            Join Room →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Study Buddy Matcher */}
                    <div className="bg-white border border-[#DDE3EA] rounded-[2rem] p-6 shadow-sm space-y-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Sparkles size={60} />
                        </div>
                        <div>
                            <h5 className="font-extrabold text-[#1E1E1E] text-base">Study Buddy Matcher</h5>
                            <p className="text-xs text-[#8A919B] mt-1 leading-relaxed">
                                Instantly pair up with classmates from your branch who share similar study goals or complement your academic strengths.
                            </p>
                        </div>

                        {!buddyMatch ? (
                            <button
                                onClick={handleMatchBuddy}
                                disabled={matching}
                                className="w-full bg-[#1E1E1E] hover:bg-[#333] text-white text-xs font-extrabold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                {matching ? 'Finding a Match...' : 'Find Study Buddy'}
                            </button>
                        ) : (
                            <div className="bg-[#F4F6F8] border border-[#DDE3EA] p-5 rounded-2xl space-y-4 animate-in zoom-in-95 duration-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#E5F0A0] text-[#1E1E1E] flex items-center justify-center text-xs font-black shrink-0">
                                        {buddyMatch.avatar}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-black text-[#1E1E1E] truncate">{buddyMatch.name}</p>
                                        <p className="text-[9px] text-[#8A919B] font-bold truncate uppercase">{buddyMatch.college}</p>
                                    </div>
                                </div>
                                <div className="space-y-1.5 border-t border-[#DDE3EA] pt-3 text-[11px]">
                                    <p className="text-[#8A919B]"><strong className="text-[#1E1E1E]">Branch:</strong> {buddyMatch.branch}</p>
                                    <p className="text-[#8A919B]"><strong className="text-[#1E1E1E]">Semester:</strong> Sem {buddyMatch.semester}</p>
                                    <p className="text-[#8A919B]"><strong className="text-[#1E1E1E]">DP Partner:</strong> DP / {buddyMatch.commonWeakness}</p>
                                </div>
                                <button
                                    onClick={() => { setBuddyMatch(null); }}
                                    className="w-full bg-white hover:bg-slate-50 border border-[#DDE3EA] text-[#1E1E1E] text-[10px] font-black py-2 rounded-lg transition-colors"
                                >
                                    Reset Matcher
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 4. EVENTS & PLACEMENTS TAB */}
            {activeTab === 'events' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-in fade-in duration-300">
                    <div className="lg:col-span-2 space-y-5">
                        <div className="border-b border-[#DDE3EA] pb-3">
                            <h4 className="text-lg font-black text-[#1E1E1E]">Tech Events & Placement Drive Experiences</h4>
                            <p className="text-xs text-[#8A919B] mt-0.5">RSVP to fests, hackathons, and placement discussions around the VTU network</p>
                        </div>

                        <div className="space-y-4">
                            {events.map((event) => {
                                const hasRsvped = myRsvps.has(event.id);
                                return (
                                    <div key={event.id} className="bg-white border border-[#DDE3EA] rounded-[2rem] p-6 hover:border-[#1E1E1E] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[9px] font-black px-2.5 py-0.5 rounded uppercase ${
                                                    event.type === 'HACKATHON' ? 'bg-purple-50 text-purple-600' :
                                                    event.type === 'FEST' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
                                                }`}>
                                                    {event.type}
                                                </span>
                                                <span className="text-[10px] font-bold text-[#8A919B]">{event.date}</span>
                                            </div>
                                            <h5 className="font-extrabold text-[#1E1E1E] text-base leading-tight">{event.title}</h5>
                                            <div className="flex items-center gap-1.5 text-xs text-[#8A919B] font-semibold">
                                                <MapPin size={12} />
                                                <span>{event.college}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end border-t md:border-t-0 border-[#F4F6F8] pt-4 md:pt-0">
                                            <span className="text-xs font-semibold text-[#8A919B]">{event.rsvps} attending</span>
                                            <button
                                                onClick={() => handleRsvp(event.id)}
                                                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                                                    hasRsvped ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-[#1E1E1E] text-white hover:bg-[#333]'
                                                }`}
                                            >
                                                {hasRsvped ? '✓ RSVP\'d' : 'Attend Event'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-white border border-[#DDE3EA] rounded-[2rem] p-6 shadow-sm space-y-4">
                        <div className="p-3 bg-[#D4E4C8] text-[#1E1E1E] rounded-2xl w-fit">
                            <Briefcase size={20} />
                        </div>
                        <h5 className="font-extrabold text-[#1E1E1E]">Placement Drive Center</h5>
                        <p className="text-xs text-[#8A919B] leading-relaxed">
                            Graduating soon or preparing for internships? Use this section to check placement drives, browse crowd-sourced interview experiences, and view previous mock test links from fests.
                        </p>
                    </div>
                </div>
            )}

            {/* Create Post Modal Dialog */}
            {isCreateOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white border border-[#DDE3EA] rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full p-8 space-y-5 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center pb-4 border-b border-[#DDE3EA]">
                            <div>
                                <h4 className="text-[#1E1E1E] font-black text-lg">Create New Post</h4>
                                <p className="text-xs text-[#8A919B] font-semibold uppercase tracking-wider mt-0.5">Share with community</p>
                            </div>
                            <button 
                                onClick={() => setIsCreateOpen(false)} 
                                className="w-8 h-8 rounded-full bg-[#F4F6F8] hover:bg-[#1E1E1E] hover:text-white transition-colors flex items-center justify-center font-bold text-sm text-[#1E1E1E]"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-[#1E1E1E] uppercase tracking-widest">Post Content</label>
                            <textarea
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                placeholder="What would you like to share?"
                                className="w-full h-32 border border-[#DDE3EA] rounded-2xl p-4 focus:border-[#1E1E1E] focus:outline-none text-sm text-slate-800 bg-[#F4F6F8]/50 placeholder:text-[#8A919B]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-[#1E1E1E] uppercase tracking-widest">Tags (comma-separated)</label>
                            <input
                                type="text"
                                value={newPostTags}
                                onChange={(e) => setNewPostTags(e.target.value)}
                                placeholder="Study Tips, Exams, Projects"
                                className="w-full border border-[#DDE3EA] rounded-xl px-4 py-2.5 focus:border-[#1E1E1E] focus:outline-none text-sm text-slate-800 bg-[#F4F6F8]/50 placeholder:text-[#8A919B]"
                            />
                        </div>
                        <button
                            onClick={handleCreatePost}
                            disabled={!newPostContent.trim()}
                            className="w-full bg-[#1E1E1E] text-white font-bold py-3.5 rounded-xl hover:bg-[#333] transition-colors disabled:opacity-50"
                        >
                            Publish Post & Earn XP
                        </button>
                    </div>
                </div>
            )}

            {/* Create Study Group Modal Dialog */}
            {isCreateGroupOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white border border-[#DDE3EA] rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full p-8 space-y-5 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center pb-4 border-b border-[#DDE3EA]">
                            <div>
                                <h4 className="text-[#1E1E1E] font-black text-lg">Create Study Group</h4>
                                <p className="text-xs text-[#8A919B] font-semibold uppercase tracking-wider mt-0.5">Start collaborative study room</p>
                            </div>
                            <button 
                                onClick={() => setIsCreateGroupOpen(false)} 
                                className="w-8 h-8 rounded-full bg-[#F4F6F8] hover:bg-[#1E1E1E] hover:text-white transition-colors flex items-center justify-center font-bold text-sm text-[#1E1E1E]"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-[#1E1E1E] uppercase tracking-widest">Group Subject</label>
                            <input
                                type="text"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                placeholder="e.g. Microprocessors Lab"
                                className="w-full border border-[#DDE3EA] rounded-xl px-4 py-2.5 focus:border-[#1E1E1E] focus:outline-none text-sm text-slate-800 bg-[#F4F6F8]/50 placeholder:text-[#8A919B]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-[#1E1E1E] uppercase tracking-widest">Semester</label>
                            <select
                                value={newGroupSem}
                                onChange={(e) => setNewGroupSem(e.target.value)}
                                className="w-full border border-[#DDE3EA] rounded-xl px-4 py-2.5 focus:border-[#1E1E1E] focus:outline-none text-sm text-slate-800 bg-[#F4F6F8]/50"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                    <option key={s} value={s}>Semester {s}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-[#1E1E1E] uppercase tracking-widest">Description</label>
                            <textarea
                                value={newGroupDesc}
                                onChange={(e) => setNewGroupDesc(e.target.value)}
                                placeholder="Describe target goals..."
                                className="w-full h-24 border border-[#DDE3EA] rounded-2xl p-4 focus:border-[#1E1E1E] focus:outline-none text-sm text-slate-800 bg-[#F4F6F8]/50 placeholder:text-[#8A919B]"
                            />
                        </div>
                        <button
                            onClick={handleCreateGroup}
                            disabled={!newGroupName.trim() || !newGroupDesc.trim()}
                            className="w-full bg-[#1E1E1E] text-white font-bold py-3.5 rounded-xl hover:bg-[#333] transition-colors disabled:opacity-50"
                        >
                            Establish Study Room & Earn XP
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
