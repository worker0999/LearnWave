'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useAuth } from '@/contexts/AuthContext'
import { Trophy, Medal, Crown, TrendingUp, Users, MapPin } from 'lucide-react'

export default function LeaderboardPage() {
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState('global')
  const [selectedSemester, setSelectedSemester] = useState<string>('all')

  useEffect(() => {
    fetchLeaderboard()
  }, [type, selectedSemester, user])

  const fetchLeaderboard = async () => {
    setLoading(true)
    try {
      let url = `/api/gamification/leaderboard?type=${type}`
      if (type === 'branch' && user?.branch) {
        url += `&branch=${encodeURIComponent(user.branch)}`
      }
      if (selectedSemester !== 'all') {
        url += `&semester=${selectedSemester}`
      }
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setLeaderboard(data.leaderboard)
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-8 h-8 text-yellow-400" />
      case 2: return <Medal className="w-8 h-8 text-slate-300" />
      case 3: return <Medal className="w-8 h-8 text-amber-600" />
      default: return <span className="text-xl font-bold text-slate-500 w-8 text-center">{rank}</span>
    }
  }

  return (
    <DashboardLayout userRole="STUDENT">
      <div className="p-6 max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Hall of Fame</h1>
          <p className="text-cyan-200">The top scholars of LearnWave community</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Tabs value={type} onValueChange={setType} className="w-full max-w-md">
            <TabsList className="grid grid-cols-3 bg-slate-900/50 border border-white/10">
              <TabsTrigger value="global" className="data-[state=active]:bg-cyan-500">Global</TabsTrigger>
              <TabsTrigger value="monthly" className="data-[state=active]:bg-cyan-500">Monthly</TabsTrigger>
              <TabsTrigger value="branch" className="data-[state=active]:bg-cyan-500">Branch</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2 bg-slate-900/50 border border-white/10 px-3 py-1.5 rounded-xl">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Semester:</span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="bg-transparent text-white text-sm font-bold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#13131a]">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem.toString()} className="bg-[#13131a]">
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Top 3 Podium */}
        {!loading && leaderboard.length >= 3 && type === 'global' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pb-8">
            {/* 2nd Place */}
            <div className="order-2 md:order-1">
              <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-6 text-center space-y-4 pt-12 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-2 bg-slate-300" />
                <Avatar className="w-20 h-20 mx-auto border-4 border-slate-300 shadow-xl shadow-slate-300/10">
                  <AvatarImage src={leaderboard[1].avatar} />
                  <AvatarFallback>{leaderboard[1].name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold text-white text-lg">{leaderboard[1].name}</div>
                  <div className="text-cyan-400 font-medium">{leaderboard[1].xp} XP</div>
                </div>
                <div className="flex justify-center">{getRankIcon(2)}</div>
              </div>
            </div>

            {/* 1st Place */}
            <div className="order-1 md:order-2 scale-110">
              <div className="bg-gradient-to-b from-blue-900/60 to-slate-900/60 border-2 border-yellow-500/50 rounded-3xl p-8 text-center space-y-4 pt-16 relative overflow-hidden shadow-2xl shadow-yellow-500/10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-3 bg-yellow-500" />
                <div className="absolute top-4 right-4 animate-pulse">
                  <Crown className="text-yellow-400 w-6 h-6" />
                </div>
                <Avatar className="w-28 h-28 mx-auto border-4 border-yellow-500 shadow-2xl shadow-yellow-500/20">
                  <AvatarImage src={leaderboard[0].avatar} />
                  <AvatarFallback>{leaderboard[0].name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-black text-white text-2xl">{leaderboard[0].name}</div>
                  <div className="text-yellow-400 font-bold text-lg">{leaderboard[0].xp} XP</div>
                </div>
                <Badge className="bg-yellow-500 text-white border-none px-4 py-1">ULTIMATE SCHOLAR</Badge>
                <div className="flex justify-center">{getRankIcon(1)}</div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="order-3">
              <div className="bg-slate-900/40 border border-white/10 rounded-3xl p-6 text-center space-y-4 pt-12 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-2 bg-amber-600" />
                <Avatar className="w-20 h-20 mx-auto border-4 border-amber-600 shadow-xl shadow-amber-600/10">
                  <AvatarImage src={leaderboard[2].avatar} />
                  <AvatarFallback>{leaderboard[2].name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold text-white text-lg">{leaderboard[2].name}</div>
                  <div className="text-cyan-400 font-medium">{leaderboard[2].xp} XP</div>
                </div>
                <div className="flex justify-center">{getRankIcon(3)}</div>
              </div>
            </div>
          </div>
        )}

        {/* List of Other Ranks */}
        <Card className="bg-slate-900/50 border-white/10 overflow-hidden">
          <CardHeader className="border-b border-white/5 bg-white/5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-lg flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-cyan-400" />
                Rankings
              </CardTitle>
              <div className="text-sm text-slate-400 flex items-center gap-4">
                <span className="flex items-center"><Users className="w-4 h-4 mr-1" /> {leaderboard.length} Scholars</span>
                {type === 'branch' && <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {user?.branch || 'General'}</span>}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center text-slate-400 animate-pulse">Updating rankings...</div>
            ) : leaderboard.length > 0 ? (
              <div className="divide-y divide-white/5">
                {leaderboard.map((entry, index) => (
                  <div key={entry.userId} className={`flex items-center gap-4 p-4 hover:bg-white/5 transition-colors ${index < 3 && type === 'global' ? 'hidden md:flex' : ''}`}>
                    <div className="w-12 flex justify-center">
                      {getRankIcon(entry.rank)}
                    </div>
                    <Avatar className="w-10 h-10 border border-white/10">
                      <AvatarImage src={entry.avatar} />
                      <AvatarFallback>{entry.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-bold text-white">{entry.name}</div>
                      <div className="text-xs text-slate-400 uppercase tracking-wider">{entry.branch || 'General'} Scholar</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-cyan-400">{entry.xp} XP</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">LEVEL {entry.level || 1}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500">No entries yet for this category.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
