"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DepartmentStatusTable } from "@/components/department-status-table"
import { DashboardCharts } from "@/components/dashboard-charts"
import { useAuth } from "@/components/auth-provider"

export function AdminDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for the dashboard
  const departmentStats = {
    totalReports: 42,
    pendingReports: 3,
    totalStaff: 120,
    totalMOs: 35,
    totalOPDCases: 547,
    totalRTACases: 28,
    totalMLCCases: 15,
    totalReferrals: 42,
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 w-full h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Department Status</TabsTrigger>
          <TabsTrigger value="staff">Staff Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reports Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{departmentStats.totalReports}</div>
                <p className="text-xs text-muted-foreground">
                  {departmentStats.totalReports - departmentStats.pendingReports} submitted
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Staff on Duty</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{departmentStats.totalStaff}</div>
                <p className="text-xs text-muted-foreground">Including {departmentStats.totalMOs} Medical Officers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total OPD Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{departmentStats.totalOPDCases}</div>
                <p className="text-xs text-muted-foreground">Across all departments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {departmentStats.totalRTACases + departmentStats.totalMLCCases}
                </div>
                <p className="text-xs text-muted-foreground">
                  RTA: {departmentStats.totalRTACases} | MLC: {departmentStats.totalMLCCases}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Department-wise Patient Flow</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <DashboardCharts />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Department Summary</CardTitle>
                <CardDescription>Current shift status across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <DepartmentStatusTable />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle>Department Report Status</CardTitle>
              <CardDescription>Status of today's report submissions by department</CardDescription>
            </CardHeader>
            <CardContent>
              <DepartmentStatusTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle>Staff Overview</CardTitle>
              <CardDescription>Current staff distribution and attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{departmentStats.totalStaff}</div>
                    <p className="text-xs text-muted-foreground">Active duty personnel</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Medical Officers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{departmentStats.totalMOs}</div>
                    <p className="text-xs text-muted-foreground">Across all departments</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Staff on Leave</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">Scheduled absences</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Department Heads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">10</div>
                    <p className="text-xs text-muted-foreground">All departments covered</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

