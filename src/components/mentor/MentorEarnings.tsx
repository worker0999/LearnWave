'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { DollarSign, Star, Calendar, Clock, RefreshCw, Loader2, ArrowUpRight } from 'lucide-react'
import { format } from 'date-fns'

interface EarningData {
  date: string
  amount: number
}

interface Transaction {
  id: string
  date: string
  student: string
  sessionType: string
  amount: number
  status: 'completed' | 'pending' | 'failed' | 'confirmed' | 'cancelled'
}

export function MentorEarnings() {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
  const [earningsData, setEarningsData] = useState<EarningData[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingPayments: 0,
    completedSessions: 0,
    averageRating: 4.5,
  })

  const fetchEarnings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/mentor/earnings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setTransactions(data.transactions || [])
        setEarningsData(data.earningsData || [])
      }
    } catch (error) {
      console.error('Error fetching earnings:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEarnings()
  }, [])

  const filteredEarnings = useMemo(() => {
    const [start, end] = dateRange
    if (!start && !end) return earningsData
    return earningsData.filter((d) => {
      const dt = new Date(d.date)
      if (start && dt < new Date(start.getFullYear(), start.getMonth(), start.getDate())) return false
      if (end && dt > new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59)) return false
      return true
    })
  }, [earningsData, dateRange])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-[#5C59E8] animate-spin mb-4" />
        <p className="text-[#335765] text-xl font-bold tracking-tight">Syncing financial dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 md:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1E1B4B] tracking-tight">Earnings & FinTech Overview</h1>
          <p className="text-[#8E93B0] font-medium mt-1">Track income logs, student payments, and aggregate billing performance.</p>
        </div>
        <Button
          variant="outline"
          className="border-[#DDE3EA] hover:bg-white/80 text-[#1E1B4B] font-bold rounded-xl px-5"
          onClick={fetchEarnings}
        >
          <RefreshCw className="mr-2 h-4 w-4 text-[#8E93B0]" /> Refresh Ledger
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `$${stats.totalEarnings}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Pending Collections', value: `$${stats.pendingPayments}`, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Completed Bookings', value: stats.completedSessions, icon: Calendar, color: 'text-[#5C59E8]', bg: 'bg-[#5C59E8]/5' },
          { label: 'Average Evaluation', value: stats.averageRating, icon: Star, color: 'text-indigo-500', bg: 'bg-indigo-50' },
        ].map((item, i) => (
          <Card key={i} className="bg-white border-[#DDE3EA] shadow-sm rounded-2xl overflow-hidden border">
            <CardHeader className="bg-slate-50/50 border-b border-[#F4F6F8] pb-4 p-5 flex flex-row items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#8E93B0]">{item.label}</span>
              <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                <item.icon size={16} />
              </div>
            </CardHeader>
            <CardContent className="pt-6 px-5 pb-5">
              <div className="text-3xl font-black text-[#1E1B4B] tracking-tight">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Time-Series Line Chart */}
      <Card className="bg-white border-[#DDE3EA] shadow-sm rounded-2xl overflow-hidden border">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between bg-slate-50/50 border-b border-[#F4F6F8] p-6">
          <div>
            <CardTitle className="text-lg font-black text-[#1E1B4B]">Earnings Analytics</CardTitle>
            <p className="text-xs text-[#8E93B0]">Consolidated line analytics of payout distribution</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Label className="text-[#1E1B4B] font-bold text-xs">Filter Range</Label>
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[280px]">
            {filteredEarnings.length === 0 ? (
              <div className="flex items-center justify-center h-full text-[#8E93B0] font-bold text-sm">
                No financial history found within the selected scope.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredEarnings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => format(new Date(date), 'MMM d')}
                    stroke="#8E93B0"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 'bold' }}
                    dy={10}
                  />
                  <YAxis
                    stroke="#8E93B0"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 'bold' }}
                    dx={-10}
                  />
                  <Tooltip
                    formatter={(value) => [`$${value}`, 'Revenue']}
                    labelFormatter={(label) => format(new Date(label), 'MMMM d, yyyy')}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#5C59E8"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#5C59E8', strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#E11D48' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ledger Table */}
      <Card className="bg-white border-[#DDE3EA] shadow-sm rounded-2xl overflow-hidden border">
        <CardHeader className="bg-slate-50/50 border-b border-[#F4F6F8] p-6">
          <CardTitle className="text-lg font-black text-[#1E1B4B]">Recent Settlement Ledger</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#CBD5E1] bg-slate-50/50">
                  <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-[#8E93B0]">Date</TableHead>
                  <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-[#8E93B0]">Student Recipient</TableHead>
                  <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-[#8E93B0]">Session Descriptor</TableHead>
                  <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-[#8E93B0]">Price</TableHead>
                  <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-[#8E93B0] text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-[#8E93B0] font-semibold text-sm">
                      No financial logs compiled yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-[#F1F5F9] last:border-0 hover:bg-slate-50/30 transition-colors">
                      <td className="py-4 px-6 font-bold text-[#1E1B4B] text-sm">
                        {format(new Date(transaction.date), 'MMM d, yyyy')}
                      </td>
                      <td className="py-4 px-6 text-[#1E1B4B] font-semibold text-sm">{transaction.student}</td>
                      <td className="py-4 px-6 text-[#8E93B0] text-xs font-medium">{transaction.sessionType}</td>
                      <td className="py-4 px-6 font-black text-[#1E1B4B] text-sm">${transaction.amount}</td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                            transaction.status === 'completed' || transaction.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : transaction.status === 'pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-50 text-red-600'
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
