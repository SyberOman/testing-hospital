import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ContentHeader } from "@/components/content-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col w-full">
          <ContentHeader />
          <main className="flex-1 overflow-auto w-full h-full">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

