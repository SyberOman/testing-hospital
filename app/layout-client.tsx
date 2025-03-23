"use client"

import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ContentHeader } from "@/components/content-header"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import { usePathname } from "next/navigation"

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/"

  return (
    <AuthProvider>
      {isLoginPage ? (
        <div>{children}</div>
      ) : (
        <SidebarProvider>
          <div className="flex h-screen">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <ContentHeader />
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
          </div>
        </SidebarProvider>
      )}
      <Toaster />
    </AuthProvider>
  )
}

