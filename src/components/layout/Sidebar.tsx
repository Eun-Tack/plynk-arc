'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FolderOpen,
  Search,
  Bell,
  Settings,
  HelpCircle,
  Plus,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: '대시보드', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Arcs', href: '/arcs', icon: FolderOpen },
  { name: 'Insights', href: '/insights', icon: Sparkles },
  { name: '검색', href: '/search', icon: Search },
  { name: '알림', href: '/notifications', icon: Bell },
]

const bottomNavigation = [
  { name: '설정', href: '/settings', icon: Settings },
  { name: '도움말', href: '/help', icon: HelpCircle },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-200',
          'md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full py-4">
          {/* New Arc Button */}
          <div className="px-4 mb-4">
            <Link
              href="/arcs/new"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
              onClick={onClose}
            >
              <Plus className="w-4 h-4" />
              새 Arc 만들기
            </Link>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Recent Arcs */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              최근 Arcs
            </h3>
            <div className="space-y-1">
              <Link
                href="/arcs"
                className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                onClick={onClose}
              >
                <span className="text-lg">⌒</span>
                <span className="truncate">모든 Arcs 보기</span>
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Link>
            </div>
          </div>

          {/* Bottom Navigation */}
          <nav className="px-2 pt-4 border-t border-gray-200 dark:border-gray-800 space-y-1">
            {bottomNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Upgrade Banner */}
          <div className="mx-4 mt-4 p-4 bg-gradient-to-r from-primary-500 to-violet-500 rounded-lg text-white">
            <p className="text-sm font-medium">무료 플랜</p>
            <p className="text-xs mt-1 opacity-80">2개의 Arc 사용 가능</p>
          </div>
        </div>
      </aside>
    </>
  )
}
