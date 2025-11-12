'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Table } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

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

export default function MentorEarnings() {
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
    <DashboardLayout userRole="MENTOR">
      <div className="p-6 space-y-8 text-white">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Earnings Overview</h1>
          <p className="text-purple-300">Track income, payments, and performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Earnings', value: `$${stats.totalEarnings}` },
            { label: 'Pending Payments', value: `$${stats.pendingPayments}` },
            { label: 'Completed Sessions', value: stats.completedSessions },
            { label: 'Average Rating', value: stats.averageRating },
          ].map((item, i) => (
            <Card key={i} className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-sm text-purple-200">{item.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Earnings Chart */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-white">Earnings Chart</CardTitle>
            <div className="flex items-center space-x-4">
              <Label className="text-purple-300">Date Range</Label>
              <DateRangePicker value={dateRange} onChange={setDateRange} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredEarnings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                    stroke="#aaa"
                  />
                  <YAxis stroke="#aaa" />
                  <Tooltip
                    formatter={(value) => [`$${value}`, 'Earnings']}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  />
                  <Line type="monotone" dataKey="amount" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-white/10">
              <Table>
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-purple-200">
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Student</th>
                    <th className="py-3 px-4 text-left">Session Type</th>
                    <th className="py-3 px-4 text-left">Amount</th>
                    <th className="py-3 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-white/10">
                      <td className="py-3 px-4 text-white">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-purple-200">{transaction.student}</td>
                      <td className="py-3 px-4 text-purple-200">{transaction.sessionType}</td>
                      <td className="py-3 px-4 text-white">${transaction.amount}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.status === 'completed'
                              ? 'bg-green-500/20 text-green-400'
                              : transaction.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
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
    </DashboardLayout>
  )
}
