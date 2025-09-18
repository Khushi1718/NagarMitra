'use client'

import * as React from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from './theme-provider'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="theme-toggle theme-toggle--loading">
        <div className="theme-toggle__icon">
          <Monitor className="icon" />
        </div>
      </button>
    )
  }

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="icon" />
      case 'dark':
        return <Moon className="icon" />
      default:
        return <Monitor className="icon" />
    }
  }

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light mode'
      case 'dark':
        return 'Dark mode'
      default:
        return 'System mode'
    }
  }

  return (
    <button
      onClick={cycleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} mode`}
      title={getLabel()}
    >
      <div className="theme-toggle__icon">
        {getIcon()}
      </div>
      <span className="theme-toggle__label">
        {getLabel()}
      </span>
    </button>
  )
}

export function ThemeToggleCompact() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="theme-toggle theme-toggle--compact theme-toggle--loading">
        <Monitor className="icon" />
      </button>
    )
  }

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="icon" />
      case 'dark':
        return <Moon className="icon" />
      default:
        return <Monitor className="icon" />
    }
  }

  return (
    <button
      onClick={cycleTheme}
      className="theme-toggle theme-toggle--compact"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} mode`}
      title={`Current: ${theme} mode`}
    >
      {getIcon()}
    </button>
  )
}