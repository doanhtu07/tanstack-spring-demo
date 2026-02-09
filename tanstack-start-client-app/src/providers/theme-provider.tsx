import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ScriptOnce } from '@tanstack/react-router'
import type { PropsWithChildren } from 'react'
import { SharedClassNames } from '@/utils/shared-class-names'
import { cn } from '@/utils/tailwind-merge'

/**
 * Links:
 *
 * - https://tanstack.com/router/v1/docs/framework/react/guide/document-head-management#inline-scripts-with-scriptonce
 *
 * - https://nisabmohd.vercel.app/tanstack-dark (Another cool way to implement dark mode using server action + cookie)
 *  - But this does not check for media query prefers-color-scheme
 */

// MARK: Helpers

const isBrowser = (globalThis as any).window !== undefined

/**
 * https://tanstack.com/router/v1/docs/framework/react/guide/document-head-management#inline-scripts-with-scriptonce
 *
 * If your script modifies the DOM before hydration (like adding a class to <html>), use suppressHydrationWarning to prevent React warnings
 */
function runThemeScript(storageKey: string, darkClass: string) {
  const theme = localStorage.getItem(storageKey)

  if (
    theme === 'dark' ||
    ((theme === null || theme === 'system') &&
      globalThis.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add(darkClass)
  }
}

// MARK: Theme Provider

export type ResolvedTheme = 'dark' | 'light'
export type Theme = ResolvedTheme | 'system'

type ThemeProviderProps = PropsWithChildren & {
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => null,
  toggleTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

/**
 * 1.Manage theme state
 * 2. Prevent FOUC (flash of unstyled content) by injecting a script
 *  that sets the initial theme class on the document element before React hydration
 */
export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'app-theme',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() =>
    isBrowser
      ? (localStorage.getItem(storageKey) as Theme | null) || defaultTheme
      : defaultTheme,
  )
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light')

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme: (newTheme: Theme) => {
        localStorage.setItem(storageKey, newTheme)
        setTheme(newTheme)
      },
      toggleTheme: () => {
        const newTheme: Theme =
          theme === 'dark' || theme === 'system' ? 'light' : 'dark'
        localStorage.setItem(storageKey, newTheme)
        setTheme(newTheme)
      },
    }),
    [theme, resolvedTheme, storageKey],
  )

  // MARK: Effects

  // Effect: Add transition classes to body ONLY after React hydration to prevent color animation on first load
  useEffect(() => {
    const body = globalThis.document.body
    body.classList.add(cn('transition-[background-color]!'), cn('duration-200'))
  }, [])

  // Effect: Listen for theme changes and update the document theme class accordingly
  useEffect(() => {
    const root = globalThis.document.documentElement

    const mediaQuery = globalThis.window.matchMedia(
      '(prefers-color-scheme: dark)',
    )

    function updateTheme() {
      root.classList.remove(SharedClassNames.light, SharedClassNames.dark)

      if (theme === 'system') {
        const systemTheme = mediaQuery.matches
          ? SharedClassNames.dark
          : SharedClassNames.light

        setResolvedTheme(systemTheme)
        root.classList.add(systemTheme)

        return
      }

      setResolvedTheme(theme)
      root.classList.add(theme)
    }

    mediaQuery.addEventListener('change', updateTheme)
    updateTheme()

    return () => {
      mediaQuery.removeEventListener('change', updateTheme)
    }
  }, [theme])

  // MARK: Renderers

  return (
    <ThemeProviderContext.Provider value={value}>
      <ScriptOnce>{`(${runThemeScript.toString()})('${storageKey}', '${SharedClassNames.dark}')`}</ScriptOnce>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeProviderContext)
  return context
}
