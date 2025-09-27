import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { Dashboard } from "./components/Dashboard";
import { ProfileSetup } from "./components/ProfileSetup";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Authenticated>
        <AuthenticatedApp />
      </Authenticated>
      <Unauthenticated>
        <UnauthenticatedApp />
      </Unauthenticated>
      <Toaster theme="dark" />
    </div>
  );
}

function AuthenticatedApp() {
  const studentStats = useQuery(api.students.getStudentStats);

  if (studentStats === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!studentStats?.student) {
    return <ProfileSetup />;
  }

  return <Dashboard student={studentStats.student} stats={studentStats} />;
}

function UnauthenticatedApp() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">VTU</span>
              </div>
              <h1 className="text-xl font-semibold text-slate-100">Student Helper</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-xl">VTU</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-100 mb-2">VTU Student Helper</h1>
            <p className="text-slate-400">Your academic companion for study materials, results, and career guidance</p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 p-6">
            <SignInForm />
          </div>

          {/* Features Preview */}
          <div className="mt-8 grid grid-cols-2 gap-4 text-center">
            <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-800">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-400 text-sm">📚</span>
              </div>
              <h3 className="text-sm font-medium text-slate-200">Study Materials</h3>
              <p className="text-xs text-slate-500 mt-1">Notes, papers & resources</p>
            </div>
            <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-800">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-green-400 text-sm">📊</span>
              </div>
              <h3 className="text-sm font-medium text-slate-200">Results Tracking</h3>
              <p className="text-xs text-slate-500 mt-1">SGPA & CGPA analysis</p>
            </div>
            <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-800">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-400 text-sm">🤖</span>
              </div>
              <h3 className="text-sm font-medium text-slate-200">AI Assistant</h3>
              <p className="text-xs text-slate-500 mt-1">Academic help & guidance</p>
            </div>
            <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-800">
              <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-orange-400 text-sm">💼</span>
              </div>
              <h3 className="text-sm font-medium text-slate-200">Placements</h3>
              <p className="text-xs text-slate-500 mt-1">Job opportunities & prep</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
