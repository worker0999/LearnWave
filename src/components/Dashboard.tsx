import { useState } from "react";
import { SignOutButton } from "../SignOutButton";
import { StudyMaterials } from "./StudyMaterials";
import { Results } from "./Results";
import { ChatInterface } from "./ChatInterface";
import { Placements } from "./Placements";

type Tab = "dashboard" | "materials" | "results" | "chat" | "placements";

interface DashboardProps {
  student: any;
  stats: any;
}

export function Dashboard({ student, stats }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  const tabs = [
    { id: "dashboard" as Tab, name: "Dashboard", icon: "🏠" },
    { id: "materials" as Tab, name: "Study Hub", icon: "📚" },
    { id: "results" as Tab, name: "Results", icon: "📊" },
    { id: "chat" as Tab, name: "AI Assistant", icon: "🤖" },
    { id: "placements" as Tab, name: "Placements", icon: "💼" },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">VTU</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-100">VTU Student Helper</h1>
                <p className="text-xs text-slate-400">{student.name} • {student.usn}</p>
              </div>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-slate-900/30 border-r border-slate-800 min-h-[calc(100vh-4rem)] p-4">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "text-slate-300 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Student Info Card */}
          <div className="mt-8 bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h3 className="text-sm font-medium text-slate-200 mb-3">Quick Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Branch:</span>
                <span className="text-slate-200">{student.branch.split(' ').map((word: string) => word[0]).join('')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Semester:</span>
                <span className="text-slate-200">{student.semester}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Materials:</span>
                <span className="text-slate-200">{stats.materialsCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Results:</span>
                <span className="text-slate-200">{stats.resultsCount}</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "dashboard" && <DashboardHome student={student} stats={stats} />}
          {activeTab === "materials" && <StudyMaterials student={student} />}
          {activeTab === "results" && <Results student={student} />}
          {activeTab === "chat" && <ChatInterface />}
          {activeTab === "placements" && <Placements student={student} />}
        </main>
      </div>
    </div>
  );
}

function DashboardHome({ student, stats }: { student: any; stats: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 mb-2">
          Welcome back, {student.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-slate-400">Here's your academic overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Current Semester</p>
              <p className="text-2xl font-bold text-slate-100">{student.semester}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-blue-400 text-xl">📚</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Study Materials</p>
              <p className="text-2xl font-bold text-slate-100">{stats.materialsCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <span className="text-green-400 text-xl">📄</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Results Recorded</p>
              <p className="text-2xl font-bold text-slate-100">{stats.resultsCount}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <span className="text-purple-400 text-xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">CGPA</p>
              <p className="text-2xl font-bold text-slate-100">{student.cgpa || "N/A"}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <span className="text-orange-400 text-xl">🎯</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
            <span className="text-2xl">📚</span>
            <div className="text-left">
              <p className="font-medium text-slate-200">Browse Materials</p>
              <p className="text-sm text-slate-400">Find notes and papers</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
            <span className="text-2xl">📊</span>
            <div className="text-left">
              <p className="font-medium text-slate-200">Add Results</p>
              <p className="text-sm text-slate-400">Update your grades</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
            <span className="text-2xl">🤖</span>
            <div className="text-left">
              <p className="font-medium text-slate-200">Ask AI</p>
              <p className="text-sm text-slate-400">Get academic help</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Student Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">USN:</span>
              <span className="text-slate-200 font-mono">{student.usn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Branch:</span>
              <span className="text-slate-200">{student.branch}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Batch:</span>
              <span className="text-slate-200">{student.batch}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Current Semester:</span>
              <span className="text-slate-200">{student.semester}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">CGPA:</span>
              <span className="text-slate-200">{student.cgpa || "Not calculated"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
