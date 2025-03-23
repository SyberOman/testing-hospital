export const MASTER_ADMIN = {
  username: "administrator",
  password: "adminpassword", // In a real app, this would be hashed
}

export const USER_PRIVILEGES = {
  admin: [
    "manage_users",
    "view_all_departments",
    "manage_departments",
    "view_all_reports",
    "manage_settings",
    "export_data",
    "view_analytics",
    "reset_passwords",
  ],
  department_head: [
    "view_department",
    "manage_department_staff",
    "submit_report",
    "view_department_reports",
    "export_department_data",
  ],
  staff: ["view_department", "submit_report", "view_own_reports"],
} as const

export type Privilege = (typeof USER_PRIVILEGES)[keyof typeof USER_PRIVILEGES][number]

