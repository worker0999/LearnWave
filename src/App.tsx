import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { WelcomeCard } from './components/WelcomeCard';
import { CourseGrid } from './components/CourseGrid';
import { AIAssistant } from './components/AIAssistant';
import { Announcements } from './components/Announcements';
import { Circulars } from './components/Circulars';
import { ResourceHub } from './pages/ResourceHub';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavClick = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF9]">
      <Sidebar
        onNavClick={handleNavClick}
        expanded={true}
        onToggle={() => {}}
        currentPage={currentPage}
      />
      <main className="flex-1 p-8 transition-all duration-300 w-full pb-32">
        {currentPage === 'home' && (
          <div className="max-w-7xl mx-auto space-y-8">
            <WelcomeCard />
            <CourseGrid />
            <AIAssistant />
            <Announcements />
            <Circulars />
          </div>
        )}
        {currentPage === 'resource-hub' && <div className="max-w-7xl mx-auto"><ResourceHub /></div>}
        {currentPage === 'ai-assistant' && <div className="max-w-7xl mx-auto"><AIAssistant /></div>}
        {currentPage === 'announcements' && <div className="max-w-7xl mx-auto"><Announcements /></div>}
        {currentPage === 'circulars' && <div className="max-w-7xl mx-auto"><Circulars /></div>}
      </main>
    </div>
  );
}