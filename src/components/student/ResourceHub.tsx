'use client';
import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Download, Search, Sparkles, ArrowRight, ArrowLeft, Video, Book, LayoutGrid, FileQuestion, Eye } from 'lucide-react';
import { VTU_SCHEME_2025, getSubjectsForSemester } from '@/lib/vtu-scheme-2025';

export function ResourceHub() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('3');
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [selectedModule, setSelectedModule] = useState<number | string | null>(null); // 1-5, or 'papers', 'syllabus'
    const [resources, setResources] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // PDF Preview Modal State
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewTitle, setPreviewTitle] = useState('');

    const getCorrectFileUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('/uploads/')) {
            return `/api${url}`;
        }
        return url;
    };

    // Preferences
    const [preferencesSet, setPreferencesSet] = useState(false);
    const [selectedScheme, setSelectedScheme] = useState('2025');
    const [selectedBranch, setSelectedBranch] = useState('CSE');

    useEffect(() => {
        const savedScheme = localStorage.getItem('vtu_scheme');
        const savedBranch = localStorage.getItem('vtu_branch');
        if (savedScheme && savedBranch) {
            setSelectedScheme(savedScheme);
            setSelectedBranch(savedBranch);
            setPreferencesSet(true);
        }
    }, []);

    const savePreferences = () => {
        localStorage.setItem('vtu_scheme', selectedScheme);
        localStorage.setItem('vtu_branch', selectedBranch);
        setPreferencesSet(true);
    };

    // Get subjects for current semester
    let currentSubjects: string[] = [];
    
    if (selectedScheme === '2025' && (selectedBranch === 'CSE' || parseInt(selectedSemester) <= 2)) {
        currentSubjects = selectedSemester ? getSubjectsForSemester(parseInt(selectedSemester)) : [];
    }
    
    const filteredSubjects = currentSubjects.filter(s =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Fetch resources when a module/subject is selected
    useEffect(() => {
        if (selectedSubject && selectedModule) {
            const fetchResources = async () => {
                setLoading(true);
                try {
                    const token = localStorage.getItem('token');
                    let url = `/api/resources?semester=${selectedSemester}&subject=${encodeURIComponent(selectedSubject)}`;
                    
                    if (typeof selectedModule === 'number') {
                        url += `&module_number=${selectedModule}`;
                    } else if (selectedModule === 'papers') {
                        url += `&type=QUESTION_PAPER`;
                    } else if (selectedModule === 'syllabus') {
                        url += `&type=SYLLABUS`;
                    } else if (selectedModule === 'library') {
                        url = `/api/resources?is_library=true`;
                    }

                    const res = await fetch(url, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    
                    if (res.ok) {
                        const data = await res.json();
                        setResources(data.resources || []);
                    }
                } catch (error) {
                    console.error("Failed to fetch resources", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchResources();
        }
    }, [selectedSubject, selectedModule, selectedSemester]);

    const formatSize = (bytes: number) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const getIconForType = (type: string) => {
        switch(type?.toUpperCase()) {
            case 'VIDEO': return <Video size={18} className="text-blue-500" />;
            case 'QUESTION_PAPER': return <FileQuestion size={18} className="text-purple-500" />;
            case 'SYLLABUS': return <Book size={18} className="text-orange-500" />;
            default: return <FileText size={18} className="text-[#1E1E1E]" />;
        }
    };

    const handleVote = async (resourceId: string, voteType: 'upvote' | 'downvote') => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/resources/rate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ resourceId, voteType })
            });

            if (res.ok) {
                const data = await res.json();
                setResources(prev => prev.map(r => {
                    if (r.id === resourceId) {
                        return { ...r, upvotes: data.upvotes, downvotes: data.downvotes };
                    }
                    return r;
                }));
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to register vote.');
            }
        } catch (error) {
            console.error('Failed to vote:', error);
        }
    };

    // View: Onboarding / Preferences Setup
    if (!preferencesSet) {
        return (
            <div className="max-w-2xl mx-auto pt-8 pb-32 animate-in fade-in zoom-in duration-500">
                <div className="bg-white border border-[#DDE3EA] rounded-3xl p-8 shadow-sm">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[#F4F6F8] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#1E1E1E]">
                            <BookOpen size={32} />
                        </div>
                        <h2 className="text-2xl font-extrabold text-[#1E1E1E]">Set Up Your Resource Hub</h2>
                        <p className="text-[#8A919B] mt-2">Select your VTU scheme and branch to get personalized study materials.</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="text-sm font-bold text-[#1E1E1E] mb-3 block">1. Select VTU Scheme</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setSelectedScheme('2025')}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${selectedScheme === '2025' ? 'border-[#1E1E1E] bg-[#1E1E1E]/5' : 'border-[#DDE3EA] hover:border-[#8A919B]'}`}
                                >
                                    <div className="font-bold text-[#1E1E1E]">2025 Scheme</div>
                                    <div className="text-xs text-[#8A919B] mt-1">Latest NEP Curriculum</div>
                                </button>
                                <button
                                    onClick={() => setSelectedScheme('2022')}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${selectedScheme === '2022' ? 'border-[#1E1E1E] bg-[#1E1E1E]/5' : 'border-[#DDE3EA] hover:border-[#8A919B]'}`}
                                >
                                    <div className="font-bold text-[#1E1E1E]">2022 Scheme</div>
                                    <div className="text-xs text-[#8A919B] mt-1">Previous Curriculum</div>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-[#1E1E1E] mb-3 block">2. Select Your Branch</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {['CSE', 'ECE', 'ISE', 'ME', 'CE', 'AIML'].map(branch => (
                                    <button
                                        key={branch}
                                        onClick={() => setSelectedBranch(branch)}
                                        className={`p-3 rounded-xl border-2 text-center transition-all font-semibold ${selectedBranch === branch ? 'border-[#1E1E1E] bg-[#1E1E1E]/5 text-[#1E1E1E]' : 'border-[#DDE3EA] text-[#8A919B] hover:border-[#8A919B]'}`}
                                    >
                                        {branch}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={savePreferences}
                            className="w-full bg-[#1E1E1E] text-white font-bold py-4 rounded-xl hover:bg-[#333] transition-colors mt-4 flex items-center justify-center gap-2"
                        >
                            Continue to Resource Hub <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // View: Subject Details
    if (selectedSubject) {
        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                <button 
                    onClick={() => { setSelectedSubject(null); setSelectedModule(null); setResources([]); }}
                    className="flex items-center gap-2 text-[#8A919B] hover:text-[#1E1E1E] transition-colors font-semibold text-sm"
                >
                    <ArrowLeft size={16} /> Back to Semester {selectedSemester} Subjects
                </button>
                
                <div>
                    <h3 className="text-3xl font-extrabold text-[#1E1E1E] tracking-tight">{selectedSubject}</h3>
                    <p className="text-[#8A919B] text-sm mt-1">VTU 2025 Scheme • Semester {selectedSemester}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Sidebar: Modules & Categories */}
                    <div className="lg:col-span-1 space-y-2">
                        <div className="text-xs font-bold text-[#8A919B] uppercase tracking-wider mb-3">Modules</div>
                        {[1, 2, 3, 4, 5].map(mod => (
                            <button
                                key={mod}
                                onClick={() => setSelectedModule(mod)}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-colors font-semibold flex items-center justify-between ${
                                    selectedModule === mod 
                                        ? 'bg-[#1E1E1E] text-white shadow-md' 
                                        : 'bg-white border border-[#DDE3EA] text-[#1E1E1E] hover:bg-[#F4F6F8]'
                                }`}
                            >
                                <span>Module {mod}</span>
                                <LayoutGrid size={16} className={selectedModule === mod ? 'text-[#D4E4C8]' : 'text-[#8A919B]'} />
                            </button>
                        ))}
                        
                        <div className="text-xs font-bold text-[#8A919B] uppercase tracking-wider mt-6 mb-3">Other Materials</div>
                        <button
                            onClick={() => setSelectedModule('papers')}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-colors font-semibold flex items-center justify-between ${
                                selectedModule === 'papers' 
                                    ? 'bg-[#1E1E1E] text-white shadow-md' 
                                    : 'bg-white border border-[#DDE3EA] text-[#1E1E1E] hover:bg-[#F4F6F8]'
                            }`}
                        >
                            <span>Question Papers</span>
                            <FileQuestion size={16} className={selectedModule === 'papers' ? 'text-[#D4E4C8]' : 'text-[#8A919B]'} />
                        </button>
                        <button
                            onClick={() => setSelectedModule('syllabus')}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-colors font-semibold flex items-center justify-between ${
                                selectedModule === 'syllabus' 
                                    ? 'bg-[#1E1E1E] text-white shadow-md' 
                                    : 'bg-white border border-[#DDE3EA] text-[#1E1E1E] hover:bg-[#F4F6F8]'
                            }`}
                        >
                            <span>Syllabus PDF</span>
                            <Book size={16} className={selectedModule === 'syllabus' ? 'text-[#D4E4C8]' : 'text-[#8A919B]'} />
                        </button>
                        <button
                            onClick={() => setSelectedModule('library')}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-colors font-semibold flex items-center justify-between ${
                                selectedModule === 'library' 
                                    ? 'bg-[#1E1E1E] text-white shadow-md' 
                                    : 'bg-white border border-[#DDE3EA] text-[#1E1E1E] hover:bg-[#F4F6F8]'
                            }`}
                        >
                            <span>Virtual Library (Books)</span>
                            <BookOpen size={16} className={selectedModule === 'library' ? 'text-[#D4E4C8]' : 'text-[#8A919B]'} />
                        </button>
                    </div>

                    {/* Right Content: Resources List */}
                    <div className="lg:col-span-3">
                        {!selectedModule ? (
                            <div className="h-full min-h-[300px] border-2 border-dashed border-[#DDE3EA] rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-white/50">
                                <div className="w-16 h-16 bg-[#F4F6F8] rounded-2xl flex items-center justify-center mb-4 text-[#8A919B]">
                                    <BookOpen size={32} />
                                </div>
                                <h4 className="text-[#1E1E1E] font-bold text-lg">Select a Module</h4>
                                <p className="text-[#8A919B] text-sm mt-2 max-w-sm">Choose a module or material type from the left sidebar to view its resources, notes, and questions.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-[#DDE3EA] pb-4 mb-6">
                                    <h4 className="text-xl font-bold text-[#1E1E1E]">
                                        {typeof selectedModule === 'number' ? `Module ${selectedModule} Resources` : 
                                         selectedModule === 'papers' ? 'Previous & Model Question Papers' : 
                                         selectedModule === 'library' ? 'Virtual Library Books' : 'Syllabus Copies'}
                                    </h4>
                                    <span className="text-sm font-semibold px-3 py-1 bg-[#F4F6F8] rounded-lg text-[#8A919B]">
                                        {resources.length} items
                                    </span>
                                </div>

                                {loading ? (
                                    <div className="flex justify-center p-12">
                                        <div className="w-8 h-8 border-4 border-[#1E1E1E] border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : resources.length === 0 ? (
                                    <div className="text-center py-16 bg-white border border-[#DDE3EA] rounded-2xl">
                                        <p className="text-[#8A919B] font-medium">No resources found for this section yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {resources.map((resource) => (
                                            <div key={resource.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-[#DDE3EA] rounded-2xl hover:border-[#1E1E1E] hover:shadow-md transition-all group gap-4">
                                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#F4F6F8] group-hover:bg-[#D4E4C8] transition-colors">
                                                        {getIconForType(resource.type)}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h5 className="text-[#1E1E1E] font-bold text-base truncate">{resource.title}</h5>
                                                        <div className="flex items-center gap-2 text-[#8A919B] text-xs mt-1">
                                                            <span className="font-semibold bg-[#F4F6F8] px-2 py-0.5 rounded text-[#1E1E1E]">{resource.type || 'DOCUMENT'}</span>
                                                            <span>·</span>
                                                            <span>{formatSize(resource.fileSize)}</span>
                                                            <span>·</span>
                                                            <span>By {resource.uploadedBy}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0 sm:ml-4 w-full sm:w-auto">
                                                    <div className="flex items-center gap-1 bg-[#F4F6F8] border border-[#DDE3EA] rounded-xl px-2 py-1 shrink-0">
                                                        <button
                                                            onClick={() => handleVote(resource.id, 'upvote')}
                                                            className="hover:text-green-600 text-slate-400 p-1 transition-colors text-xs"
                                                            title="Helpful note"
                                                        >
                                                            👍
                                                        </button>
                                                        <span className="text-xs font-black text-[#1E1E1E] min-w-[16px] text-center">
                                                            {(resource.upvotes || 0) - (resource.downvotes || 0)}
                                                        </span>
                                                        <button
                                                            onClick={() => handleVote(resource.id, 'downvote')}
                                                            className="hover:text-red-600 text-slate-400 p-1 transition-colors text-xs"
                                                            title="Not helpful"
                                                        >
                                                            👎
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setPreviewUrl(getCorrectFileUrl(resource.fileUrl))
                                                            setPreviewTitle(resource.title)
                                                        }}
                                                        className="flex-1 sm:flex-initial justify-center bg-[#F4F6F8] text-[#1E1E1E] text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#1E1E1E] hover:text-white transition-colors flex items-center gap-2"
                                                    >
                                                        <Eye size={14} /> View
                                                    </button>
                                                    <a href={getCorrectFileUrl(resource.fileUrl)} target="_blank" rel="noreferrer" className="flex-1 sm:flex-initial justify-center bg-[#F4F6F8] text-[#1E1E1E] text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#1E1E1E] hover:text-white transition-colors flex items-center gap-2">
                                                        <Download size={14} /> Download
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* PDF Preview Modal */}
                {previewUrl && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-5xl w-full h-[85vh] flex flex-col animate-in zoom-in-95 duration-200">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-[#DDE3EA] bg-[#F4F6F8]">
                                <div>
                                    <h4 className="text-[#1E1E1E] font-black text-lg">{previewTitle}</h4>
                                    <p className="text-[#8A919B] text-xs font-semibold uppercase tracking-wider mt-0.5">Document Preview</p>
                                </div>
                                <button
                                    onClick={() => { setPreviewUrl(null); setPreviewTitle(''); }}
                                    className="w-10 h-10 rounded-full bg-white border border-[#DDE3EA] text-[#1E1E1E] hover:bg-[#1E1E1E] hover:text-white transition-colors flex items-center justify-center font-bold"
                                >
                                    ✕
                                </button>
                            </div>
                            
                            {/* Modal Content */}
                            <div className="flex-1 bg-slate-100 p-4">
                                {previewUrl.toLowerCase().endsWith('.pdf') || previewUrl.toLowerCase().includes('.pdf') ? (
                                    <iframe
                                        src={`${previewUrl}#toolbar=0`}
                                        className="w-full h-full rounded-2xl border border-[#DDE3EA] shadow-inner"
                                        title={previewTitle}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl">
                                        <FileText size={48} className="text-[#8A919B] mb-4" />
                                        <h5 className="font-bold text-lg text-[#1E1E1E]">Interactive Preview Unavailable</h5>
                                        <p className="text-sm text-[#8A919B] max-w-sm mt-2">
                                            This file format cannot be previewed in the browser. Please use the download option to view the contents.
                                        </p>
                                        <a
                                            href={previewUrl}
                                            download
                                            className="mt-6 px-6 py-3 bg-[#1E1E1E] hover:bg-[#333] text-white font-bold rounded-xl transition-all"
                                        >
                                            Download File
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // View: Main Hub (Semesters and Subjects)
    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <p className="text-[#8A919B] text-xs font-semibold uppercase tracking-[0.2em] mb-1">Study Materials</p>
                    <h3 className="text-3xl font-extrabold text-[#1E1E1E] tracking-tight">Resource Hub</h3>
                    <p className="text-[#8A919B] text-sm mt-1">VTU {selectedScheme} Scheme • {selectedBranch} • Semester-wise structure</p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A919B]" />
                        <input
                            type="text"
                            placeholder="Search subjects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-[#DDE3EA] text-[#1E1E1E] placeholder-[#B0B7BF] rounded-xl pl-11 pr-4 py-2.5 outline-none focus:border-[#1E1E1E] transition-colors text-sm font-medium"
                        />
                    </div>
                    <button 
                        onClick={() => setPreferencesSet(false)}
                        className="px-4 py-2.5 bg-white border border-[#DDE3EA] rounded-xl text-sm font-semibold text-[#8A919B] hover:text-[#1E1E1E] hover:border-[#1E1E1E] transition-all shrink-0"
                    >
                        Change Branch
                    </button>
                </div>
            </div>

            {/* Semester Tabs */}
            <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <button
                        key={s}
                        onClick={() => setSelectedSemester(String(s))}
                        className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            selectedSemester === String(s)
                                ? 'bg-[#1E1E1E] text-white shadow-md'
                                : 'bg-white text-[#8A919B] border border-[#DDE3EA] hover:border-[#1E1E1E] hover:text-[#1E1E1E]'
                        }`}
                    >
                        Semester {s}
                    </button>
                ))}
            </div>

            {/* Subject Grid */}
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <Sparkles size={18} className="text-[#1E1E1E]" />
                    <h4 className="text-[#1E1E1E] font-extrabold text-lg">Subjects for Semester {selectedSemester}</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredSubjects.length > 0 ? filteredSubjects.map((subjectName, idx) => (
                        <div key={idx} className="bg-white border border-[#DDE3EA] rounded-2xl p-6 hover:shadow-lg hover:border-[#1E1E1E] transition-all group flex flex-col">
                            <div className="flex items-start justify-between mb-6">
                                <div className="pr-4">
                                    <h5 className="text-[#1E1E1E] font-extrabold text-lg leading-snug line-clamp-2">{subjectName}</h5>
                                    <p className="text-[#B0B7BF] text-xs font-semibold mt-1 uppercase tracking-wider">{VTU_SCHEME_2025[parseInt(selectedSemester) as keyof typeof VTU_SCHEME_2025]?.cycle}</p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-[#F4F6F8] group-hover:bg-[#1E1E1E] transition-colors">
                                    <BookOpen size={20} className="text-[#1E1E1E] group-hover:text-white transition-colors" />
                                </div>
                            </div>

                            <div className="mt-auto">
                                <button 
                                    onClick={() => setSelectedSubject(subjectName)}
                                    className="w-full flex items-center justify-between py-3 px-4 rounded-xl text-sm font-bold transition-all bg-[#F4F6F8] text-[#1E1E1E] group-hover:bg-[#D4E4C8]"
                                >
                                    Explore Modules <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-12 text-center bg-white border border-[#DDE3EA] rounded-2xl">
                            <p className="text-[#8A919B] font-semibold text-lg">No subjects found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
