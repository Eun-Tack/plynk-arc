'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FolderOpen, Plus, Search, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: '홈', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Arcs', href: '/arcs', icon: FolderOpen },
  { name: '추가', href: '/arcs/new', icon: Plus, highlight: true },
  { name: '검색', href: '/search', icon: Search },
  { name: '프로필', href: '/profile', icon: User },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          if (item.highlight) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center justify-center w-12 h-12 -mt-4 bg-primary-500 rounded-full text-white shadow-lg"
              >
                <item.icon className="w-6 h-6" />
              </Link>
            )
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 py-2 px-3',
                isActive
                  ? 'text-primary-500 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
