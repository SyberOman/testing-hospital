"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"

// Define the form schema with Zod
const formSchema = z.object({
  date: z.date(),
  department: z.string().min(1, "Department is required"),
  shift: z.enum(["M", "A", "N"]),
  staffCount: z.string().min(1, "Staff count is required"),
  moCount: z.string().min(1, "Medical officer count is required"),
  sickLeave: z.string().min(1, "Sick leave count is required"),
  opdCases: z.string().min(1, "OPD cases is required"),
  shortStayCases: z.string().min(1, "Short stay cases is required"),
  referralToBH: z.string().min(1, "Referral to BH is required"),
  rtaCases: z.string().min(1, "RTA cases is required"),
  mlcCases: z.string().min(1, "MLC cases is required"),
  escortCases: z.string().min(1, "Escort cases is required"),
  lamaCases: z.string().min(1, "LAMA cases is required"),
  dressingCases: z.string().min(1, "Dressing cases is required"),
  referralFromHHC: z.string().min(1, "Referral from HHC is required"),
  casesWithReferral: z.string().min(1, "Cases with referral is required"),
  casesWithoutReferral: z.string().min(1, "Cases without referral is required"),
  fridgeMinTemp: z.string().min(1, "Minimum fridge temperature is required"),
  fridgeMaxTemp: z.string().min(1, "Maximum fridge temperature is required"),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function ReportSubmissionForm() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableShifts, setAvailableShifts] = useState<("M" | "A" | "N")[]>(["M", "A", "N"])

  // Initialize the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      department: user?.department || "",
      shift: "M",
      staffCount: "",
      moCount: "",
      sickLeave: "",
      opdCases: "",
      shortStayCases: "",
      referralToBH: "",
      rtaCases: "",
      mlcCases: "",
      escortCases: "",
      lamaCases: "",
      dressingCases: "",
      referralFromHHC: "",
      casesWithReferral: "",
      casesWithoutReferral: "",
      fridgeMinTemp: "",
      fridgeMaxTemp: "",
      notes: "",
    },
  })

  const departments = [
    { label: "RESUS", value: "RESUS", requiredShifts: ["morning", "afternoon", "night"] },
    { label: "POPD", value: "POPD", requiredShifts: ["morning", "afternoon", "night"] },
    { label: "DERMA", value: "DERMA", requiredShifts: ["morning", "afternoon"] },
    { label: "ORTHO", value: "ORTHO", requiredShifts: ["morning", "afternoon", "night"] },
    { label: "SOPD", value: "SOPD", requiredShifts: ["morning", "afternoon"] },
    { label: "ENT", value: "ENT", requiredShifts: ["morning", "afternoon"] },
    { label: "ANC", value: "ANC", requiredShifts: ["morning"] },
    { label: "OPTHALMO", value: "OPTHALMO", requiredShifts: [] },
    { label: "SPECIALIST", value: "SPECIALIST", requiredShifts: ["morning", "afternoon", "night"] },
    { label: "DENTAL", value: "DENTAL", requiredShifts: ["morning", "afternoon"] },
  ]

  useEffect(() => {
    // Set department from user if available
    if (user?.department) {
      form.setValue("department", user.department)

      // Find the department configuration
      const deptConfig = departments.find((d) => d.value === user.department)
      if (deptConfig) {
        // Map the required shifts to form values
        const shifts: ("M" | "A" | "N")[] = []
        if (deptConfig.requiredShifts.includes("morning")) shifts.push("M")
        if (deptConfig.requiredShifts.includes("afternoon")) shifts.push("A")
        if (deptConfig.requiredShifts.includes("night")) shifts.push("N")

        setAvailableShifts(shifts)

        // Set default shift to the first available shift
        if (shifts.length > 0) {
          form.setValue("shift", shifts[0])
        }
      }
    }
  }, [user, form])

  const handleDepartmentChange = (value: string) => {
    form.setValue("department", value)

    // Find the department configuration
    const deptConfig = departments.find((d) => d.value === value)
    if (deptConfig) {
      // Map the required shifts to form values
      const shifts: ("M" | "A" | "N")[] = []
      if (deptConfig.requiredShifts.includes("morning")) shifts.push("M")
      if (deptConfig.requiredShifts.includes("afternoon")) shifts.push("A")
      if (deptConfig.requiredShifts.includes("night")) shifts.push("N")

      setAvailableShifts(shifts)

      // Set default shift to the first available shift
      if (shifts.length > 0) {
        form.setValue("shift", shifts[0])
      }
    }
  }

  function onSubmit(data: FormValues) {
    setIsSubmitting(true)

    // In a real app, we would make an API call to submit the report
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Report submitted successfully",
        description: `${data.department} ${data.shift} shift report for ${format(data.date, "PPP")} has been submitted.`,
      })

      // Reset specific form fields
      form.setValue("notes", "")
      form.setValue("rtaCases", "")
      form.setValue("mlcCases", "")
    }, 1500)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="cases">Cases Information</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="additional">Additional Details</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Department</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                                disabled={!!user?.department}
                              >
                                {field.value
                                  ? departments.find((d) => d.value === field.value)?.label
                                  : "Select department"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search department..." />
                              <CommandList>
                                <CommandEmpty>No department found.</CommandEmpty>
                                <CommandGroup>
                                  {departments.map((dept) => (
                                    <CommandItem
                                      key={dept.value}
                                      value={dept.value}
                                      onSelect={() => {
                                        form.setValue("department", dept.value)
                                        handleDepartmentChange(dept.value)
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value === dept.value ? "opacity-100" : "opacity-0",
                                        )}
                                      />
                                      {dept.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shift"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Shift</FormLabel>
                        <div className="grid grid-cols-3 gap-2">
                          {availableShifts.includes("M") && (
                            <Button
                              type="button"
                              variant={field.value === "M" ? "default" : "outline"}
                              onClick={() => form.setValue("shift", "M")}
                            >
                              Morning
                            </Button>
                          )}
                          {availableShifts.includes("A") && (
                            <Button
                              type="button"
                              variant={field.value === "A" ? "default" : "outline"}
                              onClick={() => form.setValue("shift", "A")}
                            >
                              Afternoon
                            </Button>
                          )}
                          {availableShifts.includes("N") && (
                            <Button
                              type="button"
                              variant={field.value === "N" ? "default" : "outline"}
                              onClick={() => form.setValue("shift", "N")}
                            >
                              Night
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="staffCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Staff Count</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Number of staff on duty" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="moCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical Officers</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Number of MOs on duty" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sickLeave"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Staff on Sick Leave</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Number of staff on sick leave" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="cases" className="space-y-4 mt-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="opdCases"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OPD Cases</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Number of OPD cases" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shortStayCases"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Stay Cases</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Number of short stay cases" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rtaCases"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RTA Cases</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Number of RTA cases" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mlcCases"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>MLC Cases</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Number of MLC cases" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="escortCases"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Escort Cases</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Number of escort cases" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lamaCases"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LAMA Cases</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Number of LAMA cases" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dressingCases"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dressing Cases</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Number of dressing cases" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="referrals" className="space-y-4 mt-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="referralToBH"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Referral to BH</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Number of referrals to BH" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="referralFromHHC"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Referral from HHC</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Number of referrals from HHC" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="casesWithReferral"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cases With Referral</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Number of cases with referral" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="casesWithoutReferral"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cases Without Referral</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Number of cases without referral" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="additional" className="space-y-4 mt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fridgeMinTemp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fridge Minimum Temperature</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Minimum temperature in °C" {...field} />
                        </FormControl>
                        <FormDescription>Record the minimum temperature of medication storage fridge</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fridgeMaxTemp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fridge Maximum Temperature</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Maximum temperature in °C" {...field} />
                        </FormControl>
                        <FormDescription>Record the maximum temperature of medication storage fridge</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any additional information or issues to report"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Report saved as draft",
                        description: "Your report has been saved as a draft.",
                      })
                    }}
                  >
                    Save as Draft
                  </Button>
                  <Button type="submit" disabled={isSubmitting || !form.getValues("department")}>
                    {isSubmitting ? "Submitting..." : "Submit Report"}
                  </Button>
                </div>
              </TabsContent>
            </form>
          </Form>
        </Tabs>
      </CardContent>
    </Card>
  )
}

