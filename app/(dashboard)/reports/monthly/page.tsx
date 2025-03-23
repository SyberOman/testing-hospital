import { MonthlyReportsView } from "@/components/monthly-reports-view"

export default function MonthlyReports() {
  return (
    <div className="p-6 print:p-0 print:m-0 w-full h-full" id="monthly-reports-container">
      <h1 className="text-2xl font-bold mb-6 print:text-3xl print:mb-8">Monthly Statistics</h1>
      <MonthlyReportsView />
    </div>
  )
}

