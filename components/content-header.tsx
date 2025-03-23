"use client"

import type React from "react"

import { useState } from "react"
import { Bell, Mail, Menu, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useSidebar } from "@/components/ui/sidebar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, User, Settings, LogOut } from "lucide-react"

// Update the ContentHeader component to filter messages by department
export function ContentHeader() {
  const sidebar = useSidebar()
  const { toast } = useToast()
  const { user, logout } = useAuth() // Get the current user with department info
  const router = useRouter()
  const pathname = usePathname()

  // Get the current user's department
  const userDepartment = user?.department || "Your Department"

  // State for message dialogs
  const [newMessageOpen, setNewMessageOpen] = useState(false)
  const [viewMessageOpen, setViewMessageOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<any>(null)

  // Mock messages data
  const messages = [
    {
      id: "1",
      sender: "RESUS Department",
      recipient: "Your Department",
      time: "10:23 AM",
      content: "Urgent: Need additional staff for evening shift due to increased patient volume.",
      category: "Urgent",
      read: false,
      fullContent:
        "Urgent: Need additional staff for evening shift due to increased patient volume. We are experiencing a high influx of patients and our current staffing levels are insufficient. Please advise if any staff members can be reassigned temporarily.",
      replies: [
        {
          sender: "Admin",
          time: "10:30 AM",
          content:
            "Acknowledged. We are reassigning two nurses from the morning shift to cover the evening shift. Please confirm if this is sufficient.",
        },
      ],
    },
    {
      id: "2",
      sender: "POPD Department",
      recipient: "Your Department",
      time: "Yesterday",
      content: "Monthly department meeting scheduled for Friday at 2 PM. Please confirm your attendance.",
      category: "Meeting",
      read: false,
      fullContent:
        "Monthly department meeting scheduled for Friday at 2 PM. Please confirm your attendance. We will be discussing the new patient flow protocols and equipment allocation. The meeting will be held in Conference Room B and is expected to last approximately 90 minutes.",
      replies: [],
    },
    {
      id: "3",
      sender: "Admin",
      recipient: "All Departments",
      time: "2 days ago",
      content: "New equipment delivery for all departments scheduled for next Monday. Please prepare space.",
      category: "Announcement",
      read: true,
      fullContent:
        "New equipment delivery for all departments scheduled for next Monday. Please prepare space in your storage areas. The delivery will include the new vital signs monitors and updated emergency carts. A representative from the supplier will be available for initial setup and training from 9 AM to 3 PM.",
      replies: [],
    },
  ]

  // Filter messages by department visibility
  const filteredMessages = messages.filter(
    (message) =>
      message.recipient === userDepartment ||
      message.recipient === "All Departments" ||
      message.sender === userDepartment,
  )

  // Handle sending a new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const recipient = formData.get("recipient") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    // In a real app, you would send this to your API
    console.log("Sending message to:", recipient, "Subject:", subject, "Message:", message)

    toast({
      title: "Message sent",
      description: `Your message has been sent to ${recipient}`,
    })

    setNewMessageOpen(false)
  }

  // Handle viewing a message
  const handleViewMessage = (message: any) => {
    setSelectedMessage(message)
    setViewMessageOpen(true)
  }

  // Navigate to all messages page
  const handleViewAllMessages = () => {
    router.push("/messages")
  }

  // Get initials from user name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 gap-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => sidebar.toggleCollapsed()}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground">Hospital System</span>
            <span className="mx-2 text-muted-foreground">/</span>
            <span className="font-medium">
              {(() => {
                const path = pathname.split("/").filter(Boolean)

                if (path.length === 0 || path[0] === "dashboard") {
                  return "Dashboard"
                }

                if (path[0] === "reports") {
                  const reportType = path[1]
                  if (reportType === "submit") return "Submit Report"
                  if (reportType === "daily") return "Daily Reports"
                  if (reportType === "monthly") return "Monthly Statistics"
                  if (reportType === "notes") return "Notes Reports"
                  if (reportType === "analytics") return "Analytics"
                  return "Reports"
                }

                if (path[0] === "admin") {
                  const adminSection = path[1]
                  if (adminSection === "users") return "User Management"
                  if (adminSection === "departments") return "Department Management"
                  if (adminSection === "dashboard") return "Admin Dashboard"
                  return "Admin"
                }

                if (path[0] === "messages") return "Messages"
                if (path[0] === "settings") return "Settings"

                return path[0].charAt(0).toUpperCase() + path[0].slice(1)
              })()}
            </span>
          </div>
        </div>
        <div className="flex-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[280px]">
            <DropdownMenuItem>New report submitted</DropdownMenuItem>
            <DropdownMenuItem>Password change required</DropdownMenuItem>
            <DropdownMenuItem>System maintenance scheduled</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Mail className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                {filteredMessages.filter((m) => !m.read).length}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[350px]">
            <div className="flex items-center justify-between p-2 border-b">
              <h4 className="font-medium">Department Messages</h4>
              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setNewMessageOpen(true)}>
                <Mail className="h-3.5 w-3.5 mr-1" />
                New Message
              </Button>
            </div>
            <div className="max-h-[300px] overflow-auto">
              {filteredMessages.map((message) => (
                <DropdownMenuItem
                  key={message.id}
                  className={`p-3 cursor-pointer focus:bg-accent ${!message.read ? "bg-muted/50" : ""}`}
                  onClick={() => handleViewMessage(message)}
                >
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{message.sender}</span>
                      <span className="text-xs text-muted-foreground">{message.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{message.content}</p>
                    <Badge variant="outline" className="w-fit mt-1">
                      {message.category}
                    </Badge>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
            <div className="p-2 border-t text-center">
              <Button variant="ghost" size="sm" className="w-full text-xs" onClick={handleViewAllMessages}>
                View All Messages
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 rounded-full p-0 ml-2">
              <Avatar className="h-8 w-8 border border-primary/10">
                <AvatarImage src={user?.profileImage} alt={user?.name || "User"} />
                <AvatarFallback>{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
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
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* New Message Dialog */}
      <Dialog open={newMessageOpen} onOpenChange={setNewMessageOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSendMessage}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="recipient" className="text-sm font-medium">
                  To:
                </label>
                <Select name="recipient" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RESUS">RESUS Department</SelectItem>
                    <SelectItem value="POPD">POPD Department</SelectItem>
                    <SelectItem value="DERMA">DERMA Department</SelectItem>
                    <SelectItem value="ORTHO">ORTHO Department</SelectItem>
                    <SelectItem value="SOPD">SOPD Department</SelectItem>
                    <SelectItem value="ENT">ENT Department</SelectItem>
                    <SelectItem value="ANC">ANC Department</SelectItem>
                    <SelectItem value="OPTHALMO">OPTHALMO Department</SelectItem>
                    <SelectItem value="SPECIALIST">SPECIALIST Department</SelectItem>
                    <SelectItem value="DENTAL">DENTAL Department</SelectItem>
                    <SelectItem value="ADMIN">Administration</SelectItem>
                    <SelectItem value="ALL">All Departments</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category:
                </label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                    <SelectItem value="Meeting">Meeting</SelectItem>
                    <SelectItem value="Announcement">Announcement</SelectItem>
                    <SelectItem value="Request">Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject:
                </label>
                <Input id="subject" name="subject" required />
              </div>
              <div className="grid gap-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message:
                </label>
                <Textarea id="message" name="message" rows={5} required />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNewMessageOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Message Dialog */}
      <Dialog open={viewMessageOpen} onOpenChange={setViewMessageOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Message from {selectedMessage?.sender}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex justify-between items-center mb-4">
              <Badge variant="outline">{selectedMessage?.category}</Badge>
              <span className="text-sm text-muted-foreground">{selectedMessage?.time}</span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{selectedMessage?.fullContent}</p>

            {/* Show replies if any */}
            {selectedMessage?.replies && selectedMessage.replies.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h4 className="text-sm font-medium mb-3">Previous Replies</h4>
                {selectedMessage.replies.map((reply: any, index: number) => (
                  <div key={index} className="mb-4 border-l-2 pl-3 py-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{reply.sender}</span>
                      <span className="text-xs text-muted-foreground">{reply.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{reply.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply form */}
            {viewMessageOpen && (
              <div className="mt-6 border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Reply</h4>
                <Textarea placeholder="Type your reply here..." className="min-h-[100px]" id="reply-message" />
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setViewMessageOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                const replyText = (document.getElementById("reply-message") as HTMLTextAreaElement)?.value
                if (replyText && replyText.trim()) {
                  // In a real app, you would send this to your API
                  toast({
                    title: "Reply sent",
                    description: `Your reply has been sent to ${selectedMessage?.sender}`,
                  })
                  setViewMessageOpen(false)
                } else {
                  toast({
                    title: "Reply cannot be empty",
                    description: "Please enter a message before sending",
                    variant: "destructive",
                  })
                }
              }}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

