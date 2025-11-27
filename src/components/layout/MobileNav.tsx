'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, FolderOpen, Plus, Search, User, X, Loader2, Link as LinkIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface Arc {
  id: string
  name: string
  icon: string
  color: string
}

const navItems = [
  { name: '홈', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Arcs', href: '/arcs', icon: FolderOpen },
  { name: '추가', href: '#', icon: Plus, highlight: true, isAddButton: true },
  { name: '검색', href: '/search', icon: Search },
  { name: '프로필', href: '/profile', icon: User },
]

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [showAddModal, setShowAddModal] = useState(false)
  const [arcs, setArcs] = useState<Arc[]>([])
  const [selectedArcId, setSelectedArcId] = useState<string>('')
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Arc 목록 로드
  useEffect(() => {
    if (showAddModal) {
      loadArcs()
    }
  }, [showAddModal])

  async function loadArcs() {
    setIsLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setIsLoading(false)
      return
    }

    const { data } = await supabase
      .from('arcs')
      .select('id, name, icon, color')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    setArcs(data || [])
    if (data && data.length > 0) {
      setSelectedArcId(data[0].id)
    }
    setIsLoading(false)
  }

  async function handleSave() {
    if (!selectedArcId || !url.trim()) return

    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          arcId: selectedArcId,
          url: url.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '저장에 실패했습니다.')
      }

      // 성공 시 모달 닫고 해당 Arc로 이동
      setShowAddModal(false)
      setUrl('')
      router.push(`/arcs/${selectedArcId}`)
      router.refresh()
    } catch (err: any) {
      setError(err.message || '저장에 실패했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  function handleAddClick() {
    setShowAddModal(true)
    setError(null)
    setUrl('')
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

            if (item.highlight && item.isAddButton) {
              return (
                <button
                  key={item.name}
                  onClick={handleAddClick}
                  className="flex items-center justify-center w-12 h-12 -mt-4 bg-primary-500 rounded-full text-white shadow-lg active:scale-95 transition-transform"
                >
                  <item.icon className="w-6 h-6" />
                </button>
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

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center md:items-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />

          {/* Modal */}
          <div className="relative w-full md:max-w-md bg-white dark:bg-gray-900 rounded-t-2xl md:rounded-2xl shadow-xl animate-slide-up">
            {/* Handle bar (mobile) */}
            <div className="flex justify-center pt-3 md:hidden">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                자료 추가
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                </div>
              ) : arcs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    먼저 Arc를 만들어주세요.
                  </p>
                  <button
                    onClick={() => {
                      setShowAddModal(false)
                      router.push('/arcs/new')
                    }}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg"
                  >
                    Arc 만들기
                  </button>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Arc Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Arc 선택
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
                      {arcs.map((arc) => (
                        <button
                          key={arc.id}
                          onClick={() => setSelectedArcId(arc.id)}
                          className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all flex-shrink-0',
                            selectedArcId === arc.id
                              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 ring-2 ring-primary-500'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                          )}
                        >
                          <span>{arc.icon}</span>
                          <span className="text-sm font-medium">{arc.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* URL Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      URL
                    </label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={handleSave}
                    disabled={isSaving || !selectedArcId || !url.trim()}
                    className="w-full py-3 bg-primary-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        저장 중...
                      </>
                    ) : (
                      '저장하기'
                    )}
                  </button>
                </>
              )}
            </div>

            {/* Bottom safe area */}
            <div className="h-6 md:hidden" />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
