"use client"

import type React from "react"
import { createContext, useContext } from "react"

type ThemeContextType = {
  colors: {
    background: string
    card: string
    cardAlt: string
    text: string
    textSecondary: string
    primary: string
    secondary: string
    accent: string
    border: string
    expense: string
    earning: string
    saving: string
  }
  spacing: {
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
  }
  borderRadius: {
    sm: number
    md: number
    lg: number
    xl: number
  }
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme: ThemeContextType = {
    colors: {
      background: "#121212",
      card: "#1E1E1E",
      cardAlt: "#252525",
      text: "#FFFFFF",
      textSecondary: "#AAAAAA",
      primary: "#6C5CE7",
      secondary: "#8C7AE6",
      accent: "#A29BFE",
      border: "#2A2A2A",
      expense: "#FF6B6B",
      earning: "#1DD1A1",
      saving: "#FFC312",
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
    },
  }

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

