import { SettingsView } from "@/components/settings-view"

export default function SettingsPage() {
  return (
    <div className="p-6 w-full h-full">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>
      <SettingsView />
    </div>
  )
}

