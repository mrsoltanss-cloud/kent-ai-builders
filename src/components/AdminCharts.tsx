// src/components/AdminCharts.tsx
"use client"

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts"

type Trend = { week: string; users: number; leads: number }
type Status = Record<string, number>

export function TrendChart({ data }: { data: Trend[] }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3 text-sm text-slate-600">New Users & Leads per Week (last 8 weeks)</div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="week" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" />
            <Line type="monotone" dataKey="leads" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function StatusChart({ data }: { data: Status }) {
  const rows = Object.entries(data).map(([status, count]) => ({ status, count }))
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3 text-sm text-slate-600">Lead Status Breakdown</div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows}>
            <XAxis dataKey="status" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
