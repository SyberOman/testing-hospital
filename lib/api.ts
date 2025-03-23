import type { ReportData } from "./export-utils"

export async function submitReport(data: any) {
  const response = await fetch("/api/reports", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to submit report")
  }

  return response.json()
}

export async function fetchReports(params: {
  date?: string
  department?: string
  shift?: string
}) {
  const searchParams = new URLSearchParams()
  if (params.date) searchParams.set("date", params.date)
  if (params.department) searchParams.set("department", params.department)
  if (params.shift) searchParams.set("shift", params.shift)

  const response = await fetch(`/api/reports?${searchParams.toString()}`)

  if (!response.ok) {
    throw new Error("Failed to fetch reports")
  }

  const data = await response.json()
  return data.data as ReportData[]
}

