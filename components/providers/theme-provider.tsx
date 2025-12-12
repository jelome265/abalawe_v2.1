"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps as NextThemeProviderProps } from "next-themes"

// Define our own interface that matches what we're actually using
interface ThemeProviderProps extends Omit<NextThemeProviderProps, 'children'> {
    children: React.ReactNode
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
