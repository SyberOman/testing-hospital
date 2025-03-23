"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Search, Eye, Key, Edit, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { USER_PRIVILEGES } from "@/lib/config"
import type { User, Privilege } from "@/lib/types"

type UserWithPrivileges = User & {
  lastLogin?: string
  createdAt: string
}

export function UserManagement() {
  const { toast } = useToast()
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [isEditingPrivileges, setIsEditingPrivileges] = useState(false)
  // Add a new state for editing user details
  const [isEditingUser, setIsEditingUser] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserWithPrivileges | null>(null)
  // Add this after the selectedUser state
  const [editingUser, setEditingUser] = useState<UserWithPrivileges | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [editedPrivileges, setEditedPrivileges] = useState<Privilege[]>([])
  const [users, setUsers] = useState<UserWithPrivileges[]>([
    {
      id: "1",
      username: "administrator",
      name: "Master Admin",
      email: "master@hospital.admin",
      role: "admin",
      status: "active",
      privileges: USER_PRIVILEGES.admin,
      lastLogin: "2024-03-03 09:15 AM",
      createdAt: "2024-01-01",
    },
    {
      id: "2",
      username: "resus_head",
      name: "Dr. John Doe",
      email: "john@hospital.com",
      role: "department_head",
      department: "RESUS Department",
      status: "active",
      privileges: USER_PRIVILEGES.department_head,
      lastLogin: "2024-03-03 08:30 AM",
      createdAt: "2024-01-15",
    },
    {
      id: "3",
      username: "popd_head",
      name: "Dr. Jane Smith",
      email: "jane@hospital.com",
      role: "department_head",
      department: "POPD Department",
      status: "active",
      privileges: USER_PRIVILEGES.department_head,
      lastLogin: "2024-03-02 04:45 PM",
      createdAt: "2024-01-20",
    },
    {
      id: "4",
      username: "derma_head",
      name: "Dr. Sarah Wilson",
      email: "sarah@hospital.com",
      role: "department_head",
      department: "DERMA Department",
      status: "active",
      privileges: USER_PRIVILEGES.department_head,
      lastLogin: "2024-03-03 10:15 AM",
      createdAt: "2024-01-25",
    },
    {
      id: "5",
      username: "ortho_head",
      name: "Dr. Michael Brown",
      email: "michael@hospital.com",
      role: "department_head",
      department: "ORTHO Department",
      status: "active",
      privileges: USER_PRIVILEGES.department_head,
      lastLogin: "2024-03-03 09:45 AM",
      createdAt: "2024-01-30",
    },
    {
      id: "6",
      username: "resus_staff1",
      name: "Nurse Robert Chen",
      email: "robert@hospital.com",
      role: "staff",
      department: "RESUS Department",
      status: "active",
      privileges: USER_PRIVILEGES.staff,
      lastLogin: "2024-03-03 07:30 AM",
      createdAt: "2024-02-01",
    },
    {
      id: "7",
      username: "popd_staff1",
      name: "Nurse Maria Garcia",
      email: "maria@hospital.com",
      role: "staff",
      department: "POPD Department",
      status: "active",
      privileges: USER_PRIVILEGES.staff,
      lastLogin: "2024-03-03 08:00 AM",
      createdAt: "2024-02-05",
    },
  ])

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const role = formData.get("role") as User["role"]
    const department = formData.get("department") as string
    const username = formData.get("username") as string

    // Set default privileges based on role
    const privileges = USER_PRIVILEGES[role] || []

    // Generate default password (in a real app, this would be randomly generated)
    const defaultPassword = "Welcome@123"

    const newUser: UserWithPrivileges = {
      id: String(users.length + 1),
      username: username,
      name: formData.get("name") as string,
      email: (formData.get("email") as string) || undefined,
      role: role,
      department: role !== "admin" ? department : undefined,
      status: "active",
      privileges: privileges,
      createdAt: new Date().toISOString(),
      requirePasswordChange: true, // Force password change on first login
    }

    setUsers([...users, newUser])
    setIsAddingUser(false)
    toast({
      title: "User added successfully",
      description: `${newUser.name} has been added as ${newUser.role}${
        newUser.department ? ` for ${newUser.department}` : ""
      }. Default password: ${defaultPassword}`,
    })
  }

  const handleResetPassword = async (userId: string) => {
    try {
      const defaultPassword = "Welcome@123"
      setUsers(users.map((user) => (user.id === userId ? { ...user, requirePasswordChange: true } : user)))
      toast({
        title: "Password reset successful",
        description: `Password has been reset to: ${defaultPassword}. User will be required to change password on next login.`,
      })
    } catch (error) {
      toast({
        title: "Failed to reset password",
        description: "There was an error resetting the password",
        variant: "destructive",
      })
    }
  }

  // Replace the handleEditUser function with this combined version
  const handleEditUser = (user: UserWithPrivileges) => {
    setEditingUser({ ...user })
    setEditedPrivileges([...user.privileges])
    setIsEditingUser(true)
  }

  // Remove the separate handleEditPrivileges function and replace with this
  const handleEditPrivileges = (user: UserWithPrivileges) => {
    handleEditUser(user) // Just use the combined edit function
  }

  // Replace the handleSaveUserDetails function with this combined version
  const handleSaveUserDetails = () => {
    if (!editingUser) return

    // Update user with both details and privileges
    setUsers(
      users.map((user) =>
        user.id === editingUser.id
          ? {
              ...editingUser,
              privileges: editedPrivileges,
            }
          : user,
      ),
    )

    toast({
      title: "User updated",
      description: `Details and privileges for ${editingUser.name} have been updated successfully.`,
    })

    setIsEditingUser(false)
    setEditingUser(null)
  }

  const togglePrivilege = (privilege: Privilege) => {
    if (editedPrivileges.includes(privilege)) {
      setEditedPrivileges(editedPrivileges.filter((p) => p !== privilege))
    } else {
      setEditedPrivileges([...editedPrivileges, privilege])
    }
  }

  // Add this function after togglePrivilege
  const handleToggleUserStatus = (userId: string) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          const newStatus = user.status === "active" ? "inactive" : "active"
          return { ...user, status: newStatus }
        }
        return user
      }),
    )

    const user = users.find((u) => u.id === userId)
    const newStatus = user?.status === "active" ? "inactive" : "active"

    toast({
      title: "User status updated",
      description: `${user?.name} has been ${newStatus}.`,
    })
  }

  // Add this function to handle input changes for user editing
  const handleUserInputChange = (field: keyof UserWithPrivileges, value: any) => {
    if (!editingUser) return

    setEditingUser((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        [field]: value,
      }
    })
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get all available privileges for the selected role
  const getAvailablePrivileges = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return USER_PRIVILEGES.admin
      case "department_head":
        return USER_PRIVILEGES.department_head
      case "staff":
        return USER_PRIVILEGES.staff
      default:
        return []
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Add a new user to the system. They will receive the default password.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" placeholder="Username" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="Full name" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input id="email" name="email" type="email" placeholder="Email address for password reset" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select name="role" required defaultValue="staff">
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="department_head">Department Head</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select name="department" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RESUS Department">RESUS</SelectItem>
                    <SelectItem value="POPD Department">POPD</SelectItem>
                    <SelectItem value="DERMA Department">DERMA</SelectItem>
                    <SelectItem value="ORTHO Department">ORTHO</SelectItem>
                    <SelectItem value="SOPD Department">SOPD</SelectItem>
                    <SelectItem value="ENT Department">ENT</SelectItem>
                    <SelectItem value="ANC Department">ANC</SelectItem>
                    <SelectItem value="OPTHALMO Department">OPTHALMO</SelectItem>
                    <SelectItem value="SPECIALIST Department">SPECIALIST</SelectItem>
                    <SelectItem value="DENTAL Department">DENTAL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddingUser(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add User</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.role === "admin" ? "destructive" : user.role === "department_head" ? "default" : "secondary"
                    }
                  >
                    {user.role === "department_head"
                      ? "Department Head"
                      : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{user.department || "-"}</TableCell>
                <TableCell>
                  <Button
                    variant={user.status === "active" ? "outline" : "secondary"}
                    size="sm"
                    onClick={() => handleToggleUserStatus(user.id)}
                    className={
                      user.status === "active"
                        ? "bg-green-50 hover:bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }
                  >
                    {user.status === "active" ? "Active" : "Inactive"}
                  </Button>
                </TableCell>
                <TableCell>{user.lastLogin || "Never"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleResetPassword(user.id)}>
                      <Key className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser && !isEditingPrivileges} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Username</Label>
                  <div className="mt-1">{selectedUser.username}</div>
                </div>
                <div>
                  <Label>Name</Label>
                  <div className="mt-1">{selectedUser.name}</div>
                </div>
                <div>
                  <Label>Email</Label>
                  <div className="mt-1">{selectedUser.email || "-"}</div>
                </div>
                <div>
                  <Label>Role</Label>
                  <div className="mt-1">
                    <Badge
                      variant={
                        selectedUser.role === "admin"
                          ? "destructive"
                          : selectedUser.role === "department_head"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {selectedUser.role === "department_head"
                        ? "Department Head"
                        : selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label>Department</Label>
                  <div className="mt-1">{selectedUser.department || "-"}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">
                    <Badge variant={selectedUser.status === "active" ? "default" : "secondary"}>
                      {selectedUser.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label>Created At</Label>
                  <div className="mt-1">{selectedUser.createdAt}</div>
                </div>
                <div>
                  <Label>Last Password Change</Label>
                  <div className="mt-1">{selectedUser.lastPasswordChange || "Never"}</div>
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Privileges</Label>
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  <div className="space-y-4">
                    {selectedUser.privileges.map((privilege) => (
                      <div key={privilege} className="flex items-center space-x-2">
                        <Checkbox id={privilege} checked disabled />
                        <label
                          htmlFor={privilege}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {privilege.split("_").join(" ").toUpperCase()}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Privileges Dialog */}

      {/* Edit User Details Dialog */}
      {/* Replace the Edit User Details Dialog with this combined version */}
      {/* Edit User Dialog (Combined Details and Privileges) */}
      <Dialog open={isEditingUser} onOpenChange={(open) => !open && setIsEditingUser(false)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Edit user details and privileges</DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={editingUser.name}
                    onChange={(e) => handleUserInputChange("name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingUser.email || ""}
                    onChange={(e) => handleUserInputChange("email", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-department">Department</Label>
                  {editingUser.role !== "admin" ? (
                    <Select
                      value={editingUser.department || ""}
                      onValueChange={(value) => handleUserInputChange("department", value)}
                    >
                      <SelectTrigger id="edit-department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RESUS Department">RESUS</SelectItem>
                        <SelectItem value="POPD Department">POPD</SelectItem>
                        <SelectItem value="DERMA Department">DERMA</SelectItem>
                        <SelectItem value="ORTHO Department">ORTHO</SelectItem>
                        <SelectItem value="SOPD Department">SOPD</SelectItem>
                        <SelectItem value="ENT Department">ENT</SelectItem>
                        <SelectItem value="ANC Department">ANC</SelectItem>
                        <SelectItem value="OPTHALMO Department">OPTHALMO</SelectItem>
                        <SelectItem value="SPECIALIST Department">SPECIALIST</SelectItem>
                        <SelectItem value="DENTAL Department">DENTAL</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input value="Administrator" disabled />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editingUser.status}
                    onValueChange={(value) => handleUserInputChange("status", value as "active" | "inactive")}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="block">User Privileges</Label>
                <div className="border rounded-md p-4">
                  <ScrollArea className="h-[250px]">
                    <div className="space-y-4">
                      {getAvailablePrivileges(editingUser.role).map((privilege) => (
                        <div key={privilege} className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-${privilege}`}
                            checked={editedPrivileges.includes(privilege)}
                            onCheckedChange={() => togglePrivilege(privilege)}
                          />
                          <label htmlFor={`edit-${privilege}`} className="text-sm font-medium leading-none">
                            {privilege.split("_").join(" ").toUpperCase()}
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditingUser(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveUserDetails}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

