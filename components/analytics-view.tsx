"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, Download, Printer } from "lucide-react"
import { format, subMonths } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
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
  AreaChart,
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"
import { jsPDF } from "jspdf"
import * as XLSX from "xlsx"

export function AnalyticsView({
  exportOptions = {
    pdf: { includeCharts: true, includeAllData: true },
    excel: { tabularDataOnly: true },
  },
}) {
  const { toast } = useToast()
  const { user } = useAuth()
  const [dateRange, setDateRange] = useState<{
    from: Date
    to: Date
  }>({
    from: subMonths(new Date(), 3),
    to: new Date(),
  })
  const [department, setDepartment] = useState<string>(user?.role === "admin" ? "all" : user?.department || "")
  const [timeframe, setTimeframe] = useState<string>("monthly")
  const [isExporting, setIsExporting] = useState(false)

  // Reset department filter when user changes
  useEffect(() => {
    if (user) {
      setDepartment(user.role === "admin" ? "all" : user.department || "")
    }
  }, [user])

  // Mock data for analytics
  const departmentPerformance = [
    { department: "RESUS", patients: 1253, avgWaitTime: 12, satisfaction: 4.2, referrals: 128 },
    { department: "POPD", patients: 1870, avgWaitTime: 18, satisfaction: 4.0, referrals: 95 },
    { department: "DERMA", patients: 1014, avgWaitTime: 25, satisfaction: 4.5, referrals: 48 },
    { department: "ORTHO", patients: 1271, avgWaitTime: 22, satisfaction: 4.1, referrals: 112 },
    { department: "SOPD", patients: 1321, avgWaitTime: 20, satisfaction: 4.3, referrals: 87 },
    { department: "ENT", patients: 978, avgWaitTime: 15, satisfaction: 4.4, referrals: 62 },
    { department: "ANC", patients: 744, avgWaitTime: 10, satisfaction: 4.7, referrals: 35 },
    { department: "OPTHALMO", patients: 827, avgWaitTime: 28, satisfaction: 3.9, referrals: 73 },
    { department: "SPECIALIST", patients: 563, avgWaitTime: 8, satisfaction: 4.8, referrals: 41 },
    { department: "DENTAL", patients: 897, avgWaitTime: 17, satisfaction: 4.2, referrals: 54 },
  ]

  // Filter data based on user's department
  const filteredDepartmentPerformance = departmentPerformance.filter((item) => {
    // Admin can see all departments, regular users can only see their own department
    if (user?.role !== "admin" && item.department !== user?.department) return false

    // Apply selected department filter (for admins)
    if (department !== "all" && item.department !== department) return false

    return true
  })

  const monthlyTrends = [
    { month: "Jan", patients: 2450, rtaCases: 42, mlcCases: 28, referrals: 156 },
    { month: "Feb", patients: 2320, rtaCases: 38, mlcCases: 25, referrals: 142 },
    { month: "Mar", patients: 2580, rtaCases: 45, mlcCases: 30, referrals: 168 },
    { month: "Apr", patients: 2780, rtaCases: 52, mlcCases: 35, referrals: 183 },
    { month: "May", patients: 2890, rtaCases: 48, mlcCases: 32, referrals: 175 },
    { month: "Jun", patients: 3050, rtaCases: 55, mlcCases: 38, referrals: 192 },
    { month: "Jul", patients: 3150, rtaCases: 58, mlcCases: 40, referrals: 205 },
    { month: "Aug", patients: 3080, rtaCases: 56, mlcCases: 37, referrals: 198 },
    { month: "Sep", patients: 2950, rtaCases: 50, mlcCases: 34, referrals: 180 },
    { month: "Oct", patients: 2870, rtaCases: 47, mlcCases: 31, referrals: 172 },
    { month: "Nov", patients: 2750, rtaCases: 44, mlcCases: 29, referrals: 165 },
    { month: "Dec", patients: 2680, rtaCases: 43, mlcCases: 28, referrals: 160 },
  ]

  const staffUtilization = [
    { department: "RESUS", doctors: 85, nurses: 78, support: 65 },
    { department: "POPD", doctors: 90, nurses: 82, support: 70 },
    { department: "DERMA", doctors: 75, nurses: 68, support: 60 },
    { department: "ORTHO", doctors: 82, nurses: 75, support: 68 },
    { department: "SOPD", doctors: 88, nurses: 80, support: 72 },
    { department: "ENT", doctors: 78, nurses: 72, support: 65 },
    { department: "ANC", doctors: 92, nurses: 85, support: 75 },
    { department: "OPTHALMO", doctors: 80, nurses: 73, support: 65 },
    { department: "SPECIALIST", doctors: 95, nurses: 88, support: 78 },
    { department: "DENTAL", doctors: 83, nurses: 76, support: 68 },
  ]

  // Filter staff utilization data based on user's department
  const filteredStaffUtilization = staffUtilization.filter((item) => {
    // Admin can see all departments, regular users can only see their own department
    if (user?.role !== "admin" && item.department !== user?.department) return false

    // Apply selected department filter (for admins)
    if (department !== "all" && item.department !== department) return false

    return true
  })

  const patientDemographics = [
    { name: "0-18", value: 25 },
    { name: "19-35", value: 30 },
    { name: "36-50", value: 20 },
    { name: "51-65", value: 15 },
    { name: "65+", value: 10 },
  ]

  const patientSatisfaction = [
    { subject: "Wait Time", A: 65, B: 85, fullMark: 100 },
    { subject: "Staff Courtesy", A: 80, B: 90, fullMark: 100 },
    { subject: "Facility Cleanliness", A: 75, B: 88, fullMark: 100 },
    { subject: "Treatment Effectiveness", A: 85, B: 92, fullMark: 100 },
    { subject: "Communication", A: 70, B: 82, fullMark: 100 },
    { subject: "Overall Experience", A: 75, B: 87, fullMark: 100 },
  ]

  const hourlyPatientFlow = [
    { time: "6 AM", patients: 15 },
    { time: "7 AM", patients: 25 },
    { time: "8 AM", patients: 45 },
    { time: "9 AM", patients: 65 },
    { time: "10 AM", patients: 85 },
    { time: "11 AM", patients: 95 },
    { time: "12 PM", patients: 80 },
    { time: "1 PM", patients: 70 },
    { time: "2 PM", patients: 75 },
    { time: "3 PM", patients: 85 },
    { time: "4 PM", patients: 70 },
    { time: "5 PM", patients: 55 },
    { time: "6 PM", patients: 40 },
    { time: "7 PM", patients: 30 },
    { time: "8 PM", patients: 20 },
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

  // Update the handleExport function to handle different export formats
  const handleExport = async (type: "pdf" | "excel") => {
    try {
      setIsExporting(true)
      const title = `Analytics Report - ${format(dateRange.from, "MMMM d")} to ${format(dateRange.to, "MMMM d, yyyy")}`

      if (type === "pdf") {
        // For PDF: Include all data with charts
        const doc = new jsPDF()
        doc.setFontSize(16)
        doc.text(title, 14, 15)
        doc.setFontSize(10)
        doc.text(`Generated on ${format(new Date(), "PPP")}`, 14, 25)
        doc.text(`Report Period: ${format(dateRange.from, "PPP")} to ${format(dateRange.to, "PPP")}`, 14, 30)

        // Add summary data
        doc.setFontSize(12)
        doc.text("Summary", 14, 40)
        doc.setFontSize(10)
        doc.text(
          `Total Patients: ${user?.role === "admin" ? "32,550" : filteredDepartmentPerformance[0]?.patients || 0}`,
          14,
          50,
        )
        doc.text(
          `Average Wait Time: ${user?.role === "admin" ? "18.5 min" : filteredDepartmentPerformance[0]?.avgWaitTime || 0} min`,
          14,
          55,
        )
        doc.text(`Critical Cases: 576 (RTA: 328, MLC: 248)`, 14, 60)
        doc.text(
          `Patient Satisfaction: ${user?.role === "admin" ? "4.3/5" : filteredDepartmentPerformance[0]?.satisfaction || 0}/5`,
          14,
          65,
        )

        // Add department data
        doc.setFontSize(12)
        doc.text("Department Performance", 14, 75)
        let yPos = 85
        filteredDepartmentPerformance.forEach((dept, index) => {
          if (yPos > 270) {
            doc.addPage()
            yPos = 20
          }
          doc.setFontSize(10)
          doc.text(
            `${dept.department}: ${dept.patients} patients, ${dept.avgWaitTime} min wait time, ${dept.satisfaction}/5 satisfaction`,
            14,
            yPos,
          )
          yPos += 10
        })

        // Save the PDF
        doc.save(`${title.toLowerCase().replace(/\s+/g, "-")}-${format(new Date(), "yyyy-MM-dd")}.pdf`)
      } else {
        // For Excel: Only include tabular data
        const wb = XLSX.utils.book_new()

        // Department Performance Table
        const deptData = [
          ["Department", "Total Patients", "Avg Wait Time (min)", "Satisfaction Score", "Referrals"],
          ...filteredDepartmentPerformance.map((item) => [
            item.department,
            item.patients,
            item.avgWaitTime,
            item.satisfaction,
            item.referrals,
          ]),
        ]
        const deptWS = XLSX.utils.aoa_to_sheet(deptData)
        XLSX.utils.book_append_sheet(wb, deptWS, "Department Performance")

        // Monthly Trends Table
        const trendsData = [
          ["Month", "Patients", "RTA Cases", "MLC Cases", "Referrals"],
          ...monthlyTrends.map((item) => [item.month, item.patients, item.rtaCases, item.mlcCases, item.referrals]),
        ]
        const trendsWS = XLSX.utils.aoa_to_sheet(trendsData)
        XLSX.utils.book_append_sheet(wb, trendsWS, "Monthly Trends")

        // Staff Utilization Table
        const staffData = [
          ["Department", "Doctors Utilization (%)", "Nurses Utilization (%)", "Support Staff Utilization (%)"],
          ...filteredStaffUtilization.map((item) => [item.department, item.doctors, item.nurses, item.support]),
        ]
        const staffWS = XLSX.utils.aoa_to_sheet(staffData)
        XLSX.utils.book_append_sheet(wb, staffWS, "Staff Utilization")

        // Save the file
        XLSX.writeFile(wb, `${title.toLowerCase().replace(/\s+/g, "-")}-${format(new Date(), "yyyy-MM-dd")}.xlsx`)
      }

      toast({
        title: "Export successful",
        description: `Report has been exported as ${type.toUpperCase()}`,
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting the report. Please try again or use the print option.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handlePrint = () => {
    try {
      // Add a print-specific style element
      const style = document.createElement("style")
      style.innerHTML = `
        @media print {
          body * {
            visibility: hidden;
          }
          .analytics-container, .analytics-container * {
            visibility: visible;
          }
          .analytics-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          .no-print, button, .no-print * {
            display: none !important;
          }
          
          /* Improve chart display for print */
          .recharts-wrapper {
            page-break-inside: avoid;
          }
          
          /* Improve card styling for print */
          .card {
            border: 1px solid #ddd;
            margin-bottom: 20px;
            page-break-inside: avoid;
          }
        }
      `
      document.head.appendChild(style)

      window.print()

      // Remove the style element after printing
      document.head.removeChild(style)

      toast({
        title: "Print initiated",
        description: "The print dialog has been opened",
      })
    } catch (error) {
      console.error("Print error:", error)
      toast({
        title: "Print failed",
        description: "There was an error preparing the report for printing",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4 analytics-container">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-[300px] justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange(range)
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {user?.role === "admin" && (
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="RESUS">RESUS</SelectItem>
                <SelectItem value="POPD">POPD</SelectItem>
                <SelectItem value="DERMA">DERMA</SelectItem>
                <SelectItem value="ORTHO">ORTHO</SelectItem>
                <SelectItem value="SOPD">SOPD</SelectItem>
                <SelectItem value="ENT">ENT</SelectItem>
                <SelectItem value="ANC">ANC</SelectItem>
                <SelectItem value="OPTHALMO">OPTHALMO</SelectItem>
                <SelectItem value="SPECIALIST">SPECIALIST</SelectItem>
                <SelectItem value="DENTAL">DENTAL</SelectItem>
              </SelectContent>
            </Select>
          )}

          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={isExporting}>
                <Download className="mr-2 h-4 w-4" />
                {isExporting ? "Exporting..." : "Export"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("excel")}>Export as Excel</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("pdf")}>Export as PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>
            Analytics Dashboard - {format(dateRange.from, "MMMM d")} to {format(dateRange.to, "MMMM d, yyyy")}
            {user?.role !== "admin" && ` - ${user?.department}`}
          </CardTitle>
          <CardDescription>Comprehensive analytics and insights for hospital performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user?.role === "admin"
                    ? "32,550"
                    : filteredDepartmentPerformance.length > 0
                      ? filteredDepartmentPerformance[0].patients
                      : "0"}
                </div>
                <p className="text-xs text-muted-foreground">+12.5% from previous period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Wait Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user?.role === "admin"
                    ? "18.5 min"
                    : filteredDepartmentPerformance.length > 0
                      ? `${filteredDepartmentPerformance[0].avgWaitTime} min`
                      : "0 min"}
                </div>
                <p className="text-xs text-muted-foreground">-2.3 min from previous period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Critical Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">576</div>
                <p className="text-xs text-muted-foreground">RTA: 328 | MLC: 248</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Patient Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user?.role === "admin"
                    ? "4.3/5"
                    : filteredDepartmentPerformance.length > 0
                      ? `${filteredDepartmentPerformance[0].satisfaction}/5`
                      : "0/5"}
                </div>
                <p className="text-xs text-muted-foreground">+0.2 from previous period</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="departments">Department Analysis</TabsTrigger>
          <TabsTrigger value="patients">Patient Analytics</TabsTrigger>
          <TabsTrigger value="staff">Staff Utilization</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Patient Trends</CardTitle>
                <CardDescription>Total patients seen per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="patients" stroke="#0088FE" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Critical Cases Trend</CardTitle>
                <CardDescription>RTA and MLC cases over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="rtaCases" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="mlcCases" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Hourly Patient Flow</CardTitle>
              <CardDescription>Average number of patients by hour of day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hourlyPatientFlow}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="patients" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Department Patient Volume</CardTitle>
                <CardDescription>Total patients by department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={filteredDepartmentPerformance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="department" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="patients" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Wait Time</CardTitle>
                <CardDescription>Average wait time in minutes by department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={filteredDepartmentPerformance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="department" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="avgWaitTime" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Department Performance Comparison</CardTitle>
              <CardDescription>Key metrics across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Patient Satisfaction Score (out of 5)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={filteredDepartmentPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Bar dataKey="satisfaction" fill="#FFBB28" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Referrals by Department</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={filteredDepartmentPerformance}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="referrals"
                        nameKey="department"
                      >
                        {filteredDepartmentPerformance.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Patient Age Distribution</CardTitle>
                <CardDescription>Breakdown of patients by age group</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={patientDemographics}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {patientDemographics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Patient Satisfaction Metrics</CardTitle>
                <CardDescription>Current period vs previous period</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart cx="50%" cy="50%" outerRadius={80} data={patientSatisfaction}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Current Period" dataKey="B" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Radar name="Previous Period" dataKey="A" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Patient Flow Analysis</CardTitle>
              <CardDescription>Patterns and bottlenecks in patient journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average Time to First Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8.3 min</div>
                    <p className="text-xs text-muted-foreground">-1.2 min from previous period</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average Treatment Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">22.7 min</div>
                    <p className="text-xs text-muted-foreground">+0.5 min from previous period</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average Discharge Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12.4 min</div>
                    <p className="text-xs text-muted-foreground">-0.8 min from previous period</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Staff Utilization by Department</CardTitle>
                <CardDescription>Percentage of staff utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={filteredStaffUtilization}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="doctors" fill="#0088FE" name="Doctors" />
                    <Bar dataKey="nurses" fill="#00C49F" name="Nurses" />
                    <Bar dataKey="support" fill="#FFBB28" name="Support Staff" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Staff to Patient Ratio</CardTitle>
                <CardDescription>Number of patients per staff member</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={[
                      { month: "Jan", ratio: 5.2 },
                      { month: "Feb", ratio: 5.5 },
                      { month: "Mar", ratio: 5.8 },
                      { month: "Apr", ratio: 6.1 },
                      { month: "May", ratio: 6.3 },
                      { month: "Jun", ratio: 6.5 },
                      { month: "Jul", ratio: 6.7 },
                      { month: "Aug", ratio: 6.5 },
                      { month: "Sep", ratio: 6.2 },
                      { month: "Oct", ratio: 5.9 },
                      { month: "Nov", ratio: 5.6 },
                      { month: "Dec", ratio: 5.4 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[5, 7]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="ratio" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Staff Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators for staff</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average Patients Per Doctor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">18.5</div>
                    <p className="text-xs text-muted-foreground">+2.3 from target</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average Patients Per Nurse</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12.8</div>
                    <p className="text-xs text-muted-foreground">-0.7 from target</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Staff Overtime Hours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">128</div>
                    <p className="text-xs text-muted-foreground">-15% from previous period</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Staff Satisfaction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.1/5</div>
                    <p className="text-xs text-muted-foreground">+0.3 from previous period</p>
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

