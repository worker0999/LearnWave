import { useState, useEffect } from 'react';
import { Star, Clock, Calendar, Mail, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BookSessionModal } from './BookSessionModal';
import { BookedSessions } from './BookedSessions';

interface Mentor {
    id: string;
    mentorId: string;
    name: string;
    avatar?: string;
    expertise: string[];
    rating: number;
    reviews: number;
    availability: string;
    bio: string;
}

interface MentorsProps {
    onMessage?: () => void;
}

export function Mentors({ onMessage }: MentorsProps) {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMentor, setSelectedMentor] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const response = await fetch('/api/mentors');
                if (response.ok) {
                    const data = await response.json();
                    setMentors(data.mentors);
                }
            } catch (error) {
                console.error('Error fetching mentors:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMentors();
    }, []);

    const filtered = mentors.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.expertise.some(e => e.toLowerCase().includes(search.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-2 border-[#DDE3EA] border-t-[#1E1E1E] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <p className="text-[#8A919B] text-xs font-semibold uppercase tracking-[0.2em] mb-1">Connect</p>
                    <h3 className="text-2xl font-extrabold text-[#1E1E1E] tracking-tight">Find a Mentor</h3>
                    <p className="text-[#8A919B] text-sm mt-1">Connect with experts to accelerate your learning</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A919B]" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search mentors..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DDE3EA] rounded-xl text-sm text-[#1E1E1E] placeholder-[#B0B7BF] outline-none focus:border-[#1E1E1E] transition-colors"
                    />
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-[#DDE3EA]">
                    <div className="w-14 h-14 bg-[#F4F6F8] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Search className="h-6 w-6 text-[#B0B7BF]" />
                    </div>
                    <h4 className="text-base font-bold text-[#1E1E1E]">No mentors found</h4>
                    <p className="text-[#8A919B] text-sm mt-1">Check back later as we onboard more experts.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filtered.map((mentor) => (
                        <div
                            key={mentor.id}
                            className="bg-white border border-[#DDE3EA] rounded-2xl p-6 hover:shadow-sm transition-all"
                        >
                            <div className="flex items-start gap-4">
                                {/* Avatar */}
                                <div className="h-14 w-14 rounded-2xl bg-[#E5F0A0] overflow-hidden flex items-center justify-center text-[#1E1E1E] text-xl font-extrabold shrink-0">
                                    {mentor.avatar ? (
                                        <img src={mentor.avatar} alt={mentor.name} className="h-full w-full object-cover" />
                                    ) : (
                                        mentor.name.split(' ').map(n => n[0]).join('')
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-2">
                                        <h4 className="text-base font-bold text-[#1E1E1E] truncate">{mentor.name}</h4>
                                        <div className="flex items-center gap-1 bg-[#F4F6F8] border border-[#DDE3EA] px-2 py-1 rounded-full shrink-0">
                                            <Star size={12} className="fill-[#E5F0A0] text-[#B8C840]" />
                                            <span className="text-xs font-bold text-[#1E1E1E]">{mentor.rating.toFixed(1)}</span>
                                        </div>
                                    </div>

                                    {/* Expertise tags */}
                                    <div className="flex flex-wrap gap-1.5 mt-2 mb-2">
                                        {mentor.expertise.slice(0, 3).map((exp, i) => (
                                            <span key={i} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#D4E4C8] text-[#1E1E1E]">
                                                {exp}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-[#8A919B]">
                                        <span className="flex items-center gap-1"><Clock size={12} />{mentor.reviews} Reviews</span>
                                        <span className={`flex items-center gap-1 font-semibold ${mentor.availability === 'Available Today' ? 'text-[#6BBF8A]' : 'text-[#8A919B]'}`}>
                                            <Calendar size={12} />{mentor.availability}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Bio */}
                            <p className="mt-4 text-sm text-[#8A919B] leading-relaxed line-clamp-2 italic">
                                "{mentor.bio}"
                            </p>

                            {/* Actions */}
                            <div className="mt-5 flex gap-3">
                                <button
                                    className="flex-1 flex items-center justify-center gap-2 bg-[#1E1E1E] hover:bg-[#333] text-white text-sm font-bold h-10 rounded-xl transition-colors"
                                    onClick={() => { setSelectedMentor(mentor); setIsModalOpen(true); }}
                                >
                                    <Calendar size={14} /> Book Session
                                </button>
                                <button
                                    className="flex-1 flex items-center justify-center gap-2 bg-[#F4F6F8] hover:bg-[#EDF0F4] text-[#1E1E1E] text-sm font-bold h-10 rounded-xl border border-[#DDE3EA] transition-colors"
                                    onClick={async () => {
                                        try {
                                            const token = localStorage.getItem('token')
                                            await fetch('/api/messages/init', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                                body: JSON.stringify({ targetUserId: mentor.id })
                                            })
                                            localStorage.setItem('initialChatUserId', mentor.id)
                                            router.push('/student/messages')
                                        } catch (e) { console.error(e) }
                                    }}
                                >
                                    <Mail size={14} /> Message
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <BookSessionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mentor={selectedMentor}
            />

            <div className="mt-10 pt-8 border-t border-[#DDE3EA]">
                <BookedSessions />
            </div>
        </div>
    );
}
