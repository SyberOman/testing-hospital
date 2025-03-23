"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, Download, Printer, Edit, Trash2, Save } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { exportToPDF, exportToExcel } from "@/lib/export-utils"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import type { Report } from "@/lib/types"

export function DailyReportsView() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [date, setDate] = useState<Date>(new Date())
  const [department, setDepartment] = useState<string>(user?.role === "admin" ? "all" : user?.department || "")
  const [shift, setShift] = useState<string>("all")
  const [isExporting, setIsExporting] = useState(false)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [editingReport, setEditingReport] = useState<Report | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [reportToDelete, setReportToDelete] = useState<string | null>(null)

  // Reset department filter when user changes
  useEffect(() => {
    if (user) {
      setDepartment(user.role === "admin" ? "all" : user.department || "")
    }
  }, [user])

  // Mock data for daily reports
  const [reports, setReports] = useState<Report[]>([
    {
      id: "1",
      date: new Date(),
      department: "RESUS",
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
    {
      id: "2",
      date: new Date(),
      department: "POPD",
      shift: "M",
      staffCount: 6,
      moCount: 3,
      sickLeave: 0,
      opdCases: 45,
      shortStayCases: 12,
      referralToBH: 5,
      rtaCases: 1,
      mlcCases: 0,
      escortCases: 2,
      lamaCases: 1,
      dressingCases: 20,
      referralFromHHC: 3,
      casesWithReferral: 8,
      casesWithoutReferral: 37,
      fridgeMinTemp: "2.3",
      fridgeMaxTemp: "4.0",
      submittedBy: "Dr. Jane Wilson",
      submittedAt: "09:15 AM",
      notes: "Shortage of pediatric nebulizer masks",
    },
    // Add more mock data...
  ])

  // Filter reports based on selected filters and user's department
  const filteredReports = reports.filter((report) => {
    // Admin can see all departments, regular users can only see their own department
    if (user?.role !== "admin" && report.department !== user?.department) return false

    // Apply selected department filter (for admins)
    if (department !== "all" && report.department !== department) return false

    // Apply shift filter
    if (shift !== "all" && report.shift !== shift) return false

    return true
  })

  const handleExport = async (type: "pdf" | "excel") => {
    try {
      setIsExporting(true)
      const title = `Daily Reports - ${format(date, "MMMM d, yyyy")}`

      if (type === "pdf") {
        await exportToPDF(filteredReports, title)
      } else {
        await exportToExcel(filteredReports, title)
      }

      toast({
        title: "Export successful",
        description: `Report has been exported as ${type.toUpperCase()}`,
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting the report",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handlePrint = () => {
    try {
      const title = `Daily Reports - ${format(date, "MMMM d, yyyy")}`

      // Create a new window for printing
      const printWindow = window.open("", "_blank")
      if (!printWindow) {
        toast({
          title: "Print failed",
          description: "Unable to open print window. Please check your browser settings.",
          variant: "destructive",
        })
        return
      }

      // Generate the HTML content for printing
      const reportsHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${title}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                color: #333;
              }
              h1 { 
                color: #2c3e50; 
                margin-bottom: 10px;
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-top: 20px; 
                font-size: 14px;
              }
              th, td { 
                border: 1px solid #ddd; 
                padding: 12px 8px; 
                text-align: left; 
              }
              th { 
                background-color: #f2f2f2; 
                font-weight: bold;
              }
              tr:nth-child(even) { 
                background-color: #f9f9f9; 
              }
              @media print {
                body { 
                  margin: 0; 
                  padding: 20px;
                }
              }
            </style>
          </head>
          <body>
            <h1>${title}</h1>
            
            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Shift</th>
                  <th>Staff</th>
                  <th>MOs</th>
                  <th>Sick Leave</th>
                  <th>OPD</th>
                  <th>Short Stay</th>
                  <th>BH Ref.</th>
                  <th>RTA</th>
                  <th>MLC</th>
                </tr>
              </thead>
              <tbody>
                ${filteredReports
                  .map(
                    (report) => `
                  <tr>
                    <td>${report.department}</td>
                    <td>${report.shift}</td>
                    <td>${report.staffCount}</td>
                    <td>${report.moCount}</td>
                    <td>${report.sickLeave}</td>
                    <td>${report.opdCases}</td>
                    <td>${report.shortStayCases}</td>
                    <td>${report.referralToBH}</td>
                    <td>${report.rtaCases}</td>
                    <td>${report.mlcCases}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
            
            <div style="margin-top: 30px;">
              <h2>Summary</h2>
              <p><strong>Total Staff on Duty:</strong> ${filteredReports.reduce((sum, r) => sum + r.staffCount, 0)}</p>
              <p><strong>Total OPD Cases:</strong> ${filteredReports.reduce((sum, r) => sum + r.opdCases, 0)}</p>
              <p><strong>Total Critical Cases:</strong> ${filteredReports.reduce((sum, r) => sum + r.rtaCases + r.mlcCases, 0)}</p>
              <p><strong>Total Referrals:</strong> ${filteredReports.reduce((sum, r) => sum + r.casesWithReferral, 0)}</p>
            </div>
          </body>
        </html>
      `

      // Write the HTML to the new window and trigger print
      printWindow.document.write(reportsHTML)
      printWindow.document.close()

      // Wait for resources to load then print
      setTimeout(() => {
        printWindow.print()
      }, 250)

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

  const handleEditReport = (report: Report) => {
    setEditingReport({ ...report })
  }

  const handleSaveEdit = () => {
    if (!editingReport) return

    setReports((prevReports) => prevReports.map((report) => (report.id === editingReport.id ? editingReport : report)))

    toast({
      title: "Report updated",
      description: "The report has been successfully updated",
    })

    setEditingReport(null)
  }

  const handleDeleteConfirm = (id: string) => {
    setReportToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const handleDelete = () => {
    if (!reportToDelete) return

    setReports((prevReports) => prevReports.filter((report) => report.id !== reportToDelete))

    toast({
      title: "Report deleted",
      description: "The report has been successfully deleted",
    })

    setDeleteConfirmOpen(false)
    setReportToDelete(null)
  }

  const handleInputChange = (field: keyof Report, value: any) => {
    if (!editingReport) return

    setEditingReport((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        [field]: value,
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
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

          <Select value={shift} onValueChange={setShift}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Shifts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Shifts</SelectItem>
              <SelectItem value="M">Morning</SelectItem>
              <SelectItem value="A">Afternoon</SelectItem>
              <SelectItem value="N">Night</SelectItem>
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
            Daily Reports - {format(date, "MMMM d, yyyy")}
            {user?.role !== "admin" && ` - ${user?.department}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead>Shift</TableHead>
                      <TableHead>Staff</TableHead>
                      <TableHead>MOs</TableHead>
                      <TableHead>Sick Leave</TableHead>
                      <TableHead>OPD</TableHead>
                      <TableHead>Short Stay</TableHead>
                      <TableHead>BH Ref.</TableHead>
                      <TableHead>RTA</TableHead>
                      <TableHead>MLC</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.length > 0 ? (
                      filteredReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.department}</TableCell>
                          <TableCell>{report.shift}</TableCell>
                          <TableCell>{report.staffCount}</TableCell>
                          <TableCell>{report.moCount}</TableCell>
                          <TableCell>{report.sickLeave}</TableCell>
                          <TableCell>{report.opdCases}</TableCell>
                          <TableCell>{report.shortStayCases}</TableCell>
                          <TableCell>{report.referralToBH}</TableCell>
                          <TableCell>{report.rtaCases}</TableCell>
                          <TableCell>{report.mlcCases}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => setSelectedReport(report)}>
                                View
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleEditReport(report)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteConfirm(report.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={11} className="text-center py-4">
                          No reports found for the selected filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="summary">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Staff on Duty</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {filteredReports.reduce((sum, r) => sum + r.staffCount, 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      MOs: {filteredReports.reduce((sum, r) => sum + r.moCount, 0)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total OPD Cases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{filteredReports.reduce((sum, r) => sum + r.opdCases, 0)}</div>
                    <p className="text-xs text-muted-foreground">
                      Short Stay: {filteredReports.reduce((sum, r) => sum + r.shortStayCases, 0)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Critical Cases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {filteredReports.reduce((sum, r) => sum + r.rtaCases + r.mlcCases, 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      RTA: {filteredReports.reduce((sum, r) => sum + r.rtaCases, 0)} | MLC:{" "}
                      {filteredReports.reduce((sum, r) => sum + r.mlcCases, 0)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {filteredReports.reduce((sum, r) => sum + r.casesWithReferral, 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      To BH: {filteredReports.reduce((sum, r) => sum + r.referralToBH, 0)} | From HHC:{" "}
                      {filteredReports.reduce((sum, r) => sum + r.referralFromHHC, 0)}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Report Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4 print:space-y-6">
              <h2 className="text-xl font-bold print:text-2xl print:mb-4">Report Details</h2>
              <div className="grid grid-cols-1 gap-6 print:gap-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th colSpan={4} className="text-left pb-2 border-b font-medium text-lg">
                        Basic Information
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 pr-4 font-medium">Department:</td>
                      <td className="py-2">{selectedReport.department}</td>
                      <td className="py-2 pr-4 font-medium">Shift:</td>
                      <td className="py-2">{selectedReport.shift}</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium">Staff Count:</td>
                      <td className="py-2">{selectedReport.staffCount}</td>
                      <td className="py-2 pr-4 font-medium">Medical Officers:</td>
                      <td className="py-2">{selectedReport.moCount}</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium">Staff on Sick Leave:</td>
                      <td className="py-2">{selectedReport.sickLeave}</td>
                      <td className="py-2 pr-4 font-medium"></td>
                      <td className="py-2"></td>
                    </tr>
                  </tbody>
                </table>

                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th colSpan={4} className="text-left pb-2 border-b font-medium text-lg">
                        Cases Information
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 pr-4 font-medium">OPD Cases:</td>
                      <td className="py-2">{selectedReport.opdCases}</td>
                      <td className="py-2 pr-4 font-medium">Short Stay Cases:</td>
                      <td className="py-2">{selectedReport.shortStayCases}</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium">RTA Cases:</td>
                      <td className="py-2">{selectedReport.rtaCases}</td>
                      <td className="py-2 pr-4 font-medium">MLC Cases:</td>
                      <td className="py-2">{selectedReport.mlcCases}</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium">Escort Cases:</td>
                      <td className="py-2">{selectedReport.escortCases}</td>
                      <td className="py-2 pr-4 font-medium">LAMA Cases:</td>
                      <td className="py-2">{selectedReport.lamaCases}</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium">Dressing Cases:</td>
                      <td className="py-2">{selectedReport.dressingCases}</td>
                      <td className="py-2 pr-4 font-medium"></td>
                      <td className="py-2"></td>
                    </tr>
                  </tbody>
                </table>

                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th colSpan={4} className="text-left pb-2 border-b font-medium text-lg">
                        Referrals
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 pr-4 font-medium">Referral to BH:</td>
                      <td className="py-2">{selectedReport.referralToBH}</td>
                      <td className="py-2 pr-4 font-medium">Referral from HHC:</td>
                      <td className="py-2">{selectedReport.referralFromHHC}</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium">Cases With Referral:</td>
                      <td className="py-2">{selectedReport.casesWithReferral}</td>
                      <td className="py-2 pr-4 font-medium">Cases Without Referral:</td>
                      <td className="py-2">{selectedReport.casesWithoutReferral}</td>
                    </tr>
                  </tbody>
                </table>

                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th colSpan={4} className="text-left pb-2 border-b font-medium text-lg">
                        Temperature Monitoring
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 pr-4 font-medium">Minimum Temperature:</td>
                      <td className="py-2">{selectedReport.fridgeMinTemp}°C</td>
                      <td className="py-2 pr-4 font-medium">Maximum Temperature:</td>
                      <td className="py-2">{selectedReport.fridgeMaxTemp}°C</td>
                    </tr>
                  </tbody>
                </table>

                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th colSpan={4} className="text-left pb-2 border-b font-medium text-lg">
                        Additional Information
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 pr-4 font-medium">Submitted By:</td>
                      <td className="py-2">{selectedReport.submittedBy}</td>
                      <td className="py-2 pr-4 font-medium">Submitted At:</td>
                      <td className="py-2">{selectedReport.submittedAt}</td>
                    </tr>
                    {selectedReport.notes && (
                      <tr>
                        <td className="py-2 pr-4 font-medium align-top">Notes:</td>
                        <td className="py-2" colSpan={3}>
                          <div className="whitespace-pre-wrap">{selectedReport.notes}</div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end gap-2 print:hidden">
                <Button
                  onClick={() => {
                    // Create a new window for printing
                    const printWindow = window.open("", "_blank")
                    if (!printWindow) {
                      toast({
                        title: "Print failed",
                        description: "Unable to open print window. Please check your browser settings.",
                        variant: "destructive",
                      })
                      return
                    }

                    // Generate the HTML content for printing
                    const reportHTML = `
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <title>Report Details</title>
                          <style>
                            body { 
                              font-family: Arial, sans-serif; 
                              margin: 20px; 
                              color: #333;
                            }
                            h1 { 
                              color: #2c3e50; 
                              margin-bottom: 10px;
                            }
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
                            .section-header {
                              font-size: 18px;
                              font-weight: bold;
                              margin-top: 20px;
                              margin-bottom: 10px;
                              border-bottom: 1px solid #ddd;
                              padding-bottom: 5px;
                            }
                            @media print {
                              body { 
                                margin: 0; 
                                padding: 20px;
                              }
                            }
                          </style>
                        </head>
                        <body>
                          <h1>Report Details - ${selectedReport?.department} (${selectedReport?.shift === "M" ? "Morning" : selectedReport?.shift === "A" ? "Afternoon" : "Night"} Shift)</h1>
                          
                          <div class="section-header">Basic Information</div>
                          <table>
                            <tr>
                              <td style="font-weight: bold; width: 25%">Department:</td>
                              <td style="width: 25%">${selectedReport?.department}</td>
                              <td style="font-weight: bold; width: 25%">Shift:</td>
                              <td style="width: 25%">${selectedReport?.shift === "M" ? "Morning" : selectedReport?.shift === "A" ? "Afternoon" : "Night"}</td>
                            </tr>
                            <tr>
                              <td style="font-weight: bold">Staff Count:</td>
                              <td>${selectedReport?.staffCount}</td>
                              <td style="font-weight: bold">Medical Officers:</td>
                              <td>${selectedReport?.moCount}</td>
                            </tr>
                            <tr>
                              <td style="font-weight: bold">Staff on Sick Leave:</td>
                              <td>${selectedReport?.sickLeave}</td>
                              <td style="font-weight: bold"></td>
                              <td></td>
                            </tr>
                          </table>
                          
                          <div class="section-header">Cases Information</div>
                          <table>
                            <tr>
                              <td style="font-weight: bold; width: 25%">OPD Cases:</td>
                              <td style="width: 25%">${selectedReport?.opdCases}</td>
                              <td style="font-weight: bold; width: 25%">Short Stay Cases:</td>
                              <td style="width: 25%">${selectedReport?.shortStayCases}</td>
                            </tr>
                            <tr>
                              <td style="font-weight: bold">RTA Cases:</td>
                              <td>${selectedReport?.rtaCases}</td>
                              <td style="font-weight: bold">MLC Cases:</td>
                              <td>${selectedReport?.mlcCases}</td>
                            </tr>
                            <tr>
                              <td style="font-weight: bold">Escort Cases:</td>
                              <td>${selectedReport?.escortCases}</td>
                              <td style="font-weight: bold">LAMA Cases:</td>
                              <td>${selectedReport?.lamaCases}</td>
                            </tr>
                            <tr>
                              <td style="font-weight: bold">Dressing Cases:</td>
                              <td>${selectedReport?.dressingCases}</td>
                              <td style="font-weight: bold"></td>
                              <td></td>
                            </tr>
                          </table>
                          
                          <div class="section-header">Referrals</div>
                          <table>
                            <tr>
                              <td style="font-weight: bold; width: 25%">Referral to BH:</td>
                              <td style="width: 25%">${selectedReport?.referralToBH}</td>
                              <td style="font-weight: bold; width: 25%">Referral from HHC:</td>
                              <td style="width: 25%">${selectedReport?.referralFromHHC}</td>
                            </tr>
                            <tr>
                              <td style="font-weight: bold">Cases With Referral:</td>
                              <td>${selectedReport?.casesWithReferral}</td>
                              <td style="font-weight: bold">Cases Without Referral:</td>
                              <td>${selectedReport?.casesWithoutReferral}</td>
                            </tr>
                          </table>
                          
                          <div class="section-header">Temperature Monitoring</div>
                          <table>
                            <tr>
                              <td style="font-weight: bold; width: 25%">Minimum Temperature:</td>
                              <td style="width: 25%">${selectedReport?.fridgeMinTemp}°C</td>
                              <td style="font-weight: bold; width: 25%">Maximum Temperature:</td>
                              <td style="width: 25%">${selectedReport?.fridgeMaxTemp}°C</td>
                            </tr>
                          </table>
                          
                          <div class="section-header">Additional Information</div>
                          <table>
                            <tr>
                              <td style="font-weight: bold; width: 25%">Submitted By:</td>
                              <td style="width: 25%">${selectedReport?.submittedBy}</td>
                              <td style="font-weight: bold; width: 25%">Submitted At:</td>
                              <td style="width: 25%">${selectedReport?.submittedAt}</td>
                            </tr>
                            ${
                              selectedReport?.notes
                                ? `
                            <tr>
                              <td style="font-weight: bold">Notes:</td>
                              <td colspan="3">${selectedReport?.notes}</td>
                            </tr>
                            `
                                : ""
                            }
                          </table>
                        </body>
                      </html>
                    `

                    // Write the HTML to the new window and trigger print
                    printWindow.document.write(reportHTML)
                    printWindow.document.close()

                    // Wait for resources to load then print
                    setTimeout(() => {
                      printWindow.print()
                    }, 250)
                  }}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print Details
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Report Dialog */}
      <Dialog open={!!editingReport} onOpenChange={(open) => !open && setEditingReport(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Report</DialogTitle>
          </DialogHeader>
          {editingReport && (
            <div className="grid gap-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="cases">Cases</TabsTrigger>
                  <TabsTrigger value="referrals">Referrals</TabsTrigger>
                  <TabsTrigger value="additional">Additional</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select
                        value={editingReport.department}
                        onValueChange={(value) => handleInputChange("department", value)}
                      >
                        <SelectTrigger id="department">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shift">Shift</Label>
                      <Select
                        value={editingReport.shift}
                        onValueChange={(value) => handleInputChange("shift", value as "M" | "A" | "N")}
                      >
                        <SelectTrigger id="shift">
                          <SelectValue placeholder="Select shift" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">Morning</SelectItem>
                          <SelectItem value="A">Afternoon</SelectItem>
                          <SelectItem value="N">Night</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="staffCount">Staff Count</Label>
                      <Input
                        id="staffCount"
                        type="number"
                        value={editingReport.staffCount}
                        onChange={(e) => handleInputChange("staffCount", Number.parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="moCount">Medical Officers</Label>
                      <Input
                        id="moCount"
                        type="number"
                        value={editingReport.moCount}
                        onChange={(e) => handleInputChange("moCount", Number.parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sickLeave">Staff on Sick Leave</Label>
                      <Input
                        id="sickLeave"
                        type="number"
                        value={editingReport.sickLeave}
                        onChange={(e) => handleInputChange("sickLeave", Number.parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="cases" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="opdCases">OPD Cases</Label>
                      <Input
                        id="opdCases"
                        type="number"
                        value={editingReport.opdCases}
                        onChange={(e) => handleInputChange("opdCases", Number.parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shortStayCases">Short Stay Cases</Label>
                      <Input
                        id="shortStayCases"
                        type="number"
                        value={editingReport.shortStayCases}
                        onChange={(e) => handleInputChange("shortStayCases", Number.parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rtaCases">RTA Cases</Label>
                      <Input
                        id="rtaCases"
                        type="number"
                        value={editingReport.rtaCases}
                        onChange={(e) => handleInputChange("rtaCases", Number.parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mlcCases">MLC Cases</Label>
                      <Input
                        id="mlcCases"
                        type="number"
                        value={editingReport.mlcCases}
                        onChange={(e) => handleInputChange("mlcCases", Number.parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="escortCases">Escort Cases</Label>
                      <Input
                        id="escortCases"
                        type="number"
                        value={editingReport.escortCases}
                        onChange={(e) => handleInputChange("escortCases", Number.parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lamaCases">LAMA Cases</Label>
                      <Input
                        id="lamaCases"
                        type="number"
                        value={editingReport.lamaCases}
                        onChange={(e) => handleInputChange("lamaCases", Number.parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dressingCases">Dressing Cases</Label>
                      <Input
                        id="dressingCases"
                        type="number"
                        value={editingReport.dressingCases}
                        onChange={(e) => handleInputChange("dressingCases", Number.parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="referrals" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="referralToBH">Referral to BH</Label>
                      <Input
                        id="referralToBH"
                        type="number"
                        value={editingReport.referralToBH}
                        onChange={(e) => handleInputChange("referralToBH", Number.parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="referralFromHHC">Referral from HHC</Label>
                      <Input
                        id="referralFromHHC"
                        type="number"
                        value={editingReport.referralFromHHC}
                        onChange={(e) => handleInputChange("referralFromHHC", Number.parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="casesWithReferral">Cases With Referral</Label>
                      <Input
                        id="casesWithReferral"
                        type="number"
                        value={editingReport.casesWithReferral}
                        onChange={(e) => handleInputChange("casesWithReferral", Number.parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="casesWithoutReferral">Cases Without Referral</Label>
                      <Input
                        id="casesWithoutReferral"
                        type="number"
                        value={editingReport.casesWithoutReferral}
                        onChange={(e) => handleInputChange("casesWithoutReferral", Number.parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="additional" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fridgeMinTemp">Minimum Temperature (°C)</Label>
                      <Input
                        id="fridgeMinTemp"
                        type="text"
                        value={editingReport.fridgeMinTemp}
                        onChange={(e) => handleInputChange("fridgeMinTemp", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fridgeMaxTemp">Maximum Temperature (°C)</Label>
                      <Input
                        id="fridgeMaxTemp"
                        type="text"
                        value={editingReport.fridgeMaxTemp}
                        onChange={(e) => handleInputChange("fridgeMaxTemp", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={editingReport.notes || ""}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      rows={4}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setEditingReport(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the report from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

