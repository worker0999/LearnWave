import React from 'react';

interface CourseCardProps {
  title: string;
  subtitle: string;
  progress: number;
  icon: React.ReactNode;
  iconBg: string;
}

export function CourseCard({ title, subtitle, progress, icon, iconBg }: CourseCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-[#6B5844]"
        style={{ backgroundColor: iconBg }}
      >
        {icon}
      </div>
      
      <h4 className="text-lg text-[#4A3F33] mb-1">{title}</h4>
      <p className="text-sm text-[#9B8B7E] mb-4">{subtitle}</p>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#6B5844]">Progress</span>
          <span className="text-[#4A3F33]">{progress}%</span>
        </div>
        <div className="h-2 bg-[#F5F0EA] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#A68968] rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
