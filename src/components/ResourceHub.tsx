'use client';
import React, { useState } from 'react';
import { BookOpen, FileText, Download, Search, Star, Eye, Sparkles, ArrowRight } from 'lucide-react';

export function ResourceHub() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('5');

    const subjects = [
        { id: 1, code: 'CS51', name: 'Data Structures', credits: 4, resources: { notes: 12, modelPapers: 5, previousPapers: 8 } },
        { id: 2, code: 'CS52', name: 'Algorithm Analysis & Design', credits: 4, resources: { notes: 10, modelPapers: 4, previousPapers: 6 } },
        { id: 3, code: 'CS53', name: 'Database Management Systems', credits: 4, resources: { notes: 15, modelPapers: 6, previousPapers: 10 } },
        { id: 4, code: 'CS54', name: 'Operating Systems', credits: 4, resources: { notes: 14, modelPapers: 5, previousPapers: 9 } },
        { id: 5, code: 'CS55', name: 'Computer Networks', credits: 3, resources: { notes: 11, modelPapers: 4, previousPapers: 7 } },
        { id: 6, code: 'CS56', name: 'Software Engineering', credits: 3, resources: { notes: 13, modelPapers: 5, previousPapers: 8 } }
    ];

    const recentUploads = [
        { id: 1, title: 'Data Structures - Module 5 Notes', subject: 'CS51', type: 'notes', uploadedBy: 'Dr. Smith', date: '2 days ago', downloads: 245, rating: 4.8 },
        { id: 2, title: 'DBMS Model Question Paper 2024', subject: 'CS53', type: 'model', uploadedBy: 'Prof. Kumar', date: '1 week ago', downloads: 189, rating: 4.9 },
        { id: 3, title: 'OS Previous Year Paper - Dec 2023', subject: 'CS54', type: 'previous', uploadedBy: 'Admin', date: '3 days ago', downloads: 312, rating: 5.0 }
    ];

    const filteredSubjects = subjects.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <p className="text-[#8A919B] text-xs font-semibold uppercase tracking-[0.2em] mb-1">Study Materials</p>
                    <h3 className="text-2xl font-extrabold text-[#1E1E1E] tracking-tight">Resource Hub</h3>
                    <p className="text-[#8A919B] text-sm mt-1">VTU syllabus notes, model & previous year papers</p>
                </div>
                <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="bg-white border border-[#DDE3EA] text-[#1E1E1E] text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#1E1E1E] transition-colors cursor-pointer"
                >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                        <option key={s} value={String(s)}>Semester {s}</option>
                    ))}
                </select>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A919B]" />
                <input
                    type="text"
                    placeholder="Search subjects by name or code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-[#DDE3EA] text-[#1E1E1E] placeholder-[#B0B7BF] rounded-2xl pl-11 pr-4 py-3 outline-none focus:border-[#1E1E1E] transition-colors text-sm"
                />
            </div>

            {/* Featured Resources */}
            <div className="bg-white border border-[#DDE3EA] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-[#E5F0A0] rounded-xl flex items-center justify-center">
                        <Sparkles size={16} className="text-[#1E1E1E]" />
                    </div>
                    <h4 className="text-[#1E1E1E] font-bold text-base">Recently Added</h4>
                </div>
                <div className="space-y-3">
                    {recentUploads.map((resource) => (
                        <div key={resource.id} className="flex items-center justify-between p-4 bg-[#F4F6F8] rounded-xl hover:bg-[#EDF0F4] transition-all group">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[#D4E4C8]">
                                    <FileText size={18} className="text-[#1E1E1E]" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h5 className="text-[#1E1E1E] font-semibold text-sm truncate">{resource.title}</h5>
                                    <div className="flex items-center gap-2 text-[#8A919B] text-xs mt-0.5">
                                        <span>{resource.subject}</span>
                                        <span>·</span>
                                        <span>{resource.uploadedBy}</span>
                                        <span>·</span>
                                        <span>{resource.date}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 shrink-0 ml-4">
                                <div className="flex items-center gap-3 text-xs text-[#8A919B] hidden md:flex">
                                    <span className="flex items-center gap-1"><Download size={12} />{resource.downloads}</span>
                                    <span className="flex items-center gap-1"><Star size={12} className="fill-[#E5F0A0] text-[#C5D080]" />{resource.rating}</span>
                                </div>
                                <button className="bg-[#1E1E1E] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#333] transition-colors flex items-center gap-1.5">
                                    <Download size={12} /> Download
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Subject Grid */}
            <div>
                <h4 className="text-[#1E1E1E] font-bold text-base mb-4">Subjects — Semester {selectedSemester}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredSubjects.map((subject) => (
                        <div key={subject.id} className="bg-white border border-[#DDE3EA] rounded-2xl p-5 hover:shadow-sm transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#E5F0A0] text-[#1E1E1E]">
                                        {subject.code}
                                    </span>
                                    <h5 className="text-[#1E1E1E] font-bold text-sm mt-2 leading-snug">{subject.name}</h5>
                                    <p className="text-[#B0B7BF] text-xs mt-0.5">{subject.credits} Credits</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#D4E4C8]">
                                    <BookOpen size={18} className="text-[#1E1E1E]" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {[
                                    { label: 'Notes', count: subject.resources.notes },
                                    { label: 'Model', count: subject.resources.modelPapers },
                                    { label: 'Previous', count: subject.resources.previousPapers },
                                ].map(({ label, count }) => (
                                    <div key={label} className="text-center p-2 bg-[#F4F6F8] rounded-xl border border-[#DDE3EA]">
                                        <p className="text-[#1E1E1E] font-extrabold text-lg leading-none">{count}</p>
                                        <p className="text-[#B0B7BF] text-[10px] font-semibold mt-0.5">{label}</p>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all bg-[#F4F6F8] text-[#1E1E1E] hover:bg-[#E8EDF3] border border-[#DDE3EA]">
                                <Eye size={14} /> View Resources <ArrowRight size={14} className="ml-auto" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
