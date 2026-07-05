'use client'

import React, { useState, useMemo } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Clock, Loader2, ChevronRight, X, Video, Calendar as CalendarIcon } from 'lucide-react'
import { format, addDays, isSameDay } from 'date-fns'

interface BookSessionModalProps {
    isOpen: boolean
    onClose: () => void
    mentor: {
        id: string
        mentorId: string
        name: string
    } | null
}

export function BookSessionModal({ isOpen, onClose, mentor }: BookSessionModalProps) {
    const [date, setDate] = useState<Date>(new Date())
    const [time, setTime] = useState<string>('10:00')
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const availableDates = useMemo(() => {
        const dates: Date[] = []
        let current = new Date()
        while (dates.length < 14) {
            if (current.getDay() !== 0) {
                dates.push(new Date(current))
            }
            current = addDays(current, 1)
        }
        return dates
    }, [])

    if (!mentor) return null

    const handleBook = async () => {
        setLoading(true)
        try {
            const [hours, minutes] = time.split(':').map(Number)
            const scheduledAt = new Date(date)
            scheduledAt.setHours(hours, minutes, 0, 0)

            const response = await fetch('/api/sessions/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    mentorId: mentor.mentorId,
                    scheduledAt: scheduledAt.toISOString(),
                    durationMinutes: 60
                })
            })

            const data = await response.json()

            if (response.ok) {
                toast({
                    title: "Session Booked!",
                    description: `Successfully scheduled for ${format(scheduledAt, 'PPP p')}.`,
                })
                onClose()
            } else {
                toast({
                    title: "Booking Failed",
                    description: data.error || "Please try again later.",
                    variant: "destructive"
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "A network error occurred.",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const timeSlots = [
        "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
        "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
    ]

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="!max-w-[800px] !w-[800px] p-0 overflow-hidden bg-[#E8EDF3] border-none rounded-[32px] shadow-2xl font-['Urbanist']">
                <div className="flex h-full w-full">

                    {/* LEFT PANEL */}
                    <div className="w-[300px] bg-[#1E1E1E] p-10 text-white flex flex-col justify-between shrink-0 relative overflow-hidden">
                        {/* Decorative circle */}
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#D4E4C8] opacity-10 rounded-full blur-3xl"></div>
                        
                        <div className="relative z-10">
                            <span className="bg-white/10 text-[#D4E4C8] border border-white/10 mb-8 inline-block px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest">
                                Mentorship
                            </span>
                            <h2 className="text-3xl font-extrabold leading-tight mb-6">{mentor.name}</h2>
                            <div className="space-y-5">
                                <div className="flex items-center gap-4 text-sm font-medium text-[#8A919B]">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                                        <Clock size={16} />
                                    </div>
                                    60-min session
                                </div>
                                <div className="flex items-center gap-4 text-sm font-medium text-[#8A919B]">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                                        <Video size={16} />
                                    </div>
                                    Video call via LearnWave
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 mt-12 p-6 bg-white/5 rounded-[24px] border border-white/10">
                            <p className="text-[10px] text-[#8A919B] uppercase font-bold tracking-[0.2em] mb-3">Confirmation</p>
                            <p className="text-sm font-bold text-white mb-1">{format(date, 'EEEE, MMM d')}</p>
                            <p className="text-4xl font-black text-[#E5F0A0]">{time}</p>
                        </div>
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="w-[500px] p-10 bg-white flex flex-col relative shrink-0">
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-xl hover:bg-[#F4F6F8] text-[#8A919B] transition-colors z-20"
                        >
                            <X size={20} />
                        </button>

                        <div className="space-y-12 flex-1">
                            {/* DATE SELECTION */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-[#E5F0A0] text-[#1E1E1E] flex items-center justify-center font-bold text-sm">1</div>
                                    <h3 className="text-sm font-extrabold text-[#1E1E1E] tracking-tight uppercase">Choose Date</h3>
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar-h">
                                    {availableDates.map((d) => {
                                        const isSelected = isSameDay(d, date)
                                        return (
                                            <button
                                                key={d.toISOString()}
                                                onClick={() => setDate(d)}
                                                className={`flex flex-col items-center justify-center min-w-[75px] py-4 rounded-2xl transition-all border-2 ${isSelected
                                                        ? 'bg-[#1E1E1E] text-white border-[#1E1E1E] shadow-xl shadow-black/10'
                                                        : 'bg-[#F4F6F8] text-[#1E1E1E] border-transparent hover:border-[#DDE3EA]'
                                                    }`}
                                            >
                                                <span className={`text-[9px] font-bold uppercase mb-1 tracking-widest ${isSelected ? 'text-[#8A919B]' : 'text-[#8A919B]'}`}>
                                                    {format(d, 'EEE')}
                                                </span>
                                                <span className="text-2xl font-black leading-none">{format(d, 'd')}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* TIME SELECTION */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-[#D4E4C8] text-[#1E1E1E] flex items-center justify-center font-bold text-sm">2</div>
                                    <h3 className="text-sm font-extrabold text-[#1E1E1E] tracking-tight uppercase">Choose Time</h3>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {timeSlots.map((slot) => (
                                        <button
                                            key={slot}
                                            onClick={() => setTime(slot)}
                                            className={`h-12 rounded-2xl transition-all font-bold text-xs border-2 ${time === slot
                                                    ? 'bg-[#E5F0A0] text-[#1E1E1E] border-[#E5F0A0] shadow-lg shadow-[#E5F0A0]/20'
                                                    : 'bg-[#F4F6F8] text-[#1E1E1E] border-transparent hover:border-[#DDE3EA]'
                                                }`}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ACTION AREA */}
                        <div className="mt-auto pt-8 border-t border-[#DDE3EA] flex flex-col gap-4">
                            <button
                                onClick={handleBook}
                                disabled={loading}
                                className="w-full h-14 bg-[#1E1E1E] hover:bg-[#333] text-white rounded-[24px] shadow-2xl transition-all font-extrabold text-lg group flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Confirm Booking
                                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                            <div className="flex items-center justify-center gap-2 text-[11px] text-[#8A919B] font-bold">
                                <CalendarIcon size={12} />
                                Auto-syncs with your student calendar
                            </div>
                        </div>
                    </div>
                </div>

                <style jsx global>{`
                    .custom-scrollbar-h::-webkit-scrollbar {
                        height: 4px;
                    }
                    .custom-scrollbar-h::-webkit-scrollbar-thumb {
                        background: #DDE3EA;
                        border-radius: 10px;
                    }
                `}</style>
            </DialogContent>
        </Dialog>
    )
}
