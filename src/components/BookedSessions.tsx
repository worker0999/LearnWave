import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Loader2, Video, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export function BookedSessions() {
    const router = useRouter();
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await fetch('/api/sessions', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setSessions(data.sessions || []);
                }
            } catch (error) {
                console.error('Error fetching sessions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-[#DDE3EA] border-t-[#1E1E1E] rounded-full animate-spin mb-3" />
                <p className="text-[#8A919B] text-sm">Loading your sessions...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <p className="text-[#8A919B] text-xs font-semibold uppercase tracking-[0.2em] mb-1">Schedule</p>
                <h3 className="text-xl font-extrabold text-[#1E1E1E] tracking-tight">My Sessions</h3>
                <p className="text-[#8A919B] text-sm mt-1">Manage your upcoming mentorship sessions</p>
            </div>

            {sessions.length === 0 ? (
                <div className="text-center py-12 bg-white border border-dashed border-[#DDE3EA] rounded-2xl">
                    <div className="w-14 h-14 bg-[#F4F6F8] rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <Calendar className="h-6 w-6 text-[#B0B7BF]" />
                    </div>
                    <p className="text-sm font-semibold text-[#1E1E1E]">No upcoming sessions</p>
                    <p className="text-xs text-[#8A919B] mt-1">Book a session with a mentor to get started.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {sessions.map((session) => (
                        <div key={session.id} className="bg-white border border-[#DDE3EA] rounded-2xl p-5 hover:shadow-sm transition-all">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
                                {/* Date chip */}
                                <div className="flex flex-col items-center justify-center p-4 bg-[#E5F0A0] rounded-2xl min-w-[72px] text-center shrink-0">
                                    <span className="text-[10px] text-[#1E1E1E] uppercase font-extrabold tracking-widest">
                                        {format(new Date(session.date), 'MMM')}
                                    </span>
                                    <span className="text-2xl font-extrabold text-[#1E1E1E] leading-none">
                                        {format(new Date(session.date), 'dd')}
                                    </span>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-base font-bold text-[#1E1E1E] mb-1 truncate">{session.subject}</h4>
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#8A919B]">
                                        <span className="flex items-center gap-1.5">
                                            <User size={12} />{session.mentor}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock size={12} />{format(new Date(session.time), 'hh:mm a')}
                                        </span>
                                        <span className={`flex items-center gap-1.5 font-semibold capitalize ${
                                            session.status === 'confirmed' ? 'text-[#6BBF8A]' :
                                            session.status === 'pending' ? 'text-[#C8A840]' : 'text-[#8A919B]'
                                        }`}>
                                            {session.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0">
                                    {session.status === 'pending' ? (
                                        <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#E5F0A0] text-[#1E1E1E]">
                                            Awaiting Approval
                                        </span>
                                    ) : session.status === 'confirmed' ? (
                                        <button
                                            className="flex items-center gap-2 bg-[#1E1E1E] hover:bg-[#333] text-white text-xs font-bold h-9 px-4 rounded-xl transition-colors disabled:opacity-30"
                                            onClick={() => session.platform && session.platform !== 'TBD' && window.open(session.platform, '_blank')}
                                            disabled={!session.platform || session.platform === 'TBD'}
                                        >
                                            <Video size={13} /> Join Meeting
                                        </button>
                                    ) : (
                                        <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#F4F6F8] border border-[#DDE3EA] text-[#8A919B] capitalize">
                                            {session.status}
                                        </span>
                                    )}
                                    <button
                                        className="flex items-center gap-2 bg-[#F4F6F8] hover:bg-[#EDF0F4] border border-[#DDE3EA] text-[#1E1E1E] text-xs font-bold h-9 px-3 rounded-xl transition-colors"
                                        onClick={async () => {
                                            try {
                                                const token = localStorage.getItem('token')
                                                await fetch('/api/messages/init', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                                    body: JSON.stringify({ targetUserId: session.mentorUserId })
                                                })
                                                localStorage.setItem('initialChatUserId', session.mentorUserId)
                                                router.push('/student/messages')
                                            } catch (e) { console.error(e) }
                                        }}
                                    >
                                        <MessageSquare size={13} /> Message
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
