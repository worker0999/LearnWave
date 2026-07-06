import React from 'react';
import { User, MapPin, Mail, BookOpen, Award, GraduationCap, Monitor, Calendar, Edit3, Share2, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { xpForLevel } from '@/lib/xp-config';

export function Profile() {
    const { user } = useAuth();

    if (!user) return null;

    const initials = user.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
        : '??';

    const getFrameStyle = (frameKey: string | null | undefined) => {
        switch (frameKey) {
            case 'bronze-frame': return 'border-[6px] border-[#CD7F32] shadow-[0_0_15px_rgba(205,127,50,0.3)]';
            case 'silver-frame': return 'border-[6px] border-[#C0C0C0] shadow-[0_0_15px_rgba(192,192,192,0.3)]';
            case 'gold-frame': return 'border-[6px] border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.4)]';
            case 'platinum-frame': return 'border-[6px] border-[#A5B4FC] shadow-[0_0_15px_rgba(165,180,252,0.4)]';
            case 'diamond-frame': return 'border-[6px] border-[#67E8F9] shadow-[0_0_15px_rgba(103,232,249,0.5)]';
            case 'legendary-frame': return 'border-[6px] border-[#EF4444] ring-4 ring-[#F97316] animate-pulse shadow-[0_0_25px_rgba(239,68,68,0.6)]';
            default: return 'border-4 border-[#E8EDF3]';
        }
    };

    const currentLevelStartXP = xpForLevel(user.level || 1);
    const nextLevelStartXP = xpForLevel((user.level || 1) + 1);
    const progressPercent = nextLevelStartXP > 0 
        ? Math.min(100, Math.max(0, Math.round(((user.xp || 0) / nextLevelStartXP) * 100))) 
        : 100;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Profile Header */}
            <div className="relative">
                <div className="h-48 rounded-[32px] bg-gradient-to-br from-[#E5F0A0] via-[#D4E4C8] to-[#E8EDF3] shadow-inner overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
                    <div className="absolute top-6 right-6 flex gap-2">
                        <button className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl text-[#1E1E1E] hover:bg-white/40 transition-all border border-white/20 shadow-sm">
                            <Edit3 size={18} />
                        </button>
                    </div>
                </div>

                <div className="px-8 relative -mt-16 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                    <div className={`h-32 w-32 rounded-[32px] bg-white shadow-2xl flex items-center justify-center text-[#1E1E1E] text-4xl font-black z-10 shrink-0 transform hover:scale-105 transition-all duration-500 overflow-hidden ${getFrameStyle(user.equippedFrame)}`}>
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                            initials
                        )}
                    </div>

                    <div className="flex-1 pb-2">
                        {user.equippedTitle && (
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0ea5e9] mb-1">
                                🎖️ {user.equippedTitle}
                            </p>
                        )}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1">
                            <h2 className="text-3xl font-extrabold text-[#1E1E1E] tracking-tight">{user.name || 'Student Name'}</h2>
                            <div className="bg-[#1E1E1E] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                ⚡ Level {user.level || 1}
                            </div>
                            <div className="bg-cyan-50 text-cyan-700 border border-cyan-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                ✨ {user.xp || 0} Total XP
                            </div>
                        </div>
                        <p className="text-[#8A919B] font-bold text-sm tracking-wide">
                            {user.branch || 'Computer Science'} • Semester {user.semester || '6'} • {user.usn || '1LW21CS001'}
                        </p>
                    </div>

                    <div className="flex gap-3 pb-2 w-full md:w-auto justify-center md:justify-end">
                        <button className="flex-1 md:flex-none h-11 px-6 bg-[#1E1E1E] hover:bg-[#333] text-white rounded-2xl shadow-xl transition-all font-extrabold text-sm flex items-center justify-center gap-2">
                            <Edit3 size={16} /> Edit Profile
                        </button>
                        <button className="h-11 w-11 flex items-center justify-center bg-white border border-[#DDE3EA] text-[#1E1E1E] rounded-2xl hover:bg-[#F4F6F8] transition-all shadow-sm shrink-0">
                            <Share2 size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                    {/* XP Progress Card */}
                    <div className="bg-white rounded-[32px] p-8 border border-[#DDE3EA] shadow-sm space-y-4">
                        <h3 className="text-xs font-black text-[#1E1E1E] uppercase tracking-[0.2em] flex items-center gap-2">
                            🏆 Level & Experience
                        </h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-black text-[#1E1E1E]">Level {user.level || 1}</p>
                                <p className="text-xs text-[#8A919B] font-semibold uppercase mt-0.5">Title: {user.equippedTitle || 'Newcomer'}</p>
                            </div>
                            <span className="text-sm font-black text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">{user.xp || 0} XP</span>
                        </div>
                        
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-[#8A919B]">
                                <span>Progress to next level</span>
                                <span>{user.xp || 0}/{nextLevelStartXP} XP</span>
                            </div>
                            <div className="h-2 w-full bg-[#F4F6F8] rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-cyan-500 rounded-full transition-all duration-500" 
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                        <button 
                            onClick={() => { window.location.search = '?page=level-path'; }}
                            className="w-full text-center bg-[#F4F6F8] hover:bg-[#1E1E1E] hover:text-white transition-colors text-[10px] font-black uppercase tracking-wider py-2.5 rounded-xl border border-[#DDE3EA] mt-2 block"
                        >
                            View Reward Path
                        </button>
                    </div>

                    <div className="bg-white rounded-[32px] p-8 border border-[#DDE3EA] shadow-sm">
                        <h3 className="text-xs font-black text-[#1E1E1E] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <Star size={14} className="text-[#E5F0A0] fill-[#E5F0A0]" /> Academic Performance
                        </h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Cumulative GPA', value: '9.4', total: '10', percent: 94, color: '#E5F0A0' },
                                { label: 'Course Completion', value: '18', total: '24', percent: 75, color: '#D4E4C8' },
                                { label: 'Attendance Rate', value: '92', total: '100', percent: 92, color: '#1E1E1E' }
                            ].map((stat, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-bold text-[#8A919B]">{stat.label}</span>
                                        <span className="text-sm font-black text-[#1E1E1E]">{stat.value}<span className="text-[10px] text-[#8A919B] font-bold">/{stat.total}</span></span>
                                    </div>
                                    <div className="h-2 w-full bg-[#F4F6F8] rounded-full overflow-hidden">
                                        <div 
                                            className="h-full transition-all duration-1000 ease-out rounded-full" 
                                            style={{ width: `${stat.percent}%`, backgroundColor: stat.color }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-[32px] p-8 border border-[#DDE3EA] shadow-sm">
                        <h3 className="text-xs font-black text-[#1E1E1E] uppercase tracking-[0.2em] mb-6">Contact Info</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 group">
                                <div className="h-10 w-10 rounded-xl bg-[#F4F6F8] flex items-center justify-center text-[#8A919B] group-hover:bg-[#E5F0A0] group-hover:text-[#1E1E1E] transition-colors">
                                    <Mail size={18} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold text-[#8A919B] uppercase">Email Address</p>
                                    <p className="text-sm font-extrabold text-[#1E1E1E] truncate">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="h-10 w-10 rounded-xl bg-[#F4F6F8] flex items-center justify-center text-[#8A919B] group-hover:bg-[#D4E4C8] group-hover:text-[#1E1E1E] transition-colors">
                                    <MapPin size={18} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold text-[#8A919B] uppercase">Location</p>
                                    <p className="text-sm font-extrabold text-[#1E1E1E]">Bangalore, India</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[32px] p-8 border border-[#DDE3EA] shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xs font-black text-[#1E1E1E] uppercase tracking-[0.2em]">Ongoing Courses</h3>
                            <button className="text-[10px] font-black text-[#1E1E1E] uppercase tracking-widest border-b-2 border-[#E5F0A0] pb-0.5">View All</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { title: 'Advanced React Architecture', code: 'CS-302', instructor: 'Dr. Sarah Wilson', icon: <Monitor size={20} />, color: '#E5F0A0' },
                                { title: 'Database Systems', code: 'CS-405', instructor: 'Prof. Michael Brown', icon: <BookOpen size={20} />, color: '#D4E4C8' }
                            ].map((course, i) => (
                                <div key={i} className="p-5 rounded-2xl bg-[#F4F6F8] border border-[#DDE3EA] hover:border-[#1E1E1E] transition-all group cursor-pointer">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center transition-colors group-hover:bg-[#1E1E1E] group-hover:text-white">
                                            {course.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-extrabold text-[#1E1E1E] truncate mb-0.5">{course.title}</h4>
                                            <p className="text-[10px] font-bold text-[#8A919B]">{course.code} • {course.instructor}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-[32px] p-8 border border-[#DDE3EA] shadow-sm">
                        <h3 className="text-xs font-black text-[#1E1E1E] uppercase tracking-[0.2em] mb-6">Bio & Summary</h3>
                        <p className="text-sm font-medium text-[#1E1E1E] leading-relaxed italic border-l-4 border-[#E5F0A0] pl-6 py-2">
                            "Passionate Full-Stack Developer and UI Designer with a focus on building educational tools. I love solving complex architectural problems and creating smooth user experiences. Currently exploring the intersection of AI and student productivity."
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 mt-8 gap-6 pt-8 border-t border-[#DDE3EA]">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-[#8A919B] uppercase tracking-widest mb-1">Join Date</span>
                                <span className="text-xs font-extrabold text-[#1E1E1E]">Sept 2023</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-[#8A919B] uppercase tracking-widest mb-1">Learning Track</span>
                                <span className="text-xs font-extrabold text-[#1E1E1E]">Engineering</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-[#8A919B] uppercase tracking-widest mb-1">Certificates</span>
                                <span className="text-xs font-extrabold text-[#1E1E1E]">12 Completed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
