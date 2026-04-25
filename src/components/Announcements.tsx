'use client';
import React, { useState } from 'react';
import { Bell, AlertCircle, Info, CheckCircle, Pin, ArrowRight, FileText, Download, Calendar, ExternalLink } from 'lucide-react';

// --- Announcements Data ---
const announcements = [
  {
    id: 1,
    title: 'New Course Release: Advanced Machine Learning',
    date: 'January 7, 2026',
    type: 'info',
    icon: <Info size={16} />,
    bg: '#D4E4C8',
    message: 'Explore cutting-edge ML techniques and algorithms in our latest course offering.',
    pinned: true
  },
  {
    id: 2,
    title: 'Maintenance Scheduled',
    date: 'January 10, 2026',
    type: 'warning',
    icon: <AlertCircle size={16} />,
    bg: '#E5F0A0',
    message: 'Platform maintenance from 2:00 AM to 4:00 AM EST. Limited access during this time.',
    pinned: false
  },
  {
    id: 3,
    title: 'Winter Semester Registration Open',
    date: 'January 5, 2026',
    type: 'success',
    icon: <CheckCircle size={16} />,
    bg: '#D4E4C8',
    message: 'Register now for winter semester courses. Early bird discounts available until Jan 15.',
    pinned: false
  },
  {
    id: 4,
    title: 'Community Event: Virtual Workshop',
    date: 'January 12, 2026',
    type: 'event',
    icon: <Bell size={16} />,
    bg: '#E8EDF3',
    message: 'Join us for a live workshop on effective learning strategies. Register in the Community tab.',
    pinned: false
  }
];

// --- Circulars Data ---
const categoryBg: Record<string, string> = {
  Academic: '#E5F0A0',
  Policy: '#D4E4C8',
  Schedule: '#E8EDF3',
  Opportunities: '#E5F0A0',
  Resources: '#D4E4C8',
};

const circulars = [
  { id: 1, title: 'Updated Academic Calendar 2026', date: 'January 6, 2026', category: 'Academic', fileSize: '2.4 MB' },
  { id: 2, title: 'New Assessment Guidelines', date: 'January 4, 2026', category: 'Policy', fileSize: '1.8 MB' },
  { id: 3, title: 'Holiday Schedule - Winter Break', date: 'December 28, 2025', category: 'Schedule', fileSize: '890 KB' },
  { id: 4, title: 'Research Grant Opportunities', date: 'December 20, 2025', category: 'Opportunities', fileSize: '3.2 MB' },
  { id: 5, title: 'Library Resources Update', date: 'December 15, 2025', category: 'Resources', fileSize: '1.5 MB' },
  { id: 6, title: 'Student Code of Conduct', date: 'December 10, 2025', category: 'Policy', fileSize: '2.1 MB' }
];

type Tab = 'announcements' | 'circulars';

export function Announcements() {
  const [activeTab, setActiveTab] = useState<Tab>('announcements');
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-[#8A919B] text-xs font-semibold uppercase tracking-[0.2em] mb-1">Notices & Documents</p>
        <h3 className="text-2xl font-extrabold text-[#1E1E1E] tracking-tight">Announcements & Circulars</h3>
        <p className="text-[#8A919B] text-sm mt-1">Stay updated with all official notices and documents</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center bg-[#F4F6F8] border border-[#DDE3EA] rounded-2xl p-1 w-fit gap-1">
        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'announcements'
              ? 'bg-white text-[#1E1E1E] shadow-sm border border-[#DDE3EA]'
              : 'text-[#8A919B] hover:text-[#1E1E1E]'
          }`}
        >
          <Bell size={16} />
          Announcements
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${activeTab === 'announcements' ? 'bg-[#E5F0A0] text-[#1E1E1E]' : 'bg-[#DDE3EA] text-[#8A919B]'}`}>
            {announcements.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('circulars')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'circulars'
              ? 'bg-white text-[#1E1E1E] shadow-sm border border-[#DDE3EA]'
              : 'text-[#8A919B] hover:text-[#1E1E1E]'
          }`}
        >
          <FileText size={16} />
          Circulars
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${activeTab === 'circulars' ? 'bg-[#D4E4C8] text-[#1E1E1E]' : 'bg-[#DDE3EA] text-[#8A919B]'}`}>
            {circulars.length}
          </span>
        </button>
      </div>

      {/* ── ANNOUNCEMENTS TAB ── */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          {/* Pinned */}
          {announcements.filter(a => a.pinned).map((a) => (
            <div key={a.id} className="relative bg-white border border-[#DDE3EA] rounded-2xl p-6 overflow-hidden">
              <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[#8A919B] text-[10px] font-bold uppercase tracking-widest">
                <Pin size={10} /> Pinned
              </div>
              <div className="absolute -right-16 -bottom-16 w-40 h-40 bg-[#D4E4C8]/20 rounded-full" />
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: a.bg }}>
                  <span className="text-[#1E1E1E]">{a.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="text-[#1E1E1E] font-bold text-base leading-snug">{a.title}</h4>
                    <span className="text-[#B0B7BF] text-xs shrink-0 mt-1">{a.date}</span>
                  </div>
                  <p className="text-[#8A919B] text-sm mt-2 leading-relaxed">{a.message}</p>
                  <button className="mt-4 flex items-center gap-2 text-[#1E1E1E] text-sm font-semibold hover:gap-3 transition-all">
                    Read more <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Others */}
          {announcements.filter(a => !a.pinned).map((a) => (
            <div
              key={a.id}
              onClick={() => setExpanded(expanded === a.id ? null : a.id)}
              className="bg-white border border-[#DDE3EA] rounded-2xl p-5 cursor-pointer hover:shadow-sm transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: a.bg }}>
                  <span className="text-[#1E1E1E]">{a.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="text-[#1E1E1E] font-semibold text-sm leading-snug">{a.title}</h4>
                    <span className="text-[#B0B7BF] text-xs shrink-0">{a.date}</span>
                  </div>
                  <div className={`overflow-hidden transition-all duration-300 ${expanded === a.id ? 'max-h-40 mt-2' : 'max-h-0'}`}>
                    <p className="text-[#8A919B] text-sm leading-relaxed">{a.message}</p>
                  </div>
                  {expanded !== a.id && (
                    <p className="text-[#B0B7BF] text-xs mt-1 truncate">{a.message}</p>
                  )}
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg capitalize shrink-0" style={{ backgroundColor: a.bg, color: '#1E1E1E' }}>
                  {a.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CIRCULARS TAB ── */}
      {activeTab === 'circulars' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {circulars.map((circular) => {
            const bg = categoryBg[circular.category] || '#E8EDF3';
            return (
              <div
                key={circular.id}
                className="bg-white border border-[#DDE3EA] rounded-2xl p-5 cursor-pointer hover:shadow-sm transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 duration-300" style={{ backgroundColor: bg }}>
                    <FileText size={20} className="text-[#1E1E1E]" />
                  </div>
                  <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl"
                    style={{ backgroundColor: bg }}
                    title="Download"
                  >
                    <Download size={15} className="text-[#1E1E1E]" />
                  </button>
                </div>

                <h4 className="text-[#1E1E1E] font-semibold text-sm leading-snug mb-3">{circular.title}</h4>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#B0B7BF] text-xs">
                    <Calendar size={12} />
                    <span>{circular.date}</span>
                  </div>
                  <span className="text-[#B0B7BF] text-xs">{circular.fileSize}</span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg" style={{ backgroundColor: bg, color: '#1E1E1E' }}>
                    {circular.category}
                  </span>
                  <button className="text-[#B0B7BF] group-hover:text-[#8A919B] transition-colors">
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
