"use client"

import { useState } from "react"
import Link from "next/link"
import { AlertCircle, ArrowRight, CalendarDays, ClipboardList, FileText, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DepartmentStatusTable } from "@/components/department-status-table"
import { DashboardCharts } from "@/components/dashboard-charts"
import { useAuth } from "@/components/auth-provider"

export function DashboardPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for the dashboard
  const pendingReports = 3
  const totalReportsToday = 7
  const departmentsSubmitted = 7
  const totalDepartments = 10

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 w-full h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/reports/submit">
              <Plus className="mr-2 h-4 w-4" /> Submit Report
            </Link>
          </Button>
        </div>
      </div>

      {/* Alert for pending reports */}
      {pendingReports > 0 && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Attention Required</AlertTitle>
          <AlertDescription>{pendingReports} departments have not submitted their reports for today.</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Department Status</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 w-full">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reports Today</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalReportsToday}</div>
                <p className="text-xs text-muted-foreground">
                  {departmentsSubmitted} of {totalDepartments} departments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingReports}</div>
                <p className="text-xs text-muted-foreground">
                  {pendingReports > 0 ? "Action required" : "All reports submitted"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total OPD Cases Today</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">247</div>
                <p className="text-xs text-muted-foreground">+12% from yesterday</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total RTA Cases</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">-3% from yesterday</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 w-full">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Daily Patient Flow</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <DashboardCharts />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Latest submitted department reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { dept: "RESUS", time: "10:23 AM", shift: "Morning" },
                    { dept: "POPD", time: "09:45 AM", shift: "Morning" },
                    { dept: "DERMA", time: "11:15 AM", shift: "Morning" },
                    { dept: "ENT", time: "10:05 AM", shift: "Morning" },
                    { dept: "DENTAL", time: "09:30 AM", shift: "Morning" },
                  ].map((report, i) => (
                    <div key={i} className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{report.dept}</p>
                        <p className="text-sm text-muted-foreground">
                          {report.shift} shift • {report.time}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href="/reports/daily">
                            <span className="sr-only">View report</span>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/reports/daily">View all reports</Link>
                </Button>
              </CardFooter>
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

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>View detailed analytics and trends</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Weekly OPD Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                      Chart will appear here
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Department Workload</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                      Chart will appear here
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Staff Availability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                      Chart will appear here
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button asChild>
                <Link href="/reports/monthly">View detailed analytics</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

