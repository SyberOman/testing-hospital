"use client"

import { useAuth } from "@/components/auth-provider"
import { AdminDashboard } from "@/components/admin-dashboard"
import { DepartmentDashboard } from "@/components/department-dashboard"

// Update the dashboard page to fill the available space
export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return null // or redirect to login
  }

  if (user.role === "admin") {
    return <AdminDashboard />
  }

  return <DepartmentDashboard />
}

