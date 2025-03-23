import { jsPDF } from "jspdf"
import type { UserConfig } from "jspdf-autotable"
import * as XLSX from "xlsx"
import { format } from "date-fns"
import type { MonthlyReportData } from "@/components/monthly-reports-view"

// Extend the jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: UserConfig) => jsPDF
  }
}

export type ReportData = {
  id: string
  date: Date
  department: string
  shift: string
  staffCount: number
  moCount: number
  opdCases: number
  referrals: number
  rtaCases: number
  mlcCases: number
  escortCases: number
  lamaCases: number
  submittedBy: string
  submittedAt: string
}

export function exportToPDF(data: ReportData[], title: string) {
  // Initialize PDF document
  const doc = new jsPDF()

  // Add title
  doc.setFontSize(16)
  doc.text(title, 14, 15)
  doc.setFontSize(10)
  doc.text(`Generated on ${format(new Date(), "PPP")}`, 14, 25)

  // Define the columns
  const columns = [
    { header: "Department", dataKey: "department" },
    { header: "Shift", dataKey: "shift" },
    { header: "Staff", dataKey: "staffCount" },
    { header: "MOs", dataKey: "moCount" },
    { header: "OPD", dataKey: "opdCases" },
    { header: "Referrals", dataKey: "referrals" },
    { header: "RTA", dataKey: "rtaCases" },
    { header: "MLC", dataKey: "mlcCases" },
    { header: "Escort", dataKey: "escortCases" },
    { header: "LAMA", dataKey: "lamaCases" },
  ]

  // Prepare the data
  const tableData = data.map((item) => ({
    department: item.department,
    shift: item.shift,
    staffCount: item.staffCount,
    moCount: item.moCount,
    opdCases: item.opdCases,
    referrals: item.referrals,
    rtaCases: item.rtaCases,
    mlcCases: item.mlcCases,
    escortCases: item.escortCases,
    lamaCases: item.lamaCases,
  }))

  // Add the table
  doc.autoTable({
    startY: 35,
    head: [columns.map((col) => col.header)],
    body: tableData.map((row) => columns.map((col) => row[col.dataKey as keyof typeof row])),
    theme: "grid",
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontSize: 10,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { top: 35 },
  })

  // Save the PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, "-")}-${format(new Date(), "yyyy-MM-dd")}.pdf`)
}

export function exportToExcel(data: ReportData[], title: string) {
  // Prepare the data for Excel
  const excelData = data.map((item) => ({
    Date: format(new Date(item.date), "PPP"),
    Department: item.department,
    Shift: item.shift,
    "Staff Count": item.staffCount,
    "Medical Officers": item.moCount,
    "OPD Cases": item.opdCases,
    Referrals: item.referrals,
    "RTA Cases": item.rtaCases,
    "MLC Cases": item.mlcCases,
    "Escort Cases": item.escortCases,
    "LAMA Cases": item.lamaCases,
    "Submitted By": item.submittedBy,
    "Submitted At": item.submittedAt,
  }))

  // Create a new workbook
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(excelData)

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, "Report")

  // Save the file
  XLSX.writeFile(wb, `${title.toLowerCase().replace(/\s+/g, "-")}-${format(new Date(), "yyyy-MM-dd")}.xlsx`)
}

// Update the printReport function to use a better table layout
export function printReport(data: ReportData[], title: string) {
  // Create a new window for printing
  const printWindow = window.open("", "_blank")
  if (!printWindow) return

  // Generate the HTML content
  const html = `
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
          .date {
            color: #666;
            margin-bottom: 20px;
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
            background-color: #2980b9; 
            color: white; 
          }
          tr:nth-child(even) { 
            background-color: #f9f9f9; 
          }
          .summary {
            margin-top: 30px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 4px;
          }
          .summary h2 {
            color: #2c3e50;
            margin-bottom: 15px;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
          }
          .summary-item {
            padding: 10px;
          }
          .summary-item h3 {
            font-size: 14px;
            color: #666;
            margin: 0 0 5px 0;
          }
          .summary-item p {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
            margin: 0;
          }
          .report-details {
            margin-top: 30px;
          }
          .report-details h2 {
            color: #2c3e50;
            margin-bottom: 15px;
          }
          .detail-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .detail-table th {
            text-align: left;
            padding: 8px;
            border-bottom: 2px solid #ddd;
            font-size: 16px;
            font-weight: bold;
            background-color: #f8f9fa;
            color: #2c3e50;
          }
          .detail-table td {
            padding: 8px;
            border: none;
          }
          .detail-table tr td:first-child {
            font-weight: bold;
            width: 30%;
          }
          @media print {
            body { 
              margin: 0; 
              padding: 20px;
            }
            button { 
              display: none; 
            }
            table { 
              page-break-inside: auto; 
            }
            tr { 
              page-break-inside: avoid; 
              page-break-after: auto; 
            }
            thead { 
              display: table-header-group; 
            }
            .summary, .report-details {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="date">Generated on ${format(new Date(), "PPP")}</div>
        
        <table>
          <thead>
            <tr>
              <th>Department</th>
              <th>Shift</th>
              <th>Staff</th>
              <th>MOs</th>
              <th>OPD</th>
              <th>Referrals</th>
              <th>RTA</th>
              <th>MLC</th>
              <th>Escort</th>
              <th>LAMA</th>
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (item) => `
              <tr>
                <td>${item.department}</td>
                <td>${item.shift}</td>
                <td>${item.staffCount}</td>
                <td>${item.moCount}</td>
                <td>${item.opdCases}</td>
                <td>${item.referrals}</td>
                <td>${item.rtaCases}</td>
                <td>${item.mlcCases}</td>
                <td>${item.escortCases}</td>
                <td>${item.lamaCases}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        
        <div class="summary">
          <h2>Summary</h2>
          <div class="summary-grid">
            <div class="summary-item">
              <h3>Total OPD Cases</h3>
              <p>${data.reduce((sum, item) => sum + item.opdCases, 0)}</p>
            </div>
            <div class="summary-item">
              <h3>Total Referrals</h3>
              <p>${data.reduce((sum, item) => sum + item.referrals, 0)}</p>
            </div>
            <div class="summary-item">
              <h3>Total RTA Cases</h3>
              <p>${data.reduce((sum, item) => sum + item.rtaCases, 0)}</p>
            </div>
            <div class="summary-item">
              <h3>Total Staff on Duty</h3>
              <p>${data.reduce((sum, item) => sum + item.staffCount, 0)}</p>
            </div>
          </div>
        </div>
        
        ${
          data.length === 1
            ? `
        <div class="report-details">
          <h2>Detailed Report - ${data[0].department} (${data[0].shift} Shift)</h2>
          
          <table class="detail-table">
            <tr><th colspan="4">Basic Information</th></tr>
            <tr>
              <td>Department:</td>
              <td>${data[0].department}</td>
              <td>Shift:</td>
              <td>${data[0].shift}</td>
            </tr>
            <tr>
              <td>Staff Count:</td>
              <td>${data[0].staffCount}</td>
              <td>Medical Officers:</td>
              <td>${data[0].moCount}</td>
            </tr>
          </table>
          
          <table class="detail-table">
            <tr><th colspan="4">Cases Information</th></tr>
            <tr>
              <td>OPD Cases:</td>
              <td>${data[0].opdCases}</td>
              <td>Referrals:</td>
              <td>${data[0].referrals}</td>
            </tr>
            <tr>
              <td>RTA Cases:</td>
              <td>${data[0].rtaCases}</td>
              <td>MLC Cases:</td>
              <td>${data[0].mlcCases}</td>
            </tr>
            <tr>
              <td>Escort Cases:</td>
              <td>${data[0].escortCases}</td>
              <td>LAMA Cases:</td>
              <td>${data[0].lamaCases}</td>
            </tr>
          </table>
          
          <table class="detail-table">
            <tr><th colspan="2">Additional Information</th></tr>
            <tr>
              <td>Submitted By:</td>
              <td>${data[0].submittedBy}</td>
            </tr>
            <tr>
              <td>Submitted At:</td>
              <td>${data[0].submittedAt}</td>
            </tr>
          </table>
        </div>
        `
            : ""
        }
        
        <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background-color: #2980b9; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Print Report
        </button>
      </body>
    </html>
  `

  // Write the HTML to the new window and trigger print
  printWindow.document.write(html)
  printWindow.document.close()

  // Wait for resources to load then print
  setTimeout(() => {
    printWindow.print()
  }, 250)
}

export type NotesReport = {
  id: string
  date: Date
  department: string
  shift: string
  notes: string
  submittedBy: string
  submittedAt: string
}

export function exportNotesToPDF(data: NotesReport[], title: string) {
  const doc = new jsPDF()

  // Add title
  doc.setFontSize(16)
  doc.text(title, 14, 15)
  doc.setFontSize(10)
  doc.text(`Generated on ${format(new Date(), "PPP")}`, 14, 25)

  // Define the columns
  const columns = [
    { header: "Department", dataKey: "department" },
    { header: "Shift", dataKey: "shift" },
    { header: "Notes", dataKey: "notes" },
    { header: "Submitted By", dataKey: "submittedBy" },
    { header: "Time", dataKey: "submittedAt" },
  ]

  // Add the table
  doc.autoTable({
    startY: 35,
    head: [columns.map((col) => col.header)],
    body: data.map((row) => columns.map((col) => row[col.dataKey as keyof typeof row])),
    theme: "grid",
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontSize: 10,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 9,
    },
    columnStyles: {
      notes: { cellWidth: 80 }, // Make notes column wider
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { top: 35 },
  })

  // Save the PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, "-")}-${format(new Date(), "yyyy-MM-dd")}.pdf`)
}

export function exportNotesToExcel(data: NotesReport[], title: string) {
  // Prepare the data for Excel
  const excelData = data.map((item) => ({
    Date: format(new Date(item.date), "PPP"),
    Department: item.department,
    Shift: item.shift,
    Notes: item.notes,
    "Submitted By": item.submittedBy,
    "Submitted At": item.submittedAt,
  }))

  // Create a new workbook
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(excelData)

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, "Notes")

  // Save the file
  XLSX.writeFile(wb, `${title.toLowerCase().replace(/\s+/g, "-")}-${format(new Date(), "yyyy-MM-dd")}.xlsx`)
}

export function printNotesReport(data: NotesReport[], title: string) {
  // Create a new window for printing
  const printWindow = window.open("", "_blank")
  if (!printWindow) return

  // Generate the HTML content
  const html = `
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
          .date {
            color: #666;
            margin-bottom: 20px;
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
            background-color: #2980b9; 
            color: white; 
          }
          tr:nth-child(even) { 
            background-color: #f9f9f9; 
          }
          .notes {
            white-space: pre-wrap;
            max-width: 400px;
          }
          @media print {
            body { 
              margin: 0; 
              padding: 20px;
            }
            button { 
              display: none; 
            }
            table { 
              page-break-inside: auto; 
            }
            tr { 
              page-break-inside: avoid; 
            }
            thead { 
              display: table-header-group; 
            }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="date">Generated on ${format(new Date(), "PPP")}</div>
        
        <table>
          <thead>
            <tr>
              <th>Department</th>
              <th>Shift</th>
              <th>Notes</th>
              <th>Submitted By</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (item) => `
              <tr>
                <td>${item.department}</td>
                <td>${item.shift}</td>
                <td class="notes">${item.notes}</td>
                <td>${item.submittedBy}</td>
                <td>${item.submittedAt}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        
        <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background-color: #2980b9; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Print Report
        </button>
      </body>
    </html>
  `

  // Write the HTML to the new window and trigger print
  printWindow.document.write(html)
  printWindow.document.close()
}

export function exportMonthlyToPDF(data: MonthlyReportData[], title: string, dateRange: { from: Date; to: Date }) {
  const doc = new jsPDF()

  // Add title and date range
  doc.setFontSize(16)
  doc.text(title, 14, 15)
  doc.setFontSize(10)
  doc.text(`Generated on ${format(new Date(), "PPP")}`, 14, 25)
  doc.text(`Report Period: ${format(dateRange.from, "PPP")} to ${format(dateRange.to, "PPP")}`, 14, 30)

  // Add summary section
  const totalOPD = data.reduce((sum, item) => sum + item.opdCases, 0)
  const totalStaff = data.reduce((sum, item) => sum + item.staffCount, 0)
  const totalRTA = data.reduce((sum, item) => sum + item.rtaCases, 0)
  const totalMLC = data.reduce((sum, item) => sum + item.mlcCases, 0)
  const totalReferrals = data.reduce((sum, item) => sum + item.casesWithReferral, 0)

  doc.setFontSize(12)
  doc.text("Summary", 14, 40)
  doc.setFontSize(10)
  doc.text(`Total Staff: ${totalStaff}`, 14, 50)
  doc.text(`Total OPD Cases: ${totalOPD}`, 14, 55)
  doc.text(`Total Critical Cases: ${totalRTA + totalMLC} (RTA: ${totalRTA}, MLC: ${totalMLC})`, 14, 60)
  doc.text(`Total Referrals: ${totalReferrals}`, 14, 65)

  // Define the columns for the department-wise table
  const columns = [
    { header: "Department", dataKey: "department" },
    { header: "OPD Cases", dataKey: "opdCases" },
    { header: "Staff", dataKey: "staffCount" },
    { header: "RTA Cases", dataKey: "rtaCases" },
    { header: "MLC Cases", dataKey: "mlcCases" },
    { header: "Referrals", dataKey: "casesWithReferral" },
  ]

  // Add the department-wise table
  doc.autoTable({
    startY: 75,
    head: [columns.map((col) => col.header)],
    body: data.map((row) => columns.map((col) => row[col.dataKey as keyof typeof row])),
    theme: "grid",
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontSize: 10,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  })

  // Add a footer with page numbers
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" },
    )
  }

  // Save the PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, "-")}-${format(new Date(), "yyyy-MM-dd")}.pdf`)
}

export function exportMonthlyToExcel(data: MonthlyReportData[], title: string, dateRange: { from: Date; to: Date }) {
  // Calculate summary data
  const totalOPD = data.reduce((sum, item) => sum + item.opdCases, 0)
  const totalReferrals = data.reduce((sum, item) => sum + item.referrals, 0)
  const totalRTA = data.reduce((sum, item) => sum + item.rtaCases, 0)
  const avgDailyPatients = Math.round(totalOPD / 30)

  // Prepare the summary data
  const summaryData = [
    ["Report Period", `${format(dateRange.from, "PPP")} to ${format(dateRange.to, "PPP")}`],
    ["Generated On", format(new Date(), "PPP")],
    [""],
    ["Summary"],
    ["Total OPD Cases", totalOPD],
    ["Total Referrals", totalReferrals],
    ["Total RTA Cases", totalRTA],
    ["Average Daily Patients", avgDailyPatients],
    [""],
    ["Department-wise Statistics"],
  ]

  // Prepare the department data
  const departmentData = data.map((item) => ({
    Department: item.department,
    "OPD Cases": item.opdCases,
    Referrals: item.referrals,
    "RTA Cases": item.rtaCases,
    "MLC Cases": item.mlcCases,
    "Escort Cases": item.escortCases,
    "LAMA Cases": item.lamaCases,
    "Staff Count": item.staffCount,
    "Medical Officers": item.moCount,
  }))

  // Create a new workbook
  const wb = XLSX.utils.book_new()

  // Add summary worksheet
  const summaryWS = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(wb, summaryWS, "Summary")

  // Add department data worksheet
  const deptWS = XLSX.utils.json_to_sheet(departmentData)
  XLSX.utils.book_append_sheet(wb, deptWS, "Department Statistics")

  // Save the file
  XLSX.writeFile(wb, `${title.toLowerCase().replace(/\s+/g, "-")}-${format(new Date(), "yyyy-MM-dd")}.xlsx`)
}

// Update the printMonthlyReport function to use a better table layout
export function printMonthlyReport(data: MonthlyReportData[], title: string, dateRange: { from: Date; to: Date }) {
  // Create a new window for printing
  const printWindow = window.open("", "_blank")
  if (!printWindow) return

  // Calculate summary data
  const totalOPD = data.reduce((sum, item) => sum + item.opdCases, 0)
  const totalStaff = data.reduce((sum, item) => sum + item.staffCount, 0)
  const totalRTA = data.reduce((sum, item) => sum + item.rtaCases, 0)
  const totalMLC = data.reduce((sum, item) => sum + item.mlcCases, 0)
  const totalReferrals = data.reduce((sum, item) => sum + item.casesWithReferral, 0)

  // Generate the HTML content
  const html = `
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
          h2 {
            color: #2c3e50;
            margin-top: 30px;
            margin-bottom: 15px;
          }
          .date {
            color: #666;
            margin-bottom: 20px;
          }
          .summary {
            margin: 20px 0;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 4px;
            page-break-inside: avoid;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 15px;
          }
          .summary-item {
            padding: 10px;
          }
          .summary-item h3 {
            font-size: 14px;
            color: #666;
            margin: 0 0 5px 0;
          }
          .summary-item p {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
            margin: 0;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px; 
            font-size: 14px;
            page-break-inside: auto;
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 12px 8px; 
            text-align: left; 
          }
          th { 
            background-color: #2980b9; 
            color: white; 
            font-weight: bold;
          }
          tr:nth-child(even) { 
            background-color: #f9f9f9; 
          }
          tr.total-row {
            font-weight: bold;
            background-color: #f2f2f2;
          }
          .department-details {
            margin-top: 30px;
            page-break-inside: avoid;
          }
          .department-card {
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-bottom: 20px;
            page-break-inside: avoid;
          }
          .department-header {
            background-color: #f8f9fa;
            padding: 15px;
            border-bottom: 1px solid #ddd;
            font-weight: bold;
            font-size: 18px;
          }
          .department-content {
            padding: 15px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }
          .stat-group {
            margin-bottom: 15px;
          }
          .stat-group h4 {
            margin: 0 0 10px 0;
            color: #2c3e50;
            font-size: 16px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
          }
          .stat-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          }
          .stat-label {
            font-weight: normal;
          }
          .stat-value {
            font-weight: bold;
          }
          @media print {
            body { 
              margin: 0; 
              padding: 20px;
            }
            button { 
              display: none; 
            }
            table { 
              break-inside: auto; 
            }
            tr { 
              break-inside: avoid; 
            }
            thead { 
              display: table-header-group; 
            }
            .department-card {
              break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="date">Generated on ${format(new Date(), "PPP")}</div>
        <div class="date">Report Period: ${format(dateRange.from, "PPP")} to ${format(dateRange.to, "PPP")}</div>
        
        <div class="summary">
          <h2>Summary</h2>
          <div class="summary-grid">
            <div class="summary-item">
              <h3>Total Staff</h3>
              <p>${totalStaff}</p>
            </div>
            <div class="summary-item">
              <h3>Total OPD Cases</h3>
              <p>${totalOPD}</p>
            </div>
            <div class="summary-item">
              <h3>Total Critical Cases</h3>
              <p>${totalRTA + totalMLC}</p>
              <span>RTA: ${totalRTA} | MLC: ${totalMLC}</span>
            </div>
            <div class="summary-item">
              <h3>Total Referrals</h3>
              <p>${totalReferrals}</p>
            </div>
          </div>
        </div>
        
        <h2>Department Statistics</h2>
        <table>
          <thead>
            <tr>
              <th>Department</th>
              <th>OPD Cases</th>
              <th>Staff</th>
              <th>MOs</th>
              <th>RTA Cases</th>
              <th>MLC Cases</th>
              <th>Referrals</th>
              <th>Short Stay</th>
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (item) => `
              <tr>
                <td>${item.department}</td>
                <td>${item.opdCases}</td>
                <td>${item.staffCount}</td>
                <td>${item.moCount}</td>
                <td>${item.rtaCases}</td>
                <td>${item.mlcCases}</td>
                <td>${item.casesWithReferral}</td>
                <td>${item.shortStayCases}</td>
              </tr>
            `,
              )
              .join("")}
            <tr class="total-row">
              <td>TOTAL</td>
              <td>${data.reduce((sum, item) => sum + item.opdCases, 0)}</td>
              <td>${data.reduce((sum, item) => sum + item.staffCount, 0)}</td>
              <td>${data.reduce((sum, item) => sum + item.moCount, 0)}</td>
              <td>${data.reduce((sum, item) => sum + item.rtaCases, 0)}</td>
              <td>${data.reduce((sum, item) => sum + item.mlcCases, 0)}</td>
              <td>${data.reduce((sum, item) => sum + item.casesWithReferral, 0)}</td>
              <td>${data.reduce((sum, item) => sum + item.shortStayCases, 0)}</td>
            </tr>
          </tbody>
        </table>
        
        <h2>Department Details</h2>
        <div class="department-details">
          ${data
            .map(
              (item) => `
            <div class="department-card">
              <div class="department-header">${item.department}</div>
              <div class="department-content">
                <div>
                  <div class="stat-group">
                    <h4>Staff Information</h4>
                    <div class="stat-item">
                      <span class="stat-label">Total Staff:</span>
                      <span class="stat-value">${item.staffCount}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Medical Officers:</span>
                      <span class="stat-value">${item.moCount}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Staff on Sick Leave:</span>
                      <span class="stat-value">${item.sickLeave}</span>
                    </div>
                  </div>
                  
                  <div class="stat-group">
                    <h4>Patient Cases</h4>
                    <div class="stat-item">
                      <span class="stat-label">OPD Cases:</span>
                      <span class="stat-value">${item.opdCases}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Short Stay Cases:</span>
                      <span class="stat-value">${item.shortStayCases}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div class="stat-group">
                    <h4>Critical Cases</h4>
                    <div class="stat-item">
                      <span class="stat-label">RTA Cases:</span>
                      <span class="stat-value">${item.rtaCases}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">MLC Cases:</span>
                      <span class="stat-value">${item.mlcCases}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Escort Cases:</span>
                      <span class="stat-value">${item.escortCases}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">LAMA Cases:</span>
                      <span class="stat-value">${item.lamaCases}</span>
                    </div>
                  </div>
                  
                  <div class="stat-group">
                    <h4>Referrals</h4>
                    <div class="stat-item">
                      <span class="stat-label">Referral to BH:</span>
                      <span class="stat-value">${item.referralToBH}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Referral from HHC:</span>
                      <span class="stat-value">${item.referralFromHHC}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Cases With Referral:</span>
                      <span class="stat-value">${item.casesWithReferral}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Cases Without Referral:</span>
                      <span class="stat-value">${item.casesWithoutReferral}</span>
                    </div>
                  </div>
                  <div class="stat-group">
                    <h4>Temperature Monitoring</h4>
                    <div class="stat-item">
                      <span class="stat-label">Minimum Temperature:</span>
                      <span class="stat-value">${item.avgFridgeMinTemp}°C</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-label">Maximum Temperature:</span>
                      <span class="stat-value">${item.avgFridgeMaxTemp}°C</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
        
        <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background-color: #2980b9; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Print Report
        </button>
      </body>
    </html>
  `

  // Write the HTML to the new window and trigger print
  printWindow.document.write(html)
  printWindow.document.close()

  // Wait for resources to load then print
  setTimeout(() => {
    printWindow.print()
  }, 250)
}

