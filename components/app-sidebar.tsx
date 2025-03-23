"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  BarChart2,
  CalendarDays,
  ClipboardList,
  FileText,
  Home,
  Hospital,
  LogOut,
  MessageSquare,
  Settings,
  User,
  Users,
  Camera,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { useSettings } from "@/components/settings-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

export function AppSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { settings } = useSettings()

  // Get initials from user name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Update the renderLogo function to handle the new option
  const renderLogo = () => {
    if ((settings.logoType === "custom" || settings.logoType === "custom-with-text") && settings.customLogo) {
      return (
        <img
          src={settings.customLogo || "/placeholder.svg"}
          alt="Logo"
          className="h-6 w-auto max-w-[32px] flex-shrink-0"
        />
      )
    } else if (settings.logoType === "icon" || settings.logoType === "both") {
      return <Hospital className="h-6 w-6 flex-shrink-0" style={{ color: settings.sidebarIconColor }} />
    }
    return null
  }

  // Style for sidebar icons
  const iconStyle = { color: settings.sidebarIconColor }

  return (
    <Sidebar collapsible="icon">
      {/* Update the SidebarHeader to handle the new option */}
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-4 py-2 group-data-[collapsible=icon]:justify-center">
          {renderLogo()}
          {(settings.logoType === "text" ||
            settings.logoType === "both" ||
            settings.logoType === "custom-with-text") && (
            <div className="font-semibold text-lg group-data-[collapsible=icon]:hidden">{settings.sidebarTitle}</div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard" || pathname === "/"} tooltip="Dashboard">
              <Link href="/dashboard">
                <Home className="mr-2" style={iconStyle} />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/reports/submit"} tooltip="Submit Report">
              <Link href="/reports/submit">
                <ClipboardList className="mr-2" style={iconStyle} />
                <span>Submit Report</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/reports/daily"} tooltip="Daily Reports">
              <Link href="/reports/daily">
                <FileText className="mr-2" style={iconStyle} />
                <span>Daily Reports</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/reports/monthly"} tooltip="Monthly Statistics">
              <Link href="/reports/monthly">
                <CalendarDays className="mr-2" style={iconStyle} />
                <span>Monthly Statistics</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/reports/analytics"} tooltip="Analytics">
              <Link href="/reports/analytics">
                <BarChart2 className="mr-2" style={iconStyle} />
                <span>Analytics</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/reports/notes"} tooltip="Notes Reports">
              <Link href="/reports/notes">
                <MessageSquare className="mr-2" style={iconStyle} />
                <span>Notes Reports</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/messages"} tooltip="Messages">
              <Link href="/messages">
                <MessageSquare className="mr-2" style={iconStyle} />
                <span>Messages</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {user?.role === "admin" && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/users"} tooltip="User Management">
                  <Link href="/admin/users">
                    <Users className="mr-2" style={iconStyle} />
                    <span>User Management</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/admin/departments"} tooltip="Department Management">
                  <Link href="/admin/departments">
                    <Hospital className="mr-2" style={iconStyle} />
                    <span>Department Management</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/settings"} tooltip="Settings">
              <Link href="/settings">
                <Settings className="mr-2" style={iconStyle} />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                    <Avatar className="h-9 w-9 border border-primary/10">
                      <AvatarImage src={user?.profileImage} alt={user?.name || "User"} />
                      <AvatarFallback>{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>My Profile</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="flex flex-col items-center py-2">
                    <Avatar className="h-16 w-16 mb-2">
                      <AvatarImage src={user?.profileImage} alt={user?.name || "User"} />
                      <AvatarFallback>{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <p className="text-sm font-medium">{user?.name || "Guest"}</p>
                      <p className="text-xs text-muted-foreground">
                        {user?.role === "admin"
                          ? "Administrator"
                          : user?.role === "department_head"
                            ? "Department Head"
                            : user?.role === "staff"
                              ? "Staff"
                              : "User"}
                      </p>
                      {user?.department && <p className="text-xs text-muted-foreground mt-1">{user.department}</p>}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <label className="flex w-full cursor-pointer items-center">
                      <Camera className="mr-2 h-4 w-4" />
                      <span>Upload Photo</span>
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              if (user) {
                                const updatedUser = {
                                  ...user,
                                  profileImage: reader.result as string,
                                }
                                localStorage.setItem("user", JSON.stringify(updatedUser))
                                window.location.reload()
                              }
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                    </label>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Edit Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-medium">{user?.name || "Guest"}</div>
              <div className="text-xs text-muted-foreground">
                {user?.role === "admin"
                  ? "Administrator"
                  : user?.role === "department_head"
                    ? "Department Head"
                    : user?.role === "staff"
                      ? "Staff"
                      : "User"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" style={iconStyle} />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

