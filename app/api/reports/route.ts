import { NextResponse } from "next/server"
import { z } from "zod"

// Define the report schema
const reportSchema = z.object({
  date: z.string(),
  department: z.string(),
  shift: z.enum(["morning", "afternoon", "night"]),
  staffCount: z.number(),
  moCount: z.number(),
  opdCases: z.number(),
  referrals: z.number().optional(),
  rtaCases: z.number().optional(),
  mlcCases: z.number().optional(),
  escortCases: z.number().optional(),
  lamaCases: z.number().optional(),
  fridgeTemp: z.string().optional(),
  sickLeave: z.number().optional(),
  notes: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = reportSchema.parse(json)

    // In a real app, you would save this to your database
    console.log("Received report:", body)

    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({ success: true, message: "Report submitted successfully" })
  } catch (error) {
    console.error("Error submitting report:", error)
    return NextResponse.json({ success: false, message: "Failed to submit report" }, { status: 400 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get("date")
    const department = searchParams.get("department")
    const shift = searchParams.get("shift")

    // In a real app, you would fetch this from your database
    const reports = [
      {
        id: "1",
        date: new Date().toISOString(),
        department: "RESUS",
        shift: "Morning",
        staffCount: 5,
        moCount: 2,
        opdCases: 32,
        referrals: 4,
        rtaCases: 3,
        mlcCases: 2,
        escortCases: 1,
        lamaCases: 0,
        submittedBy: "Dr. John Smith",
        submittedAt: "08:45 AM",
      },
      // Add more mock data here
    ]

    // Filter reports based on query parameters
    let filteredReports = reports
    if (date) {
      filteredReports = filteredReports.filter((r) => r.date.startsWith(date))
    }
    if (department && department !== "all") {
      filteredReports = filteredReports.filter((r) => r.department === department)
    }
    if (shift && shift !== "all") {
      filteredReports = filteredReports.filter((r) => r.shift === shift)
    }

    return NextResponse.json({ success: true, data: filteredReports })
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch reports" }, { status: 500 })
  }
}

