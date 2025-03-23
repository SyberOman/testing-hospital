"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function DashboardCharts() {
  // Mock data for the chart
  const data = [
    {
      name: "6 AM",
      RESUS: 13,
      POPD: 28,
      DERMA: 9,
      ORTHO: 17,
      SOPD: 12,
      ENT: 8,
      ANC: 5,
      OPTHALMO: 11,
      SPECIALIST: 7,
      DENTAL: 15,
    },
    {
      name: "8 AM",
      RESUS: 18,
      POPD: 35,
      DERMA: 12,
      ORTHO: 22,
      SOPD: 15,
      ENT: 10,
      ANC: 8,
      OPTHALMO: 14,
      SPECIALIST: 9,
      DENTAL: 18,
    },
    {
      name: "10 AM",
      RESUS: 25,
      POPD: 42,
      DERMA: 18,
      ORTHO: 28,
      SOPD: 20,
      ENT: 15,
      ANC: 12,
      OPTHALMO: 18,
      SPECIALIST: 14,
      DENTAL: 22,
    },
    {
      name: "12 PM",
      RESUS: 22,
      POPD: 38,
      DERMA: 15,
      ORTHO: 25,
      SOPD: 18,
      ENT: 12,
      ANC: 10,
      OPTHALMO: 16,
      SPECIALIST: 12,
      DENTAL: 20,
    },
    {
      name: "2 PM",
      RESUS: 20,
      POPD: 32,
      DERMA: 14,
      ORTHO: 23,
      SOPD: 16,
      ENT: 11,
      ANC: 9,
      OPTHALMO: 15,
      SPECIALIST: 11,
      DENTAL: 19,
    },
    {
      name: "4 PM",
      RESUS: 15,
      POPD: 25,
      DERMA: 10,
      ORTHO: 18,
      SOPD: 13,
      ENT: 9,
      ANC: 7,
      OPTHALMO: 12,
      SPECIALIST: 8,
      DENTAL: 16,
    },
    {
      name: "6 PM",
      RESUS: 10,
      POPD: 18,
      DERMA: 7,
      ORTHO: 12,
      SOPD: 9,
      ENT: 6,
      ANC: 4,
      OPTHALMO: 8,
      SPECIALIST: 5,
      DENTAL: 10,
    },
  ]

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="RESUS" fill="#8884d8" stackId="a" />
        <Bar dataKey="POPD" fill="#82ca9d" stackId="a" />
        <Bar dataKey="DERMA" fill="#ffc658" stackId="a" />
        <Bar dataKey="ORTHO" fill="#ff8042" stackId="a" />
        <Bar dataKey="SOPD" fill="#0088fe" stackId="a" />
      </BarChart>
    </ResponsiveContainer>
  )
}

