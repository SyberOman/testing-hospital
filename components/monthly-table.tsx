"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { MonthlyReportData } from "./monthly-reports-view"

export function MonthlyTable({ data }: { data: MonthlyReportData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Department Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Staff</TableHead>
                <TableHead className="text-right">MOs</TableHead>
                <TableHead className="text-right">Sick Leave</TableHead>
                <TableHead className="text-right">OPD</TableHead>
                <TableHead className="text-right">Short Stay</TableHead>
                <TableHead className="text-right">BH Ref.</TableHead>
                <TableHead className="text-right">RTA</TableHead>
                <TableHead className="text-right">MLC</TableHead>
                <TableHead className="text-right">Escort</TableHead>
                <TableHead className="text-right">LAMA</TableHead>
                <TableHead className="text-right">Dressing</TableHead>
                <TableHead className="text-right">HHC Ref.</TableHead>
                <TableHead className="text-right">With Ref.</TableHead>
                <TableHead className="text-right">No Ref.</TableHead>
                <TableHead className="text-right">Min Temp (°C)</TableHead>
                <TableHead className="text-right">Max Temp (°C)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((dept) => (
                <TableRow key={dept.department}>
                  <TableCell className="font-medium">{dept.department}</TableCell>
                  <TableCell className="text-right">{dept.staffCount}</TableCell>
                  <TableCell className="text-right">{dept.moCount}</TableCell>
                  <TableCell className="text-right">{dept.sickLeave}</TableCell>
                  <TableCell className="text-right">{dept.opdCases}</TableCell>
                  <TableCell className="text-right">{dept.shortStayCases}</TableCell>
                  <TableCell className="text-right">{dept.referralToBH}</TableCell>
                  <TableCell className="text-right">{dept.rtaCases}</TableCell>
                  <TableCell className="text-right">{dept.mlcCases}</TableCell>
                  <TableCell className="text-right">{dept.escortCases}</TableCell>
                  <TableCell className="text-right">{dept.lamaCases}</TableCell>
                  <TableCell className="text-right">{dept.dressingCases}</TableCell>
                  <TableCell className="text-right">{dept.referralFromHHC}</TableCell>
                  <TableCell className="text-right">{dept.casesWithReferral}</TableCell>
                  <TableCell className="text-right">{dept.casesWithoutReferral}</TableCell>
                  <TableCell className="text-right">{dept.avgFridgeMinTemp}</TableCell>
                  <TableCell className="text-right">{dept.avgFridgeMaxTemp}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold">
                <TableCell>TOTAL</TableCell>
                <TableCell className="text-right">{data.reduce((sum, d) => sum + d.staffCount, 0)}</TableCell>
                <TableCell className="text-right">{data.reduce((sum, d) => sum + d.moCount, 0)}</TableCell>
                <TableCell className="text-right">{data.reduce((sum, d) => sum + d.sickLeave, 0)}</TableCell>
                <TableCell className="text-right">{data.reduce((sum, d) => sum + d.opdCases, 0)}</TableCell>
                <TableCell className="text-right">{data.reduce((sum, d) => sum + d.shortStayCases, 0)}</TableCell>
                <TableCell className="text-right">{data.reduce((sum, d) => sum + d.referralToBH, 0)}</TableCell>
                <TableCell className="text-right">{data.reduce((sum, d) => sum + d.rtaCases, 0)}</TableCell>
                <TableCell className="text-right">{data.reduce((sum, d) => sum + d.mlcCases, 0)}</TableCell>
                <TableCell className="text-right">{data.reduce((sum, d) => sum + d.escortCases, 0)}</TableCell>
                <TableCell className="text-right">{data.reduce((sum, d) => sum + d.lamaCases, 0)}</TableCell>
                <TableCell className="text-right">{data.reduce((sum, d) => sum + d.dressingCases, 0)}</TableCell>
                <TableCell className="text-right">{data.reduce((sum, d) => sum + d.referralFromHHC, 0)}</TableCell>
                <TableCell className="text-right">{data.reduce((sum, d) => sum + d.casesWithReferral, 0)}</TableCell>
                <TableCell className="text-right">{data.reduce((sum, d) => sum + d.casesWithoutReferral, 0)}</TableCell>
                <TableCell className="text-right">-</TableCell>
                <TableCell className="text-right">-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

