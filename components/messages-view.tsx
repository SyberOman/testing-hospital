"use client"

import type React from "react"

import { useState } from "react"
import { Search, Mail, Send, Trash2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/use-auth"

// Mock message data
const mockMessages = [
  {
    id: "1",
    sender: "RESUS Department",
    recipient: "Your Department",
    time: "10:23 AM",
    date: "Today",
    subject: "Staff Shortage",
    content: "Urgent: Need additional staff for evening shift due to increased patient volume.",
    category: "Urgent",
    read: false,
    starred: false,
    fullContent:
      "Urgent: Need additional staff for evening shift due to increased patient volume. We are experiencing a high influx of patients and our current staffing levels are insufficient. Please advise if any staff members can be reassigned temporarily.",
    replies: [],
  },
  {
    id: "2",
    sender: "POPD Department",
    recipient: "Your Department",
    time: "2:45 PM",
    date: "Yesterday",
    subject: "Monthly Department Meeting",
    content: "Monthly department meeting scheduled for Friday at 2 PM. Please confirm your attendance.",
    category: "Meeting",
    read: false,
    starred: true,
    fullContent:
      "Monthly department meeting scheduled for Friday at 2 PM. Please confirm your attendance. We will be discussing the new patient flow protocols and equipment allocation. The meeting will be held in Conference Room B and is expected to last approximately 90 minutes.",
    replies: [
      {
        sender: "Your Department",
        time: "3:15 PM Yesterday",
        content: "Thank you for the notification. We will have 3 representatives attending the meeting.",
      },
    ],
  },
  {
    id: "3",
    sender: "Admin",
    recipient: "All Departments",
    time: "9:15 AM",
    date: "2 days ago",
    subject: "New Equipment Delivery",
    content: "New equipment delivery for all departments scheduled for next Monday. Please prepare space.",
    category: "Announcement",
    read: true,
    starred: false,
    fullContent:
      "New equipment delivery for all departments scheduled for next Monday. Please prepare space in your storage areas. The delivery will include the new vital signs monitors and updated emergency carts. A representative from the supplier will be available for initial setup and training from 9 AM to 3 PM.",
    replies: [],
  },
  {
    id: "4",
    sender: "DERMA Department",
    recipient: "Your Department",
    time: "11:30 AM",
    date: "3 days ago",
    subject: "Patient Transfer Protocol",
    content: "Please review the updated patient transfer protocol for dermatology cases requiring urgent care.",
    category: "General",
    read: true,
    starred: false,
    fullContent:
      "Please review the updated patient transfer protocol for dermatology cases requiring urgent care. The new protocol requires a preliminary assessment form to be completed before transfer. This is to ensure that all necessary information is available to the receiving department and to minimize delays in patient care.",
    replies: [],
  },
  {
    id: "5",
    sender: "ORTHO Department",
    recipient: "Your Department",
    time: "3:20 PM",
    date: "4 days ago",
    subject: "Equipment Sharing Request",
    content: "Request to borrow portable X-ray machine for the next 48 hours due to maintenance on our unit.",
    category: "Request",
    read: true,
    starred: false,
    fullContent:
      "Request to borrow portable X-ray machine for the next 48 hours due to maintenance on our unit. Our scheduled maintenance will begin tomorrow at 8 AM and is expected to last for two days. We have several patients who will need X-rays during this period. Please let us know if this is possible.",
    replies: [],
  },
  {
    id: "6",
    sender: "Your Department",
    recipient: "SOPD Department",
    time: "10:05 AM",
    date: "5 days ago",
    subject: "Staff Rotation Schedule",
    content: "Attached is the updated staff rotation schedule for the next month. Please review and confirm.",
    category: "General",
    read: true,
    starred: true,
    fullContent:
      "Attached is the updated staff rotation schedule for the next month. Please review and confirm that this works for your department. We've made adjustments based on the feedback received in the last interdepartmental meeting. If there are any conflicts, please let us know by the end of this week.",
    replies: [],
  },
]

// Add a user context at the top of the component
export function MessagesView() {
  const { toast } = useToast()
  const { user } = useAuth() // Get the current user with department info
  const [messages, setMessages] = useState(mockMessages)
  const [selectedTab, setSelectedTab] = useState("inbox")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [viewMessageOpen, setViewMessageOpen] = useState(false)
  const [newMessageOpen, setNewMessageOpen] = useState(false)
  const [selectedMessages, setSelectedMessages] = useState<string[]>([])

  // Get the current user's department
  const userDepartment = user?.department || "Your Department"

  // Filter messages based on tab, search query, and department visibility
  const filteredMessages = messages.filter((message) => {
    // First check department visibility
    const canViewMessage =
      message.recipient === userDepartment ||
      message.recipient === "All Departments" ||
      message.sender === userDepartment

    if (!canViewMessage) return false

    // Then check search query
    const matchesSearch =
      message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    // Finally filter by tab
    if (selectedTab === "inbox") {
      return (
        (message.recipient === userDepartment || message.recipient === "All Departments") &&
        message.sender !== userDepartment
      )
    } else if (selectedTab === "sent") {
      return message.sender === userDepartment
    } else if (selectedTab === "starred") {
      return message.starred
    } else if (selectedTab === "unread") {
      return !message.read
    }

    return true
  })

  // Update the handleSendMessage function to use the current user's department
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const recipient = formData.get("recipient") as string
    const category = formData.get("category") as string
    const subject = formData.get("subject") as string
    const content = formData.get("message") as string

    // Create a new message
    const newMessage = {
      id: (messages.length + 1).toString(),
      sender: userDepartment,
      recipient,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: "Today",
      subject,
      content,
      category,
      read: true,
      starred: false,
      fullContent: content,
      replies: [], // Initialize empty replies array
    }

    // Add to messages
    setMessages([newMessage, ...messages])

    toast({
      title: "Message sent",
      description: `Your message has been sent to ${recipient}`,
    })

    setNewMessageOpen(false)
  }

  // Handle viewing a message
  const handleViewMessage = (message: any) => {
    // Mark as read
    if (!message.read) {
      setMessages(messages.map((m) => (m.id === message.id ? { ...m, read: true } : m)))
    }

    setSelectedMessage(message)
    setViewMessageOpen(true)
  }

  // Handle starring a message
  const handleStarMessage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setMessages(messages.map((message) => (message.id === id ? { ...message, starred: !message.starred } : message)))
  }

  // Handle selecting messages
  const handleSelectMessage = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedMessages([...selectedMessages, id])
    } else {
      setSelectedMessages(selectedMessages.filter((messageId) => messageId !== id))
    }
  }

  // Handle bulk actions
  const handleMarkAsRead = () => {
    setMessages(
      messages.map((message) => (selectedMessages.includes(message.id) ? { ...message, read: true } : message)),
    )
    setSelectedMessages([])
    toast({
      title: "Messages marked as read",
      description: `${selectedMessages.length} messages marked as read`,
    })
  }

  const handleDeleteMessages = () => {
    setMessages(messages.filter((message) => !selectedMessages.includes(message.id)))
    setSelectedMessages([])
    toast({
      title: "Messages deleted",
      description: `${selectedMessages.length} messages deleted`,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setNewMessageOpen(true)}>
            <Mail className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Department Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="inbox" value={selectedTab} onValueChange={setSelectedTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="inbox">Inbox</TabsTrigger>
                <TabsTrigger value="sent">Sent</TabsTrigger>
                <TabsTrigger value="starred">Starred</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
              </TabsList>

              {selectedMessages.length > 0 && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleMarkAsRead}>
                    Mark as Read
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDeleteMessages}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </div>

            <TabsContent value="inbox" className="m-0">
              {renderMessageList(filteredMessages)}
            </TabsContent>
            <TabsContent value="sent" className="m-0">
              {renderMessageList(filteredMessages)}
            </TabsContent>
            <TabsContent value="starred" className="m-0">
              {renderMessageList(filteredMessages)}
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              {renderMessageList(filteredMessages)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

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
                    <SelectItem value="RESUS Department">RESUS Department</SelectItem>
                    <SelectItem value="POPD Department">POPD Department</SelectItem>
                    <SelectItem value="DERMA Department">DERMA Department</SelectItem>
                    <SelectItem value="ORTHO Department">ORTHO Department</SelectItem>
                    <SelectItem value="SOPD Department">SOPD Department</SelectItem>
                    <SelectItem value="ENT Department">ENT Department</SelectItem>
                    <SelectItem value="ANC Department">ANC Department</SelectItem>
                    <SelectItem value="OPTHALMO Department">OPTHALMO Department</SelectItem>
                    <SelectItem value="SPECIALIST Department">SPECIALIST Department</SelectItem>
                    <SelectItem value="DENTAL Department">DENTAL Department</SelectItem>
                    <SelectItem value="Admin">Administration</SelectItem>
                    <SelectItem value="All Departments">All Departments</SelectItem>
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium">{selectedMessage?.sender}</div>
              <Badge variant="outline">{selectedMessage?.category}</Badge>
            </div>
            <div className="text-sm text-muted-foreground mb-4">
              To: {selectedMessage?.recipient} • {selectedMessage?.date} at {selectedMessage?.time}
            </div>
            <div className="border-t pt-4 mt-2">
              <p className="text-sm whitespace-pre-wrap">{selectedMessage?.fullContent}</p>
            </div>

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
            <Button variant="outline" size="sm" onClick={() => setViewMessageOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                const replyText = (document.getElementById("reply-message") as HTMLTextAreaElement)?.value
                if (replyText && replyText.trim()) {
                  // Add the reply to the message
                  const updatedMessages = messages.map((msg) => {
                    if (msg.id === selectedMessage?.id) {
                      const replies = msg.replies || []
                      return {
                        ...msg,
                        replies: [
                          ...replies,
                          {
                            sender: userDepartment,
                            time: `${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} Today`,
                            content: replyText,
                          },
                        ],
                      }
                    }
                    return msg
                  })

                  setMessages(updatedMessages)

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

  // Helper function to render message list
  function renderMessageList(messages: any[]) {
    return (
      <div className="border rounded-md">
        {messages.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No messages found</div>
        ) : (
          <div className="divide-y">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 hover:bg-muted/50 cursor-pointer flex items-start gap-3 ${!message.read ? "bg-muted/30 font-medium" : ""}`}
                onClick={() => handleViewMessage(message)}
              >
                <div className="pt-1">
                  <Checkbox
                    checked={selectedMessages.includes(message.id)}
                    onCheckedChange={(checked) => handleSelectMessage(message.id, checked as boolean)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-medium truncate">
                      {selectedTab === "sent" ? `To: ${message.recipient}` : message.sender}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="whitespace-nowrap">
                        {message.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{message.date}</span>
                    </div>
                  </div>
                  <div className="text-sm font-medium mb-1 truncate">{message.subject}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2">{message.content}</div>
                </div>
                <button
                  className="flex-shrink-0 text-muted-foreground hover:text-yellow-500 transition-colors"
                  onClick={(e) => handleStarMessage(message.id, e)}
                >
                  <Star className={`h-5 w-5 ${message.starred ? "fill-yellow-500 text-yellow-500" : ""}`} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
}

