'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Table } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { DateRangePicker } from '@/components/ui/date-range-picker'

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
  status: 'completed' | 'pending' | 'failed'
}

export function MentorEarnings() {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
  const [earningsData, setEarningsData] = useState<EarningData[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingPayments: 0,
    completedSessions: 0,
    averageRating: 0,
  })

  useEffect(() => {
    // Mock data - replace with actual API calls later
    setEarningsData([
      { date: '2023-11-01', amount: 150 },
      { date: '2023-11-02', amount: 200 },
      { date: '2023-11-03', amount: 175 },
      { date: '2023-11-04', amount: 225 },
      { date: '2023-11-05', amount: 300 },
      { date: '2023-11-06', amount: 250 },
      { date: '2023-11-07', amount: 275 },
    ])

    setTransactions([
      {
        id: '1',
        date: '2023-11-07',
        student: 'John Doe',
        sessionType: '1-on-1 Session',
        amount: 50,
        status: 'completed',
      },
      {
        id: '2',
        date: '2023-11-06',
        student: 'Jane Smith',
        sessionType: 'Group Session',
        amount: 75,
        status: 'pending',
      },
    ])

    setStats({
      totalEarnings: 1575,
      pendingPayments: 75,
      completedSessions: 12,
      averageRating: 4.8,
    })
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

  useEffect(() => {
    const total = filteredEarnings.reduce((s, r) => s + r.amount, 0)
    setStats((prev) => ({ ...prev, totalEarnings: total }))
  }, [filteredEarnings])

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black text-[#335765] tracking-tight">Earnings Overview</h1>
        <p className="text-[#74A8A4] font-medium mt-1">Track income, payments, and performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Earnings', value: `$${stats.totalEarnings}` },
          { label: 'Pending Payments', value: `$${stats.pendingPayments}` },
          { label: 'Completed Sessions', value: stats.completedSessions },
          { label: 'Average Rating', value: stats.averageRating },
        ].map((item, i) => (
          <Card key={i} className="bg-white border-[#B6D9E0] shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-[#DBE2DC]/30 border-b border-[#B6D9E0] pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-[#74A8A4]">{item.label}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-black text-[#335765]">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Earnings Chart */}
      <Card className="bg-white border-[#B6D9E0] shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between bg-[#DBE2DC]/30 border-b border-[#B6D9E0]">
          <CardTitle className="text-xl font-bold text-[#335765]">Earnings Chart</CardTitle>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Label className="text-[#335765] font-bold">Date Range</Label>
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredEarnings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#B6D9E0" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  stroke="#74A8A4"
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#74A8A4" 
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                />
                <Tooltip
                  formatter={(value) => [`$${value}`, 'Earnings']}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                />
                <Line type="monotone" dataKey="amount" stroke="#335765" strokeWidth={3} dot={{ r: 4, fill: '#335765', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#7F543D' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="bg-white border-[#B6D9E0] shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="bg-[#DBE2DC]/30 border-b border-[#B6D9E0]">
          <CardTitle className="text-xl font-bold text-[#335765]">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr className="border-b border-[#B6D9E0] bg-white">
                  <th className="py-4 px-6 text-left text-[10px] font-black uppercase tracking-widest text-[#74A8A4]">Date</th>
                  <th className="py-4 px-6 text-left text-[10px] font-black uppercase tracking-widest text-[#74A8A4]">Student</th>
                  <th className="py-4 px-6 text-left text-[10px] font-black uppercase tracking-widest text-[#74A8A4]">Session Type</th>
                  <th className="py-4 px-6 text-left text-[10px] font-black uppercase tracking-widest text-[#74A8A4]">Amount</th>
                  <th className="py-4 px-6 text-left text-[10px] font-black uppercase tracking-widest text-[#74A8A4]">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-[#DBE2DC] last:border-0 hover:bg-[#DBE2DC]/20 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#335765]">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-[#335765] font-medium">{transaction.student}</td>
                    <td className="py-4 px-6 text-[#74A8A4] text-sm">{transaction.sessionType}</td>
                    <td className="py-4 px-6 font-black text-[#335765]">${transaction.amount}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
