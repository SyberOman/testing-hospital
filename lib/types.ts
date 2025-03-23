import type { USER_PRIVILEGES } from "./config"

export type UserRole = "admin" | "department_head" | "staff"

export type User = {
  id: string
  username: string
  name: string
  email?: string
  role: UserRole
  department?: string
  status: "active" | "inactive"
  requirePasswordChange?: boolean
  lastPasswordChange?: string
  privileges: Privilege[]
}

export type Privilege = (typeof USER_PRIVILEGES)[keyof typeof USER_PRIVILEGES][number]

export type Report = {
  id: string
  date: Date
  department: string
  shift: "M" | "A" | "N"
  staffCount: number
  moCount: number
  sickLeave: number
  opdCases: number
  shortStayCases: number
  referralToBH: number
  rtaCases: number
  mlcCases: number
  escortCases: number
  lamaCases: number
  dressingCases: number
  referralFromHHC: number
  casesWithReferral: number
  casesWithoutReferral: number
  fridgeMinTemp: string
  fridgeMaxTemp: string
  notes?: string
  submittedBy: string
  submittedAt: string
}

