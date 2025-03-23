"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { User, UserRole, Privilege } from "@/lib/types"
import { MASTER_ADMIN } from "@/lib/config"
import { PasswordChangeDialog } from "@/components/password-change-dialog"

type AuthContextType = {
  user: (User & { profileImage?: string }) | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  checkAccess: (allowedRoles?: UserRole[]) => boolean
  hasPrivilege: (privilege: Privilege) => boolean
  updateUser: (updatedUser: User & { profileImage?: string }) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database - in a real app, this would come from a backend API
const mockUsers: User[] = [
  {
    id: "1",
    username: "administrator",
    name: "Master Admin",
    email: "master@hospital.admin",
    role: "admin",
    department: undefined,
    status: "active",
    requirePasswordChange: false,
    lastPasswordChange: new Date().toISOString(),
    privileges: [
      "manage_users",
      "view_all_departments",
      "manage_departments",
      "view_all_reports",
      "manage_settings",
      "export_data",
      "view_analytics",
      "reset_passwords",
    ],
  },
  {
    id: "2",
    username: "resus_head",
    name: "Dr. John Doe",
    email: "john@hospital.com",
    role: "department_head",
    department: "RESUS Department",
    status: "active",
    requirePasswordChange: true,
    privileges: [
      "view_department",
      "manage_department_staff",
      "submit_report",
      "view_department_reports",
      "export_department_data",
    ],
  },
  {
    id: "3",
    username: "popd_head",
    name: "Dr. Jane Smith",
    email: "jane@hospital.com",
    role: "department_head",
    department: "POPD Department",
    status: "active",
    requirePasswordChange: true,
    privileges: [
      "view_department",
      "manage_department_staff",
      "submit_report",
      "view_department_reports",
      "export_department_data",
    ],
  },
  {
    id: "4",
    username: "resus_staff1",
    name: "Nurse Robert Chen",
    email: "robert@hospital.com",
    role: "staff",
    department: "RESUS Department",
    status: "active",
    requirePasswordChange: true,
    privileges: ["view_department", "submit_report", "view_own_reports"],
  },
  {
    id: "5",
    username: "popd_staff1",
    name: "Nurse Maria Garcia",
    email: "maria@hospital.com",
    role: "staff",
    department: "POPD Department",
    status: "active",
    requirePasswordChange: true,
    privileges: ["view_department", "submit_report", "view_own_reports"],
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<(User & { profileImage?: string }) | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      if (parsedUser.requirePasswordChange) {
        setShowPasswordChange(true)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    setIsLoading(true)
    try {
      // Check for master admin
      if (username === MASTER_ADMIN.username && password === MASTER_ADMIN.password) {
        const masterUser: User = {
          id: "master",
          username: MASTER_ADMIN.username,
          name: "Master Admin",
          role: "admin",
          status: "active",
          lastPasswordChange: new Date().toISOString(),
          privileges: [
            "manage_users",
            "view_all_departments",
            "manage_departments",
            "view_all_reports",
            "manage_settings",
            "export_data",
            "view_analytics",
            "reset_passwords",
          ],
        }
        setUser(masterUser)
        localStorage.setItem("user", JSON.stringify(masterUser))
        router.push("/admin/dashboard")
        return
      }

      // Find user in the mock database
      const foundUser = mockUsers.find((user) => user.username === username)

      if (!foundUser) {
        throw new Error("Invalid username or password")
      }

      // In a real app, you would verify the password here
      // For demo purposes, we'll just accept any password

      setUser(foundUser)
      localStorage.setItem("user", JSON.stringify(foundUser))

      if (foundUser.requirePasswordChange) {
        setShowPasswordChange(true)
      } else {
        router.push(foundUser.role === "admin" ? "/admin/dashboard" : "/dashboard")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw new Error("Failed to login")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    // In a real app, this would make an API call
    if (user) {
      const updatedUser = {
        ...user,
        requirePasswordChange: false,
        lastPasswordChange: new Date().toISOString(),
      }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setShowPasswordChange(false)
      router.push(user.role === "admin" ? "/admin/dashboard" : "/dashboard")
    }
  }

  const checkAccess = (allowedRoles?: UserRole[]) => {
    if (!user) return false
    if (!allowedRoles) return true
    return allowedRoles.includes(user.role)
  }

  const hasPrivilege = (privilege: Privilege) => {
    if (!user || !user.privileges) return false
    return user.privileges.includes(privilege)
  }

  const updateUser = (updatedUser: User & { profileImage?: string }) => {
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, checkAccess, hasPrivilege, updateUser }}>
      {showPasswordChange && user && (
        <PasswordChangeDialog
          isOpen={true}
          onClose={() => {
            if (!user.requirePasswordChange) {
              setShowPasswordChange(false)
            }
          }}
          onSubmit={handlePasswordChange}
          isFirstTime={user.requirePasswordChange}
        />
      )}
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

