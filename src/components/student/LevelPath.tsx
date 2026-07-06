'use client';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LEVEL_REWARDS } from '@/lib/level-rewards';
import { Lock, Unlock, Trophy, ArrowLeft, Star, Award } from 'lucide-react';

export function LevelPath() {
    const { user } = useAuth();
    const currentLevel = user?.level || 1;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-16 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => { window.location.search = '?page=profile'; }}
                    className="p-2.5 bg-white border border-[#DDE3EA] hover:bg-[#F4F6F8] rounded-xl text-[#1E1E1E] transition-colors shadow-sm"
                >
                    <ArrowLeft size={16} />
                </button>
                <div>
                    <p className="text-[#8A919B] text-xs font-semibold uppercase tracking-[0.2em] mb-1">Roadmap</p>
                    <h3 className="text-2xl font-extrabold text-[#1E1E1E] tracking-tight">Level & Reward Path</h3>
                    <p className="text-[#8A919B] text-sm mt-1">Track your progress and discover what customizations you unlock at each milestone</p>
                </div>
            </div>

            {/* Current Level Banner */}
            <div className="bg-gradient-to-r from-[#1E1E1E] to-[#333] text-white p-8 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                <div>
                    <div className="flex items-center gap-2">
                        <Trophy size={18} className="text-yellow-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Your Standing</span>
                    </div>
                    <h4 className="text-2xl font-black mt-2">Level {currentLevel} Scholar</h4>
                    <p className="text-xs text-slate-400 mt-1">Currently equipped title: <strong className="text-cyan-400">{user?.equippedTitle || 'Newcomer'}</strong></p>
                </div>
                <div className="bg-white/10 px-6 py-4 rounded-2xl text-center shrink-0 border border-white/10 min-w-[120px]">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Total XP</p>
                    <p className="text-2xl font-black text-cyan-400 mt-0.5">{user?.xp || 0}</p>
                </div>
            </div>

            {/* Vertical Timeline Roadmap */}
            <div className="relative border-l-2 border-[#DDE3EA] ml-6 pl-10 space-y-12 py-4">
                {LEVEL_REWARDS.map((reward, idx) => {
                    const isUnlocked = currentLevel >= reward.level;
                    const isCurrent = currentLevel === reward.level;

                    return (
                        <div key={reward.level} className="relative group">
                            {/* Marker Icon */}
                            <div className={`absolute -left-[57px] top-1.5 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                                isUnlocked 
                                    ? isCurrent
                                        ? 'bg-cyan-500 border-white text-white scale-110 shadow-lg'
                                        : 'bg-[#1E1E1E] border-white text-white'
                                    : 'bg-[#F4F6F8] border-[#DDE3EA] text-[#8A919B]'
                            }`}>
                                {isUnlocked ? <Unlock size={12} /> : <Lock size={12} />}
                            </div>

                            {/* Details Panel */}
                            <div className={`bg-white border p-6 rounded-[2rem] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:border-[#1E1E1E] ${
                                isCurrent ? 'ring-2 ring-cyan-500 border-transparent shadow-md' : 'border-[#DDE3EA]'
                            }`}>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider ${
                                            isUnlocked ? 'bg-cyan-50 text-cyan-600' : 'bg-slate-100 text-[#8A919B]'
                                        }`}>
                                            Level {reward.level} Milestone
                                        </span>
                                        {isCurrent && (
                                            <span className="text-[9px] font-black bg-cyan-500 text-white px-2 py-0.5 rounded-full uppercase animate-pulse">
                                                Current
                                            </span>
                                        )}
                                    </div>
                                    <h5 className="font-extrabold text-[#1E1E1E] text-base leading-tight">
                                        {reward.title}
                                    </h5>
                                    {reward.bonusMessage && (
                                        <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                                            <Star size={12} className="fill-emerald-100" />
                                            {reward.bonusMessage}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-[#F4F6F8] text-xs">
                                    {reward.frameKey && (
                                        <div className="flex items-center gap-1.5 bg-[#F4F6F8] px-3.5 py-2 rounded-xl text-[#1E1E1E] font-extrabold">
                                            <Award size={14} className="text-cyan-500" />
                                            <span>{reward.frameKey.replace('-', ' ')}</span>
                                        </div>
                                    )}
                                    {!isUnlocked && (
                                        <span className="text-[#8A919B] font-bold">Locked</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
