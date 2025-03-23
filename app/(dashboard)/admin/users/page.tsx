import { UserManagement } from "@/components/user-management"

export default function UsersPage() {
  return (
    <div className="p-6 w-full h-full">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <UserManagement />
    </div>
  )
}

