import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, TrendingUp, Users, RefreshCw, Calendar, Download } from 'lucide-react'

export function AnalyticsView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-[#42413b] dark:text-[#f4f4f0] tracking-tight">Analytics & Reports</h1>
          <p className="text-[#a9a29e] mt-1 text-lg">In-depth platform statistics and growth metrics</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="border-[#dfd3c3] dark:border-[#42413b] text-[#42413b] dark:text-[#f4f4f0] bg-transparent hover:bg-[#f4f4f0] dark:hover:bg-[#1c1b19]"
          >
            <Download className="w-4 h-4 mr-2" /> Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] shadow-sm rounded-2xl lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#a9a29e]">Monthly Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#42413b] dark:text-[#f4f4f0]">4,289</div>
            <p className="text-sm text-emerald-500 mt-2 flex items-center gap-1">
              <TrendingUp size={14} /> +18.2% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] shadow-sm rounded-2xl lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#a9a29e]">Avg. Session Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#42413b] dark:text-[#f4f4f0]">45m</div>
            <p className="text-sm text-[#a9a29e] mt-2 flex items-center gap-1">
              Based on completed sessions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] shadow-sm rounded-2xl lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#a9a29e]">Growth Overview</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="h-24 flex items-end justify-between gap-2 pt-4">
               {[40, 55, 45, 70, 65, 80, 95].map((val, i) => (
                 <div key={i} className="w-full bg-[#c8ced8] dark:bg-[#42413b] rounded-t-sm" style={{ height: `${val}%` }}></div>
               ))}
             </div>
             <div className="flex justify-between text-xs text-[#a9a29e] mt-2 uppercase tracking-wider font-semibold">
               <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] shadow-sm rounded-2xl">
          <CardHeader className="border-b border-[#dfd3c3]/50 dark:border-[#42413b]/50 pb-4">
            <CardTitle className="text-lg text-[#42413b] dark:text-[#f4f4f0]">Top Mentors by Revenue</CardTitle>
            <CardDescription className="text-[#a9a29e]">Highest earning mentors this month</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {[
              { name: 'Dr. Jane Doe', amount: '₹12,400', progress: 85 },
              { name: 'Prof. Smith', amount: '₹8,200', progress: 60 },
              { name: 'Dr. Alan Turing', amount: '₹5,100', progress: 40 },
            ].map((m, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-[#42413b] dark:text-[#f4f4f0]">{m.name}</span>
                  <span className="text-[#a9a29e]">{m.amount}</span>
                </div>
                <div className="h-2 w-full bg-[#f4f4f0] dark:bg-[#1c1b19] rounded-full overflow-hidden">
                  <div className="h-full bg-[#42413b] dark:bg-[#f4f4f0]" style={{ width: `${m.progress}%` }}></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-[#ffffff] dark:bg-[#2a2826] border-[#dfd3c3] dark:border-[#42413b] shadow-sm rounded-2xl">
          <CardHeader className="border-b border-[#dfd3c3]/50 dark:border-[#42413b]/50 pb-4">
            <CardTitle className="text-lg text-[#42413b] dark:text-[#f4f4f0]">Resource Engagement</CardTitle>
            <CardDescription className="text-[#a9a29e]">Most downloaded materials</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {[
              { name: 'Data Structures Notes', downloads: 342, category: 'Computer Science' },
              { name: 'React Hooks Cheat Sheet', downloads: 215, category: 'Web Development' },
              { name: 'System Design Prep', downloads: 189, category: 'Computer Science' },
            ].map((r, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-[#f4f4f0] dark:bg-[#1c1b19] rounded-xl border border-[#dfd3c3] dark:border-[#42413b]">
                <div>
                  <p className="text-sm font-medium text-[#42413b] dark:text-[#f4f4f0]">{r.name}</p>
                  <p className="text-xs text-[#a9a29e]">{r.category}</p>
                </div>
                <div className="text-sm font-semibold text-[#42413b] dark:text-[#f4f4f0]">
                  {r.downloads} <span className="text-xs font-normal text-[#a9a29e]">DLs</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
