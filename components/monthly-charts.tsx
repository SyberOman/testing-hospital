"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MonthlyCharts() {
  // Mock data for the charts
  const dailyData = [
    {
      date: "Feb 1",
      RESUS: 32,
      POPD: 47,
      DERMA: 28,
      ORTHO: 35,
      SOPD: 41,
      ENT: 22,
      ANC: 18,
      OPTHALMO: 15,
      SPECIALIST: 20,
      DENTAL: 25,
    },
    {
      date: "Feb 2",
      RESUS: 35,
      POPD: 52,
      DERMA: 30,
      ORTHO: 38,
      SOPD: 45,
      ENT: 25,
      ANC: 20,
      OPTHALMO: 18,
      SPECIALIST: 22,
      DENTAL: 28,
    },
    {
      date: "Feb 3",
      RESUS: 30,
      POPD: 45,
      DERMA: 25,
      ORTHO: 32,
      SOPD: 38,
      ENT: 20,
      ANC: 15,
      OPTHALMO: 12,
      SPECIALIST: 18,
      DENTAL: 22,
    },
    {
      date: "Feb 4",
      RESUS: 38,
      POPD: 55,
      DERMA: 32,
      ORTHO: 40,
      SOPD: 48,
      ENT: 28,
      ANC: 22,
      OPTHALMO: 20,
      SPECIALIST: 25,
      DENTAL: 30,
    },
    {
      date: "Feb 5",
      RESUS: 42,
      POPD: 60,
      DERMA: 35,
      ORTHO: 45,
      SOPD: 52,
      ENT: 30,
      ANC: 25,
      OPTHALMO: 22,
      SPECIALIST: 28,
      DENTAL: 32,
    },
    {
      date: "Feb 6",
      RESUS: 40,
      POPD: 58,
      DERMA: 33,
      ORTHO: 42,
      SOPD: 50,
      ENT: 27,
      ANC: 23,
      OPTHALMO: 21,
      SPECIALIST: 26,
      DENTAL: 31,
    },
    {
      date: "Feb 7",
      RESUS: 36,
      POPD: 53,
      DERMA: 31,
      ORTHO: 39,
      SOPD: 47,
      ENT: 26,
      ANC: 21,
      OPTHALMO: 19,
      SPECIALIST: 24,
      DENTAL: 29,
    },
  ]

  const departmentData = [
    { name: "RESUS", value: 253 },
    { name: "POPD", value: 370 },
    { name: "DERMA", value: 214 },
    { name: "ORTHO", value: 271 },
    { name: "SOPD", value: 321 },
    { name: "ENT", value: 178 },
    { name: "ANC", value: 144 },
    { name: "OPTHALMO", value: 127 },
    { name: "SPECIALIST", value: 163 },
    { name: "DENTAL", value: 197 },
  ]

  const rtaData = [
    { date: "Week 1", cases: 12 },
    { date: "Week 2", cases: 9 },
    { date: "Week 3", cases: 15 },
    { date: "Week 4", cases: 6 },
  ]

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#ff0000",
    "#8dd1e1",
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Patient Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="RESUS" stroke="#0088FE" />
                <Line type="monotone" dataKey="POPD" stroke="#00C49F" />
                <Line type="monotone" dataKey="DERMA" stroke="#FFBB28" />
                <Line type="monotone" dataKey="ORTHO" stroke="#FF8042" />
                <Line type="monotone" dataKey="SOPD" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly RTA Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rtaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cases" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Workload</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

