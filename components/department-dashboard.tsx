"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import type { Report } from "@/lib/types"

export function DepartmentDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for the department dashboard
  const departmentStats = {
    todayReports: 2,
    pendingReports: 1,
    totalStaff: 8,
    totalMOs: 2,
    totalOPDCases: 47,
    totalRTACases: 3,
    totalMLCCases: 2,
    totalReferrals: 6,
  }

  const recentReports: Report[] = [
    {
      id: "1",
      date: new Date(),
      department: user?.department || "",
      shift: "M",
      staffCount: 5,
      moCount: 2,
      sickLeave: 1,
      opdCases: 32,
      shortStayCases: 8,
      referralToBH: 4,
      rtaCases: 3,
      mlcCases: 2,
      escortCases: 1,
      lamaCases: 0,
      dressingCases: 15,
      referralFromHHC: 2,
      casesWithReferral: 6,
      casesWithoutReferral: 26,
      fridgeMinTemp: "2.1",
      fridgeMaxTemp: "4.2",
      submittedBy: "Dr. John Smith",
      submittedAt: "08:45 AM",
      notes: "Equipment maintenance required for ventilator #3",
    },
    // Add more mock reports...
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 w-full h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{user?.department} Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button onClick={() => router.push("/reports/submit")}>Submit Report</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{departmentStats.todayReports}</div>
                <p className="text-xs text-muted-foreground">{departmentStats.pendingReports} pending</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Staff on Duty</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{departmentStats.totalStaff}</div>
                <p className="text-xs text-muted-foreground">Including {departmentStats.totalMOs} Medical Officers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">OPD Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{departmentStats.totalOPDCases}</div>
                <p className="text-xs text-muted-foreground">Today's total</p>
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
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest reports and activities in your department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {recentReports.map((report) => (
                    <div key={report.id} className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Report submitted for {report.shift} shift</p>
                        <p className="text-sm text-muted-foreground">
                          By {report.submittedBy} at {report.submittedAt}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">{report.opdCases} OPD cases</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Department Summary</CardTitle>
                <CardDescription>Today's key metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Total Referrals</div>
                    <div>{departmentStats.totalReferrals}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Staff on Leave</div>
                    <div>1</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Pending Tasks</div>
                    <div>3</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Latest reports submitted by your department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{report.shift} Shift Report</p>
                      <p className="text-sm text-muted-foreground">Submitted by {report.submittedBy}</p>
                      <p className="text-sm text-muted-foreground">{report.submittedAt}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{report.opdCases} OPD Cases</div>
                      <div className="text-sm text-muted-foreground">
                        {report.rtaCases} RTA | {report.mlcCases} MLC
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

