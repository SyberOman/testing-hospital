"use client"

import { TableHeader } from "@/components/ui/table"

import { CheckCircle2, Clock, XCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function DepartmentStatusTable() {
  // Mock data for department status
  const departments = [
    {
      name: "RESUS",
      requiredShifts: ["morning", "afternoon", "night"],
      morning: "submitted",
      afternoon: "submitted",
      night: "pending",
      morningSubmittedAt: "2024-03-06 08:30 AM",
      afternoonSubmittedAt: "2024-03-06 02:15 PM",
      nightOverdue: 1,
      pendingDays: ["2024-03-06"],
    },
    {
      name: "POPD",
      requiredShifts: ["morning", "afternoon", "night"],
      morning: "submitted",
      afternoon: "submitted",
      night: "pending",
      morningSubmittedAt: "2024-03-06 09:10 AM",
      afternoonSubmittedAt: "2024-03-06 03:20 PM",
      nightOverdue: 2,
      pendingDays: ["2024-03-05", "2024-03-06"],
    },
    {
      name: "DERMA",
      requiredShifts: ["morning", "afternoon"],
      morning: "submitted",
      afternoon: "pending",
      night: "not_required",
      morningSubmittedAt: "2024-03-06 08:00 AM",
      afternoonOverdue: 1,
      pendingDays: ["2024-03-05", "2024-03-06", "2024-03-07"],
    },
    {
      name: "ORTHO",
      requiredShifts: ["morning", "afternoon", "night"],
      morning: "submitted",
      afternoon: "pending",
      night: "pending",
      morningSubmittedAt: "2024-03-06 08:45 AM",
      afternoonOverdue: 2,
      nightOverdue: 1,
      pendingDays: ["2024-03-05", "2024-03-06"],
    },
    {
      name: "SOPD",
      requiredShifts: ["morning", "afternoon"],
      morning: "submitted",
      afternoon: "submitted",
      night: "not_required",
      morningSubmittedAt: "2024-03-06 09:30 AM",
      afternoonSubmittedAt: "2024-03-06 04:00 PM",
    },
    {
      name: "ENT",
      requiredShifts: ["morning", "afternoon"],
      morning: "submitted",
      afternoon: "pending",
      night: "not_required",
      morningSubmittedAt: "2024-03-06 09:00 AM",
      afternoonOverdue: 1,
      pendingDays: ["2024-03-05", "2024-03-06"],
    },
    {
      name: "ANC",
      requiredShifts: ["morning"],
      morning: "submitted",
      afternoon: "not_required",
      night: "not_required",
      morningSubmittedAt: "2024-03-06 08:15 AM",
    },
    {
      name: "OPTHALMO",
      requiredShifts: [],
      morning: "not_required",
      afternoon: "not_required",
      night: "not_required",
    },
    {
      name: "SPECIALIST",
      requiredShifts: ["morning", "afternoon", "night"],
      morning: "submitted",
      afternoon: "pending",
      night: "pending",
      morningSubmittedAt: "2024-03-06 10:00 AM",
      afternoonOverdue: 1,
      nightOverdue: 4,
      pendingDays: ["2024-03-04", "2024-03-05", "2024-03-06", "2024-03-07"],
      afternoonPendingDays: ["2024-03-06"],
      nightPendingDays: ["2024-03-04", "2024-03-05", "2024-03-06", "2024-03-07"],
    },
    {
      name: "DENTAL",
      requiredShifts: ["morning", "afternoon"],
      morning: "submitted",
      afternoon: "pending",
      night: "not_required",
      morningSubmittedAt: "2024-03-06 09:45 AM",
      afternoonOverdue: 2,
      pendingDays: ["2024-03-05", "2024-03-06"],
    },
  ]

  const getStatusIcon = (status: string, daysOverdue = 0) => {
    switch (status) {
      case "submitted":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "pending":
        return (
          <div className="relative">
            {daysOverdue > 1 && (
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {daysOverdue}
              </span>
            )}
            <Clock className="h-5 w-5 text-amber-500" />
          </div>
        )
      case "missing":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "not_required":
        return <Badge variant="outline">N/A</Badge>
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "submitted":
        return "Submitted"
      case "pending":
        return "Pending"
      case "missing":
        return "Missing"
      case "not_required":
        return "Not Required"
      default:
        return status
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Department</TableHead>
          <TableHead>Morning Shift</TableHead>
          <TableHead>Afternoon Shift</TableHead>
          <TableHead>Night Shift</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {departments.map((dept) => (
          <TableRow key={dept.name}>
            <TableCell className="font-medium">{dept.name}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {getStatusIcon(dept.morning, dept.morningOverdue)}
                <span>{getStatusText(dept.morning)}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {getStatusIcon(dept.afternoon, dept.afternoonOverdue)}
                <span>{getStatusText(dept.afternoon)}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {getStatusIcon(dept.night, dept.nightOverdue)}
                <span>{getStatusText(dept.night)}</span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">{dept.name} Department Status</h4>

                    {dept.requiredShifts.includes("morning") && dept.morning === "submitted" && (
                      <div className="text-sm">
                        <span className="font-medium">Morning:</span> Submitted at {dept.morningSubmittedAt}
                      </div>
                    )}

                    {dept.requiredShifts.includes("afternoon") && dept.afternoon === "submitted" && (
                      <div className="text-sm">
                        <span className="font-medium">Afternoon:</span> Submitted at {dept.afternoonSubmittedAt}
                      </div>
                    )}

                    {dept.requiredShifts.includes("night") && dept.night === "submitted" && (
                      <div className="text-sm">
                        <span className="font-medium">Night:</span> Submitted at {dept.nightSubmittedAt}
                      </div>
                    )}

                    {((dept.requiredShifts.includes("morning") && dept.morning === "pending") ||
                      (dept.requiredShifts.includes("afternoon") && dept.afternoon === "pending") ||
                      (dept.requiredShifts.includes("night") && dept.night === "pending")) && (
                      <div className="mt-2">
                        <h5 className="text-sm font-medium mb-1">Pending Reports:</h5>
                        <div className="space-y-2">
                          {dept.requiredShifts.includes("morning") && dept.morning === "pending" && (
                            <div>
                              <div className="text-xs text-amber-600 font-medium">
                                Morning shift: Pending for {dept.morningOverdue || 1} day(s)
                              </div>
                              {dept.pendingDays &&
                                dept.pendingDays.slice(0, dept.morningOverdue || 1).map((day, i) => (
                                  <div key={`morning-${i}`} className="text-xs ml-3">
                                    {day}
                                  </div>
                                ))}
                            </div>
                          )}

                          {dept.requiredShifts.includes("afternoon") && dept.afternoon === "pending" && (
                            <div>
                              <div className="text-xs text-amber-600 font-medium">
                                Afternoon shift: Pending for {dept.afternoonOverdue || 1} day(s)
                              </div>
                              {(
                                dept.afternoonPendingDays || dept.pendingDays?.slice(0, dept.afternoonOverdue || 1)
                              )?.map((day, i) => (
                                <div key={`afternoon-${i}`} className="text-xs ml-3">
                                  {day}
                                </div>
                              ))}
                            </div>
                          )}

                          {dept.requiredShifts.includes("night") && dept.night === "pending" && (
                            <div>
                              <div className="text-xs text-amber-600 font-medium">
                                Night shift: Pending for {dept.nightOverdue || 1} day(s)
                              </div>
                              {(dept.nightPendingDays || dept.pendingDays?.slice(0, dept.nightOverdue || 1))?.map(
                                (day, i) => (
                                  <div key={`night-${i}`} className="text-xs ml-3">
                                    {day}
                                  </div>
                                ),
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

