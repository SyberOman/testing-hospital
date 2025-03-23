"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Save, RotateCcw, Check, Upload, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { useSettings } from "@/components/settings-context"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

export function SettingsView() {
  const { settings, updateSettings, resetSettings, availableThemes } = useSettings()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("appearance")
  const [sidebarTitle, setSidebarTitle] = useState(settings.sidebarTitle)
  const [logoType, setLogoType] = useState(settings.logoType)
  const [selectedTheme, setSelectedTheme] = useState(settings.themeColor.name)
  const [sidebarIconColor, setSidebarIconColor] = useState(settings.sidebarIconColor)
  const [customLogo, setCustomLogo] = useState<string | null>(settings.customLogo)
  const [logoPreview, setLogoPreview] = useState<string | null>(settings.customLogo)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    const themeColor = availableThemes.find((theme) => theme.name === selectedTheme) || availableThemes[0]

    updateSettings({
      sidebarTitle,
      logoType,
      customLogo,
      sidebarIconColor,
      themeColor,
    })

    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    })
  }

  const handleReset = () => {
    resetSettings()
    setSidebarTitle(settings.sidebarTitle)
    setLogoType(settings.logoType)
    setSelectedTheme(settings.themeColor.name)
    setSidebarIconColor(settings.sidebarIconColor)
    setCustomLogo(null)
    setLogoPreview(null)

    toast({
      title: "Settings reset",
      description: "Your settings have been reset to default values.",
    })
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      })
      return
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB.",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setLogoPreview(result)
      setCustomLogo(result)
      setLogoType("custom")
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveLogo = () => {
    setLogoPreview(null)
    setCustomLogo(null)
    setLogoType("both")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>Customize the appearance and behavior of the application</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="appearance" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="theme">Theme Colors</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sidebar-title">Sidebar Title</Label>
                <Input
                  id="sidebar-title"
                  value={sidebarTitle}
                  onChange={(e) => setSidebarTitle(e.target.value)}
                  placeholder="Enter sidebar title"
                />
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label>Logo Display</Label>
                <RadioGroup
                  value={logoType}
                  onValueChange={(value) =>
                    setLogoType(value as "icon" | "text" | "both" | "custom" | "custom-with-text")
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="icon" id="logo-icon" />
                    <Label htmlFor="logo-icon">Icon Only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="text" id="logo-text" />
                    <Label htmlFor="logo-text">Text Only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="logo-both" />
                    <Label htmlFor="logo-both">Default Icon and Text</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="logo-custom" disabled={!customLogo} />
                    <Label htmlFor="logo-custom" className={!customLogo ? "opacity-50" : ""}>
                      Custom Logo Only
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom-with-text" id="logo-custom-with-text" disabled={!customLogo} />
                    <Label htmlFor="logo-custom-with-text" className={!customLogo ? "opacity-50" : ""}>
                      Custom Logo and Text
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2 mt-4">
                <Label>Custom Logo</Label>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                    </Button>
                    {logoPreview && (
                      <Button variant="outline" onClick={handleRemoveLogo} className="w-full sm:w-auto">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove Logo
                      </Button>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/png,image/jpeg,image/gif"
                      onChange={handleLogoUpload}
                    />
                  </div>

                  {logoPreview && (
                    <div className="border rounded-md p-4 flex justify-center">
                      <img
                        src={logoPreview || "/placeholder.svg"}
                        alt="Logo Preview"
                        className="max-h-24 object-contain"
                      />
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground">
                    Upload a PNG, JPG, or GIF image (max 2MB). Recommended size: 128x128px.
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label htmlFor="sidebar-icon-color">Sidebar Icon Color</Label>
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-md border" style={{ backgroundColor: sidebarIconColor }} />
                  <Input
                    id="sidebar-icon-color"
                    type="color"
                    value={sidebarIconColor}
                    onChange={(e) => setSidebarIconColor(e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={sidebarIconColor}
                    onChange={(e) => setSidebarIconColor(e.target.value)}
                    placeholder="#000000"
                    className="w-32"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="theme" className="space-y-6 mt-6">
            <div className="space-y-4">
              <Label>Theme Color</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {availableThemes.map((theme) => (
                  <div
                    key={theme.name}
                    className={cn(
                      "relative flex flex-col items-center p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors",
                      selectedTheme === theme.name ? "border-primary ring-2 ring-primary" : "border-border",
                    )}
                    onClick={() => setSelectedTheme(theme.name)}
                  >
                    {selectedTheme === theme.name && (
                      <div className="absolute top-2 right-2 text-primary">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                    <div className="flex gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: `hsl(${theme.primary})` }} />
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: `hsl(${theme.secondary})` }} />
                    </div>
                    <span className="text-sm font-medium">{theme.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset to Default
        </Button>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  )
}

