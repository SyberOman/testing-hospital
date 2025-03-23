import { AnalyticsView } from "@/components/analytics-view"

export default function AnalyticsPage() {
  return (
    <div className="p-6 w-full h-full">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      <AnalyticsView
        exportOptions={{
          pdf: { includeCharts: true, includeAllData: true },
          excel: { tabularDataOnly: true },
        }}
      />
    </div>
  )
}

