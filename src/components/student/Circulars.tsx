'use client';
import React, { useState } from 'react';
import { FileText, Download, Calendar, ExternalLink } from 'lucide-react';

const circulars = [
  { id: 1, title: 'Updated Academic Calendar 2026', date: 'January 6, 2026', category: 'Academic', fileSize: '2.4 MB' },
  { id: 2, title: 'New Assessment Guidelines', date: 'January 4, 2026', category: 'Policy', fileSize: '1.8 MB' },
  { id: 3, title: 'Holiday Schedule - Winter Break', date: 'December 28, 2025', category: 'Schedule', fileSize: '890 KB' },
  { id: 4, title: 'Research Grant Opportunities', date: 'December 20, 2025', category: 'Opportunities', fileSize: '3.2 MB' },
  { id: 5, title: 'Library Resources Update', date: 'December 15, 2025', category: 'Resources', fileSize: '1.5 MB' },
  { id: 6, title: 'Student Code of Conduct', date: 'December 10, 2025', category: 'Policy', fileSize: '2.1 MB' }
];

const categoryBg: Record<string, string> = {
  Academic: '#E5F0A0',
  Policy: '#D4E4C8',
  Schedule: '#E8EDF3',
  Opportunities: '#E5F0A0',
  Resources: '#D4E4C8',
};

export function Circulars() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-[#8A919B] text-xs font-semibold uppercase tracking-[0.2em] mb-1">Official Documents</p>
        <h3 className="text-2xl font-extrabold text-[#1E1E1E] tracking-tight">Circulars</h3>
        <p className="text-[#8A919B] text-sm mt-1">Download official notices and documents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {circulars.map((circular) => {
          const bg = categoryBg[circular.category] || '#E8EDF3';
          return (
            <div
              key={circular.id}
              className="bg-white border border-[#DDE3EA] rounded-2xl p-5 cursor-pointer hover:shadow-sm transition-all group"
            >
              {/* Top */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 duration-300" style={{ backgroundColor: bg }}>
                  <FileText size={22} className="text-[#1E1E1E]" />
                </div>
                <button
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl text-[#1E1E1E]"
                  style={{ backgroundColor: bg }}
                  title="Download"
                >
                  <Download size={16} />
                </button>
              </div>

              {/* Title */}
              <h4 className="text-[#1E1E1E] font-semibold text-sm leading-snug mb-3">{circular.title}</h4>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#B0B7BF] text-xs">
                  <Calendar size={12} />
                  <span>{circular.date}</span>
                </div>
                <span className="text-[#B0B7BF] text-xs">{circular.fileSize}</span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg text-[#1E1E1E]" style={{ backgroundColor: bg }}>
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
    </div>
  );
}
