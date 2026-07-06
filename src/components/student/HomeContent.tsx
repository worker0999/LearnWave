'use client';
import React from 'react';
import { BookOpen, TrendingUp, Award, Clock, Calendar, ArrowRight, Zap } from 'lucide-react';
import { BookedSessions } from './BookedSessions';

interface HomeContentProps {
    user: any;
}

export function HomeContent({ user }: HomeContentProps) {
    const stats = [
        { label: 'Study Streak', value: '7 days', icon: Clock, bg: '#E5F0A0' },
        { label: 'Avg Score', value: '85%', icon: TrendingUp, bg: '#D4E4C8' },
        { label: 'Quizzes Done', value: '12', icon: Award, bg: '#E8EDF3' },
        { label: 'Subjects', value: '6', icon: BookOpen, bg: '#E5F0A0' }
    ];

    const upcomingEvents = [
        { title: 'Data Structures Quiz', time: 'Today, 2:00 PM', type: 'quiz', bg: '#E5F0A0' },
        { title: 'Assignment Deadline', time: 'Tomorrow, 11:59 PM', type: 'deadline', bg: '#F8D7D7' },
        { title: 'Mentor Session', time: 'Jan 8, 4:00 PM', type: 'session', bg: '#D4E4C8' }
    ];

    const recentActivity = [
        { action: 'Completed', item: 'Algorithm Analysis Module 3', time: '2h ago' },
        { action: 'Submitted', item: 'Database Assignment #2', time: '1d ago' },
        { action: 'Joined', item: 'Web Dev Study Group', time: '2d ago' }
    ];

    const subjects = [
        { name: 'Data Structures', code: 'CS51', progress: 82 },
        { name: 'Algorithms', code: 'CS52', progress: 65 },
        { name: 'DBMS', code: 'CS53', progress: 90 },
        { name: 'Operating Systems', code: 'CS54', progress: 55 },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <div
                        key={idx}
                        className="bg-white border border-[#DDE3EA] rounded-2xl p-5 hover:shadow-sm transition-all group"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: stat.bg }}>
                                <stat.icon size={18} className="text-[#1E1E1E]" />
                            </div>
                        </div>
                        <p className="text-2xl font-extrabold text-[#1E1E1E]">{stat.value}</p>
                        <p className="text-[#8A919B] text-xs font-semibold uppercase tracking-wider mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upcoming Events */}
                <div className="lg:col-span-2 bg-white border border-[#DDE3EA] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#E5F0A0] rounded-xl flex items-center justify-center">
                                <Calendar size={16} className="text-[#1E1E1E]" />
                            </div>
                            <h4 className="text-[#1E1E1E] font-bold text-base">Upcoming Events</h4>
                        </div>
                        <button className="text-[#8A919B] text-xs font-semibold flex items-center gap-1 hover:text-[#1E1E1E] hover:gap-2 transition-all">View all <ArrowRight size={12} /></button>
                    </div>
                    <div className="space-y-3">
                        {upcomingEvents.map((event, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-[#F4F6F8] rounded-xl hover:bg-[#EDF0F4] transition-all group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-8 rounded-full" style={{ backgroundColor: event.bg }} />
                                    <div>
                                        <p className="text-[#1E1E1E] font-semibold text-sm">{event.title}</p>
                                        <p className="text-[#8A919B] text-xs mt-0.5">{event.time}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-semibold px-3 py-1 rounded-full capitalize" style={{ backgroundColor: event.bg, color: '#1E1E1E' }}>
                                    {event.type}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white border border-[#DDE3EA] rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 bg-[#D4E4C8] rounded-xl flex items-center justify-center">
                            <Zap size={16} className="text-[#1E1E1E]" />
                        </div>
                        <h4 className="text-[#1E1E1E] font-bold text-base">Recent Activity</h4>
                    </div>
                    <div className="space-y-4">
                        {recentActivity.map((activity, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-[#D4E4C8]" />
                                <div>
                                    <p className="text-[#1E1E1E] text-sm leading-snug">
                                        <span className="font-bold">{activity.action}</span>{' '}
                                        {activity.item}
                                    </p>
                                    <p className="text-[#B0B7BF] text-xs mt-0.5">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Subject Progress */}
            <div className="bg-white border border-[#DDE3EA] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                    <h4 className="text-[#1E1E1E] font-bold text-base">Subject Progress</h4>
                    <div className="flex items-center gap-2">
                        <div className="text-center px-4 py-2 bg-[#F4F6F8] rounded-xl border border-[#DDE3EA]">
                            <p className="text-[#1E1E1E] font-extrabold text-base">88%</p>
                            <p className="text-[#8A919B] text-[10px] font-semibold uppercase tracking-wider">Attendance</p>
                        </div>
                        <div className="text-center px-4 py-2 bg-[#F4F6F8] rounded-xl border border-[#DDE3EA]">
                            <p className="text-[#1E1E1E] font-extrabold text-base">45/60</p>
                            <p className="text-[#8A919B] text-[10px] font-semibold uppercase tracking-wider">Credits</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subjects.map((subject, idx) => (
                        <div key={idx} className="p-4 bg-[#F4F6F8] rounded-xl border border-[#DDE3EA]">
                            <div className="flex justify-between items-center mb-3">
                                <div>
                                    <p className="text-[#1E1E1E] font-semibold text-sm">{subject.name}</p>
                                    <p className="text-[#B0B7BF] text-xs">{subject.code}</p>
                                </div>
                                <span className="font-extrabold text-sm text-[#1E1E1E]">{subject.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-[#DDE3EA] rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-1000 ease-out bg-[#D4E4C8]"
                                    style={{ width: `${subject.progress}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Booked Sessions */}
            <BookedSessions />
        </div>
    );
}
