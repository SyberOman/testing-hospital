"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type ThemeColor = {
  name: string
  primary: string
  secondary: string
  accent: string
}

// Update the Settings type to add a new option for showing both custom logo and text
type Settings = {
  sidebarTitle: string
  logoType: "icon" | "text" | "both" | "custom" | "custom-with-text"
  customLogo: string | null
  sidebarIconColor: string
  themeColor: ThemeColor
}

type SettingsContextType = {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
  resetSettings: () => void
  availableThemes: ThemeColor[]
}

const defaultThemes: ThemeColor[] = [
  {
    name: "Blue",
    primary: "221.2 83.2% 53.3%",
    secondary: "210 40% 96.1%",
    accent: "210 40% 96.1%",
  },
  {
    name: "Green",
    primary: "142.1 76.2% 36.3%",
    secondary: "141.7 76.6% 96.1%",
    accent: "141.7 76.6% 96.1%",
  },
  {
    name: "Red",
    primary: "0 84.2% 60.2%",
    secondary: "0 84.2% 96.1%",
    accent: "0 84.2% 96.1%",
  },
  {
    name: "Purple",
    primary: "262.1 83.3% 57.8%",
    secondary: "262.1 83.3% 96.1%",
    accent: "262.1 83.3% 96.1%",
  },
  {
    name: "Orange",
    primary: "24.6 95% 53.1%",
    secondary: "24.6 95% 96.1%",
    accent: "24.6 95% 96.1%",
  },
]

const defaultSettings: Settings = {
  sidebarTitle: "Hospital Reports",
  logoType: "both",
  customLogo: null,
  sidebarIconColor: "#3b82f6", // Default blue color
  themeColor: defaultThemes[0],
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("app-settings")
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error("Failed to parse saved settings:", error)
      }
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("app-settings", JSON.stringify(settings))

    // Apply theme colors to CSS variables
    document.documentElement.style.setProperty("--primary", settings.themeColor.primary)
    document.documentElement.style.setProperty("--secondary", settings.themeColor.secondary)
    document.documentElement.style.setProperty("--accent", settings.themeColor.accent)

    // Apply sidebar icon color
    document.documentElement.style.setProperty("--sidebar-icon-color", settings.sidebarIconColor)
  }, [settings])

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        availableThemes: defaultThemes,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}

