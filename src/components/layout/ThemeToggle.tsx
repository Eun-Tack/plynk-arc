'use client'

import { useThemeStore } from '@/store/themeStore'
import { Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore()

  const options = [
    { value: 'light', icon: Sun, label: '라이트' },
    { value: 'dark', icon: Moon, label: '다크' },
    { value: 'system', icon: Monitor, label: '시스템' },
  ] as const

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            'p-2 rounded-md transition-all duration-150',
            theme === value
              ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-500'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          )}
          title={label}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  )
}

export function ThemeToggleSimple() {
  const { theme, setTheme } = useThemeStore()

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const Icon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      title={`현재: ${theme === 'light' ? '라이트' : theme === 'dark' ? '다크' : '시스템'}`}
    >
      <Icon className="w-5 h-5" />
    </button>
  )
}
