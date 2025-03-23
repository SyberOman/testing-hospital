"use client"

import { useState } from "react"
import { Plus, Trash2, Save, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

export type Department = {
  id: string
  name: string
  requiredShifts: ("morning" | "afternoon" | "night")[]
  isActive: boolean
}

export function DepartmentConfiguration() {
  const { toast } = useToast()
  const [departments, setDepartments] = useState<Department[]>([
    { id: "1", name: "RESUS", requiredShifts: ["morning", "afternoon", "night"], isActive: true },
    { id: "2", name: "POPD", requiredShifts: ["morning", "afternoon", "night"], isActive: true },
    { id: "3", name: "DERMA", requiredShifts: ["morning", "afternoon"], isActive: true },
    { id: "4", name: "ORTHO", requiredShifts: ["morning", "afternoon", "night"], isActive: true },
    { id: "5", name: "SOPD", requiredShifts: ["morning", "afternoon"], isActive: true },
    { id: "6", name: "ENT", requiredShifts: ["morning", "afternoon"], isActive: true },
    { id: "7", name: "ANC", requiredShifts: ["morning"], isActive: true },
    { id: "8", name: "OPTHALMO", requiredShifts: [], isActive: false },
    { id: "9", name: "SPECIALIST", requiredShifts: ["morning", "afternoon", "night"], isActive: true },
    { id: "10", name: "DENTAL", requiredShifts: ["morning", "afternoon"], isActive: true },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newDepartment, setNewDepartment] = useState<Partial<Department>>({
    name: "",
    requiredShifts: [],
    isActive: true,
  })
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)

  const handleAddDepartment = () => {
    if (!newDepartment.name) {
      toast({
        title: "Error",
        description: "Department name is required",
        variant: "destructive",
      })
      return
    }

    const id = (departments.length + 1).toString()
    setDepartments([
      ...departments,
      {
        id,
        name: newDepartment.name,
        requiredShifts: newDepartment.requiredShifts as ("morning" | "afternoon" | "night")[],
        isActive: newDepartment.isActive || true,
      },
    ])

    setNewDepartment({
      name: "",
      requiredShifts: [],
      isActive: true,
    })
    setIsAddDialogOpen(false)

    toast({
      title: "Department added",
      description: `${newDepartment.name} has been added successfully`,
    })
  }

  const handleEditDepartment = () => {
    if (!editingDepartment) return

    setDepartments(departments.map((dept) => (dept.id === editingDepartment.id ? editingDepartment : dept)))
    setIsEditDialogOpen(false)
    setEditingDepartment(null)

    toast({
      title: "Department updated",
      description: `${editingDepartment.name} has been updated successfully`,
    })
  }

  const handleDeleteDepartment = (id: string) => {
    const departmentToDelete = departments.find((dept) => dept.id === id)
    if (!departmentToDelete) return

    setDepartments(departments.filter((dept) => dept.id !== id))

    toast({
      title: "Department deleted",
      description: `${departmentToDelete.name} has been deleted successfully`,
    })
  }

  const toggleShift = (dept: Department | Partial<Department>, shift: "morning" | "afternoon" | "night") => {
    const currentShifts = [...(dept.requiredShifts || [])]

    if (currentShifts.includes(shift)) {
      return currentShifts.filter((s) => s !== shift)
    } else {
      return [...currentShifts, shift]
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Department Configuration</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Department
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Departments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department Name</TableHead>
                <TableHead>Morning Shift</TableHead>
                <TableHead>Afternoon Shift</TableHead>
                <TableHead>Night Shift</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell>
                    {dept.requiredShifts.includes("morning") ? <Checkbox checked disabled /> : <Checkbox disabled />}
                  </TableCell>
                  <TableCell>
                    {dept.requiredShifts.includes("afternoon") ? <Checkbox checked disabled /> : <Checkbox disabled />}
                  </TableCell>
                  <TableCell>
                    {dept.requiredShifts.includes("night") ? <Checkbox checked disabled /> : <Checkbox disabled />}
                  </TableCell>
                  <TableCell>
                    {dept.isActive ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingDepartment(dept)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteDepartment(dept.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Department Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Department Name</Label>
              <Input
                id="name"
                value={newDepartment.name}
                onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                placeholder="Enter department name"
              />
            </div>

            <div className="space-y-2">
              <Label>Required Shifts</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="morning-shift"
                    checked={newDepartment.requiredShifts?.includes("morning")}
                    onCheckedChange={() => {
                      setNewDepartment({
                        ...newDepartment,
                        requiredShifts: toggleShift(newDepartment, "morning"),
                      })
                    }}
                  />
                  <label htmlFor="morning-shift">Morning Shift</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="afternoon-shift"
                    checked={newDepartment.requiredShifts?.includes("afternoon")}
                    onCheckedChange={() => {
                      setNewDepartment({
                        ...newDepartment,
                        requiredShifts: toggleShift(newDepartment, "afternoon"),
                      })
                    }}
                  />
                  <label htmlFor="afternoon-shift">Afternoon Shift</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="night-shift"
                    checked={newDepartment.requiredShifts?.includes("night")}
                    onCheckedChange={() => {
                      setNewDepartment({
                        ...newDepartment,
                        requiredShifts: toggleShift(newDepartment, "night"),
                      })
                    }}
                  />
                  <label htmlFor="night-shift">Night Shift</label>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-active"
                checked={newDepartment.isActive}
                onCheckedChange={(checked) => {
                  setNewDepartment({ ...newDepartment, isActive: !!checked })
                }}
              />
              <label htmlFor="is-active">Active</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDepartment}>
              <Save className="mr-2 h-4 w-4" /> Save Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Department Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
          </DialogHeader>
          {editingDepartment && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Department Name</Label>
                <Input
                  id="edit-name"
                  value={editingDepartment.name}
                  onChange={(e) => setEditingDepartment({ ...editingDepartment, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Required Shifts</Label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit-morning-shift"
                      checked={editingDepartment.requiredShifts.includes("morning")}
                      onCheckedChange={() => {
                        setEditingDepartment({
                          ...editingDepartment,
                          requiredShifts: toggleShift(editingDepartment, "morning"),
                        })
                      }}
                    />
                    <label htmlFor="edit-morning-shift">Morning Shift</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit-afternoon-shift"
                      checked={editingDepartment.requiredShifts.includes("afternoon")}
                      onCheckedChange={() => {
                        setEditingDepartment({
                          ...editingDepartment,
                          requiredShifts: toggleShift(editingDepartment, "afternoon"),
                        })
                      }}
                    />
                    <label htmlFor="edit-afternoon-shift">Afternoon Shift</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit-night-shift"
                      checked={editingDepartment.requiredShifts.includes("night")}
                      onCheckedChange={() => {
                        setEditingDepartment({
                          ...editingDepartment,
                          requiredShifts: toggleShift(editingDepartment, "night"),
                        })
                      }}
                    />
                    <label htmlFor="edit-night-shift">Night Shift</label>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-is-active"
                  checked={editingDepartment.isActive}
                  onCheckedChange={(checked) => {
                    setEditingDepartment({ ...editingDepartment, isActive: !!checked })
                  }}
                />
                <label htmlFor="edit-is-active">Active</label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditDepartment}>
              <Save className="mr-2 h-4 w-4" /> Update Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

