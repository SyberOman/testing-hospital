"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, Download, Printer } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/components/auth-provider"

type NotesReport = {
  id: string
  date: Date
  department: string
  shift: string
  notes: string
  submittedBy: string
  submittedAt: string
}

export function NotesReportsView() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [date, setDate] = useState<Date>(new Date())
  const [department, setDepartment] = useState<string>(user?.role === "admin" ? "all" : user?.department || "")
  const [shift, setShift] = useState<string>("all")
  const [isExporting, setIsExporting] = useState(false)
  const [selectedNote, setSelectedNote] = useState<NotesReport | null>(null)

  // Reset department filter when user changes
  useEffect(() => {
    if (user) {
      setDepartment(user.role === "admin" ? "all" : user.department || "")
    }
  }, [user])

  // Mock data for notes reports
  const reports: NotesReport[] = [
    {
      id: "1",
      date: new Date(),
      department: "RESUS",
      shift: "Morning",
      notes: "Equipment maintenance required for ventilator #3. Temporary replacement in use. Service team notified.",
      submittedBy: "Dr. John Smith",
      submittedAt: "08:45 AM",
    },
    {
      id: "2",
      date: new Date(),
      department: "POPD",
      shift: "Morning",
      notes: "Shortage of pediatric nebulizer masks. Order placed. Expected delivery tomorrow.",
      submittedBy: "Dr. Sarah Johnson",
      submittedAt: "09:15 AM",
    },
    {
      id: "3",
      date: new Date(),
      department: "DERMA",
      shift: "Morning",
      notes: "UV therapy unit scheduled for calibration next week. Appointments adjusted accordingly.",
      submittedBy: "Dr. Michael Brown",
      submittedAt: "09:30 AM",
    },
    {
      id: "4",
      date: new Date(),
      department: "ORTHO",
      shift: "Afternoon",
      notes: "New physiotherapy equipment installation completed. Staff training scheduled for tomorrow.",
      submittedBy: "Dr. Emily Davis",
      submittedAt: "02:00 PM",
    },
    {
      id: "5",
      date: new Date(),
      department: "RESUS",
      shift: "Night",
      notes: "Emergency power backup test conducted successfully. All systems operational.",
      submittedBy: "Dr. Robert Wilson",
      submittedAt: "11:45 PM",
    },
  ]

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
      const title = `Notes Reports - ${format(date, "MMMM d, yyyy")}`

      if (type === "pdf") {
        // await exportNotesToPDF(filteredReports, title)
        // TODO: Implement PDF export
      } else {
        // await exportNotesToExcel(filteredReports, title)
        // TODO: Implement Excel export
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

  const handlePrintNotes = () => {
    try {
      const title = `Notes Reports - ${format(date, "MMMM d, yyyy")}`
      //printNotesReport(filteredReports, title)

      toast({
        title: "Print successful",
        description: "The notes report has been sent to the printer",
      })
    } catch (error) {
      console.error("Print error:", error)
      toast({
        title: "Print failed",
        description: "There was an error preparing the notes for printing",
        variant: "destructive",
      })
    }
  }

  const handlePrint = () => {
    try {
      const title = `Notes Reports - ${format(date, "MMMM d, yyyy")}`
      // printNotesReport(filteredReports, title)
      // TODO: Implement print functionality
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
              <SelectItem value="Morning">Morning</SelectItem>
              <SelectItem value="Afternoon">Afternoon</SelectItem>
              <SelectItem value="Night">Night</SelectItem>
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
            Notes Reports - {format(date, "MMMM d, yyyy")}
            {user?.role !== "admin" && ` - ${user?.department}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead className="w-[40%]">Notes</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.department}</TableCell>
                    <TableCell>{report.shift}</TableCell>
                    <TableCell className="max-w-[400px]">
                      <div className="truncate">{report.notes}</div>
                    </TableCell>
                    <TableCell>{report.submittedBy}</TableCell>
                    <TableCell>{report.submittedAt}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedNote(report)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No notes found for the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Note Details</DialogTitle>
          </DialogHeader>
          {selectedNote && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Department:</div>
                <div>{selectedNote.department}</div>
                <div className="font-medium">Shift:</div>
                <div>{selectedNote.shift}</div>
                <div className="font-medium">Submitted By:</div>
                <div>{selectedNote.submittedBy}</div>
                <div className="font-medium">Time:</div>
                <div>{selectedNote.submittedAt}</div>
              </div>
              <div>
                <div className="font-medium mb-2">Notes:</div>
                <div className="whitespace-pre-wrap">{selectedNote.notes}</div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => window.print()}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Note
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

