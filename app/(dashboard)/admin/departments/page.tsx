import { DepartmentConfiguration } from "@/components/department-configuration"

export default function DepartmentsPage() {
  return (
    <div className="p-6 w-full h-full">
      <h1 className="text-2xl font-bold mb-6">Department Management</h1>
      <DepartmentConfiguration />
    </div>
  )
}

