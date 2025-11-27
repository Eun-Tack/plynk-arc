'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { Globe, Lock, FileText, MoreVertical, Edit, Trash2, Share } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { deleteArc, toggleArcPublic } from '@/app/actions/arcs'
import { useRouter } from 'next/navigation'

interface ArcCardProps {
  arc: {
    id: string
    name: string
    goal: string | null
    icon: string
    color: string
    is_public: boolean
    resource_count: number
    updated_at: string
  }
}

export function ArcCard({ arc }: ArcCardProps) {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleDelete() {
    if (!confirm('이 Arc를 삭제하시겠습니까? 포함된 모든 리소스도 함께 삭제됩니다.')) {
      return
    }

    setIsDeleting(true)
    const result = await deleteArc(arc.id)

    if (result.error) {
      alert(result.error)
      setIsDeleting(false)
    } else {
      router.refresh()
    }
  }

  async function handleTogglePublic() {
    const result = await toggleArcPublic(arc.id)
    if (result.error) {
      alert(result.error)
    } else {
      router.refresh()
    }
    setShowMenu(false)
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60))
        return diffMinutes <= 1 ? '방금 전' : `${diffMinutes}분 전`
      }
      return `${diffHours}시간 전`
    }
    if (diffDays === 1) return '어제'
    if (diffDays < 7) return `${diffDays}일 전`
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
  }

  return (
    <Card className={`group relative transition-all hover:shadow-md ${isDeleting ? 'opacity-50' : ''}`}>
      <Link href={`/arcs/${arc.id}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ backgroundColor: `${arc.color}20` }}
            >
              {arc.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {arc.name}
                </h3>
                {arc.is_public ? (
                  <Globe className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                )}
              </div>

              {arc.goal && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {arc.goal}
                </p>
              )}

              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  {arc.resource_count}개 리소스
                </span>
                <span>{formatDate(arc.updated_at)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>

      {/* Menu Button */}
      <div className="absolute top-3 right-3" ref={menuRef}>
        <button
          onClick={(e) => {
            e.preventDefault()
            setShowMenu(!showMenu)
          }}
          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
        >
          <MoreVertical className="w-4 h-4 text-gray-500" />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
            <Link
              href={`/arcs/${arc.id}/edit`}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setShowMenu(false)}
            >
              <Edit className="w-4 h-4" />
              수정
            </Link>
            <button
              onClick={handleTogglePublic}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {arc.is_public ? (
                <>
                  <Lock className="w-4 h-4" />
                  비공개로 전환
                </>
              ) : (
                <>
                  <Share className="w-4 h-4" />
                  공개로 전환
                </>
              )}
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Trash2 className="w-4 h-4" />
              삭제
            </button>
          </div>
        )}
      </div>
    </Card>
  )
}
