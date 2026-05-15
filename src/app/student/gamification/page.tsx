'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Award, 
  Flame, 
  Trophy, 
  Star, 
  Zap, 
  ChevronRight, 
  Target, 
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpCircle
} from 'lucide-react'
import Link from 'next/link'

export default function GamificationDashboard() {
  const { token } = useAuth()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [missions, setMissions] = useState<any[]>([])

  useEffect(() => {
    if (token) {
      fetchData()
    }
  }, [token])

  const fetchData = async () => {
    try {
      const [progressRes, missionsRes] = await Promise.all([
        fetch('/api/gamification/progress', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/gamification/missions', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      if (progressRes.ok) {
        const progressData = await progressRes.json()
        setData(progressData)
      }

      if (missionsRes.ok) {
        const missionsData = await missionsRes.json()
        setMissions(missionsData.missions)
      }
    } catch (error) {
      console.error('Failed to fetch gamification data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout userRole="STUDENT">
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl animate-pulse">Loading your progress...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="STUDENT">
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Header / Level Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-8 text-white border border-white/10 shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Award size={200} />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            {/* Level Hexagon */}
            <div className="relative flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-2xl rotate-45 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <div className="-rotate-45 text-center">
                  <div className="text-sm font-medium uppercase tracking-wider opacity-80">Level</div>
                  <div className="text-5xl font-black">{data?.progress?.level || 1}</div>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4 w-full text-center md:text-left">
              <div>
                <h1 className="text-3xl font-bold mb-1">Scholar Progress</h1>
                <p className="text-cyan-200">Keep learning to unlock rare avatars and badges!</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{data?.progress?.xp || 0} XP</span>
                  <span className="text-cyan-200">{data?.progress?.nextLevelXp || 100} XP for Level {(data?.progress?.level || 1) + 1}</span>
                </div>
                <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(34,211,238,0.5)]" 
                    style={{ width: `${data?.progress?.levelProgress || 0}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Card className="bg-white/10 backdrop-blur-md border-white/10 p-4 text-center min-w-[120px]">
                <Flame className="w-8 h-8 text-orange-400 mx-auto mb-1 animate-bounce" />
                <div className="text-2xl font-bold">{data?.streak?.current || 0}</div>
                <div className="text-xs text-cyan-200 uppercase tracking-tighter">Day Streak</div>
              </Card>
              <Card className="bg-white/10 backdrop-blur-md border-white/10 p-4 text-center min-w-[120px]">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-1" />
                <div className="text-2xl font-bold">#{data?.rank || 'N/A'}</div>
                <div className="text-xs text-cyan-200 uppercase tracking-tighter">Global Rank</div>
              </Card>
            </div>
          </div>
        </div>

        {/* Missions and Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Daily Missions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Target className="w-6 h-6 mr-2 text-cyan-400" />
                Active Missions
              </h2>
              <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">
                Resets in 12h 45m
              </Badge>
            </div>

            <div className="grid gap-4">
              {missions.map((mission) => (
                <Card key={mission.id} className="bg-slate-900/50 border-white/10 hover:border-cyan-500/30 transition-colors group">
                  <CardContent className="p-6 flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${mission.isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {mission.isCompleted ? <CheckCircle2 /> : <Zap />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold group-hover:text-cyan-400 transition-colors">{mission.title}</h3>
                      <p className="text-sm text-slate-400">{mission.description}</p>
                      <div className="mt-3 flex items-center gap-4">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${mission.isCompleted ? 'bg-green-500' : 'bg-cyan-500'}`} 
                            style={{ width: `${Math.min(100, (mission.currentValue / mission.target_value) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          {mission.currentValue}/{mission.target_value}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-cyan-400 font-bold">+{mission.xp_reward} XP</div>
                      {mission.isCompleted && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px] py-0">CLAIMED</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar Stats / Rewards Snippet */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Award className="w-6 h-6 mr-2 text-yellow-400" />
              Achievements
            </h2>
            
            <Card className="bg-slate-900/50 border-white/10 p-6 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="aspect-square rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group cursor-help transition-all hover:scale-110 hover:border-yellow-500/50">
                    <Star className="w-6 h-6 text-yellow-500/50 group-hover:text-yellow-500" />
                  </div>
                ))}
              </div>
              <Button asChild className="w-full bg-white/5 hover:bg-white/10 border-white/10 text-white">
                <Link href="/student/achievements" className="flex items-center justify-center">
                  View All Achievements
                  <ChevronRight className="ml-1 w-4 h-4" />
                </Link>
              </Button>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border-indigo-500/20 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
                  <ShieldCheck />
                </div>
                <div>
                  <h3 className="text-white font-bold">Avatar Shop</h3>
                  <p className="text-xs text-indigo-200">Use your XP to unlock rare items</p>
                </div>
              </div>
              <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">
                <Link href="/student/avatars">Explore Store</Link>
              </Button>
            </Card>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="bg-white/5 border-white/10 p-6 flex items-center gap-4">
              <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400">
                <ArrowUpCircle />
              </div>
              <div>
                <div className="text-sm text-slate-400 font-medium">Weekly Rank Up</div>
                <div className="text-white font-bold font-mono">+12 Positions</div>
              </div>
           </Card>
           <Card className="bg-white/5 border-white/10 p-6 flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
                <Clock />
              </div>
              <div>
                <div className="text-sm text-slate-400 font-medium">Study Streak Bonus</div>
                <div className="text-white font-bold font-mono">1.2x Multiplier</div>
              </div>
           </Card>
           <Card className="bg-white/5 border-white/10 p-6 flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                <Zap />
              </div>
              <div>
                <div className="text-sm text-slate-400 font-medium">Total XP Earned</div>
                <div className="text-white font-bold font-mono">{data?.progress?.totalXpEarned || 0} XP</div>
              </div>
           </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
