"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, Download, Printer } from "lucide-react"
import { format, subDays } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MonthlyCharts } from "@/components/monthly-charts"
import { MonthlyTable } from "@/components/monthly-table"
import { exportMonthlyToExcel, printMonthlyReport } from "@/lib/export-utils"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { jsPDF } from "jspdf"

export type MonthlyReportData = {
  department: string
  staffCount: number
  moCount: number
  sickLeave: number
  opdCases: number
  shortStayCases: number
  referralToBH: number
  rtaCases: number
  mlcCases: number
  escortCases: number
  lamaCases: number
  dressingCases: number
  referralFromHHC: number
  casesWithReferral: number
  casesWithoutReferral: number
  avgFridgeMinTemp: string
  avgFridgeMaxTemp: string
}

export function MonthlyReportsView() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [dateRange, setDateRange] = useState<{
    from: Date
    to: Date
  }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [department, setDepartment] = useState<string>(user?.role === "admin" ? "all" : user?.department || "")
  const [isExporting, setIsExporting] = useState(false)

  // Reset department filter when user changes
  useEffect(() => {
    if (user) {
      setDepartment(user.role === "admin" ? "all" : user.department || "")
    }
  }, [user])

  // Mock data for monthly statistics
  const monthlyData: MonthlyReportData[] = [
    {
      department: "RESUS",
      staffCount: 25,
      moCount: 8,
      sickLeave: 3,
      opdCases: 253,
      shortStayCases: 45,
      referralToBH: 28,
      rtaCases: 42,
      mlcCases: 15,
      escortCases: 8,
      lamaCases: 3,
      dressingCases: 120,
      referralFromHHC: 12,
      casesWithReferral: 48,
      casesWithoutReferral: 205,
      avgFridgeMinTemp: "2.3",
      avgFridgeMaxTemp: "4.1",
    },
    {
      department: "POPD",
      staffCount: 30,
      moCount: 10,
      sickLeave: 2,
      opdCases: 370,
      shortStayCases: 60,
      referralToBH: 15,
      rtaCases: 0,
      mlcCases: 0,
      escortCases: 0,
      lamaCases: 0,
      dressingCases: 150,
      referralFromHHC: 8,
      casesWithReferral: 23,
      casesWithoutReferral: 347,
      avgFridgeMinTemp: "2.8",
      avgFridgeMaxTemp: "4.5",
    },
    {
      department: "DERMA",
      staffCount: 15,
      moCount: 5,
      sickLeave: 1,
      opdCases: 214,
      shortStayCases: 30,
      referralToBH: 8,
      rtaCases: 0,
      mlcCases: 0,
      escortCases: 0,
      lamaCases: 0,
      dressingCases: 90,
      referralFromHHC: 5,
      casesWithReferral: 13,
      casesWithoutReferral: 201,
      avgFridgeMinTemp: "2.5",
      avgFridgeMaxTemp: "4.3",
    },
    {
      department: "ORTHO",
      staffCount: 20,
      moCount: 6,
      sickLeave: 2,
      opdCases: 271,
      shortStayCases: 40,
      referralToBH: 12,
      rtaCases: 0,
      mlcCases: 0,
      escortCases: 0,
      lamaCases: 0,
      dressingCases: 110,
      referralFromHHC: 7,
      casesWithReferral: 19,
      casesWithoutReferral: 252,
      avgFridgeMinTemp: "2.2",
      avgFridgeMaxTemp: "4.0",
    },
    {
      department: "SOPD",
      staffCount: 22,
      moCount: 7,
      sickLeave: 1,
      opdCases: 321,
      shortStayCases: 55,
      referralToBH: 10,
      rtaCases: 0,
      mlcCases: 0,
      escortCases: 0,
      lamaCases: 0,
      dressingCases: 135,
      referralFromHHC: 9,
      casesWithReferral: 19,
      casesWithoutReferral: 302,
      avgFridgeMinTemp: "2.7",
      avgFridgeMaxTemp: "4.4",
    },
  ]

  // Filter data based on user's department
  const filteredData = monthlyData.filter((item) => {
    // Admin can see all departments, regular users can only see their own department
    if (user?.role !== "admin" && item.department !== user?.department) return false

    // Apply selected department filter (for admins)
    if (department !== "all" && item.department !== department) return false

    return true
  })

  // Update the handleExport function to handle errors better
  const handleExport = async (type: "pdf" | "excel") => {
    try {
      setIsExporting(true)
      const title = `Monthly Statistics - ${format(dateRange.from, "MMMM d")} to ${format(dateRange.to, "MMMM d, yyyy")}`

      if (type === "pdf") {
        // Use a simpler approach for PDF export if autoTable is causing issues
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
        doc.text(`Total Staff: ${filteredData.reduce((sum, item) => sum + item.staffCount, 0)}`, 14, 50)
        doc.text(`Total OPD Cases: ${filteredData.reduce((sum, item) => sum + item.opdCases, 0)}`, 14, 55)

        // Save the PDF
        doc.save(`${title.toLowerCase().replace(/\s+/g, "-")}-${format(new Date(), "yyyy-MM-dd")}.pdf`)
      } else {
        await exportMonthlyToExcel(filteredData, title, dateRange)
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
      const title = `Monthly Statistics - ${format(dateRange.from, "MMMM d")} to ${format(dateRange.to, "MMMM d, yyyy")}`
      printMonthlyReport(filteredData, title, dateRange)

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

  // Add a print-specific style element for better printing
  useEffect(() => {
    // Add a style element for print media
    const style = document.createElement("style")
    style.innerHTML = `
    @media print {
      body * {
        visibility: hidden;
      }
      #monthly-reports-container, #monthly-reports-container * {
        visibility: visible;
      }
      #monthly-reports-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        padding: 20px;
      }
      .no-print {
        display: none !important;
      }
      
      /* Improve table styling for print */
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f2f2f2;
        font-weight: bold;
      }
      tr:nth-child(even) {
        background-color: #f9f9f9;
      }
      
      /* Improve card styling for print */
      .card {
        border: 1px solid #ddd;
        margin-bottom: 20px;
        page-break-inside: avoid;
      }
      .card-header {
        border-bottom: 1px solid #ddd;
        padding: 10px;
        font-weight: bold;
      }
      .card-content {
        padding: 10px;
      }
    }
  `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="space-y-4" id="monthly-reports-container">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between no-print">
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
        </div>

        <div className="flex gap-2 no-print">
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

      <Card className="card">
        <CardHeader className="pb-2 card-header">
          <CardTitle>
            Monthly Statistics - {format(dateRange.from, "MMMM d")} to {format(dateRange.to, "MMMM d, yyyy")}
            {user?.role !== "admin" && ` - ${user?.department}`}
          </CardTitle>
        </CardHeader>
        <CardContent className="card-content">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="card">
              <CardHeader className="pb-2 card-header">
                <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              </CardHeader>
              <CardContent className="card-content">
                <div className="text-2xl font-bold">{filteredData.reduce((sum, item) => sum + item.staffCount, 0)}</div>
                <p className="text-xs text-muted-foreground">
                  MOs: {filteredData.reduce((sum, item) => sum + item.moCount, 0)}
                </p>
              </CardContent>
            </Card>

            <Card className="card">
              <CardHeader className="pb-2 card-header">
                <CardTitle className="text-sm font-medium">Total OPD Cases</CardTitle>
              </CardHeader>
              <CardContent className="card-content">
                <div className="text-2xl font-bold">{filteredData.reduce((sum, item) => sum + item.opdCases, 0)}</div>
                <p className="text-xs text-muted-foreground">
                  Short Stay: {filteredData.reduce((sum, item) => sum + item.shortStayCases, 0)}
                </p>
              </CardContent>
            </Card>

            <Card className="card">
              <CardHeader className="pb-2 card-header">
                <CardTitle className="text-sm font-medium">Critical Cases</CardTitle>
              </CardHeader>
              <CardContent className="card-content">
                <div className="text-2xl font-bold">
                  {filteredData.reduce((sum, item) => sum + item.rtaCases + item.mlcCases, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  RTA: {filteredData.reduce((sum, item) => sum + item.rtaCases, 0)} | MLC:{" "}
                  {filteredData.reduce((sum, item) => sum + item.mlcCases, 0)}
                </p>
              </CardContent>
            </Card>

            <Card className="card">
              <CardHeader className="pb-2 card-header">
                <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
              </CardHeader>
              <CardContent className="card-content">
                <div className="text-2xl font-bold">
                  {filteredData.reduce((sum, item) => sum + item.casesWithReferral, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  To BH: {filteredData.reduce((sum, item) => sum + item.referralToBH, 0)} | From HHC:{" "}
                  {filteredData.reduce((sum, item) => sum + item.referralFromHHC, 0)}
                </p>
              </CardContent>
            </Card>

            <Card className="card">
              <CardHeader className="pb-2 card-header">
                <CardTitle className="text-sm font-medium">Temperature</CardTitle>
              </CardHeader>
              <CardContent className="card-content">
                <div className="text-md font-medium">
                  Min: {filteredData.length > 0 ? filteredData[0].avgFridgeMinTemp : "-"}°C / Max:{" "}
                  {filteredData.length > 0 ? filteredData[0].avgFridgeMaxTemp : "-"}°C
                </div>
                <p className="text-xs text-muted-foreground">Average across all departments</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 no-print">
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-4 mt-4">
          <MonthlyCharts data={filteredData} />
        </TabsContent>

        <TabsContent value="table" className="space-y-4 mt-4">
          <MonthlyTable data={filteredData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

