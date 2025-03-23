"use client"

import type React from "react"

import { useAuth } from "@/components/auth-provider"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading) {
      // If not logged in and not on login page, redirect to login
      if (!user && pathname !== "/") {
        router.push("/")
      }

      // If logged in and on login page, redirect to dashboard
      if (user && pathname === "/") {
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, router, pathname])

  // Show nothing while checking auth status
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  // On login page, or logged in on protected page
  if ((pathname === "/" && !user) || (pathname !== "/" && user)) {
    return <>{children}</>
  }

  // Don't render anything while redirecting
  return null
}

