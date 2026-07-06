'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Flame, BookOpen, Star } from 'lucide-react';

export function WelcomeCard() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const progress = 75;
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative rounded-3xl overflow-hidden bg-white border border-[#DDE3EA] p-7">
      {/* Soft accent blob */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#E5F0A0]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-[#D4E4C8]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-8">
        {/* Left: Greeting */}
        <div className="flex-1">
          <p className="text-[#8A919B] text-xs font-semibold uppercase tracking-[0.2em] mb-2">Good morning</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#1E1E1E] tracking-tight mb-2">
            {user?.name?.split(' ')[0] || 'Student'}
          </h2>
          <p className="text-[#8A919B] text-sm">
            You're on a roll! Keep up the momentum and hit your daily goals.
          </p>

          {/* Progress bar */}
          <div className="mt-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#8A919B] text-xs font-semibold uppercase tracking-wider">Semester Progress</span>
              <span className="text-[#1E1E1E] text-sm font-bold">{progress}%</span>
            </div>
            <div className="h-2 bg-[#F4F6F8] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#D4E4C8] rounded-full transition-all duration-1000 ease-out"
                style={{ width: mounted ? `${progress}%` : '0%' }}
              />
            </div>
          </div>
        </div>

        {/* Center: Progress Ring */}
        <div className="flex items-center justify-center">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#F4F6F8" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="40" fill="none"
                stroke="#D4E4C8"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={mounted ? offset : circumference}
                style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-extrabold text-[#1E1E1E]">{progress}</span>
              <span className="text-[10px] text-[#8A919B] font-semibold">%</span>
            </div>
          </div>
        </div>

        {/* Right: Stats */}
        <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
          {[
            { icon: <Flame size={16} />, value: '7', label: 'Day Streak', bg: '#E5F0A0' },
            { icon: <BookOpen size={16} />, value: '40', label: 'Modules', bg: '#D4E4C8' },
            { icon: <Star size={16} />, value: '9.2', label: 'CGPA', bg: '#E8EDF3' },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-3 bg-[#F4F6F8] rounded-2xl px-4 py-3 border border-[#DDE3EA]">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: stat.bg }}>
                <span className="text-[#1E1E1E]">{stat.icon}</span>
              </div>
              <div>
                <p className="text-[#1E1E1E] font-extrabold text-lg leading-none">{stat.value}</p>
                <p className="text-[#8A919B] text-[10px] font-semibold uppercase tracking-wider mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}