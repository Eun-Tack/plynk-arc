'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import {
  ExternalLink,
  FileText,
  Image,
  File,
  MoreVertical,
  Trash2,
  Copy,
  Check,
  Pencil
} from 'lucide-react'
import { deleteResource } from '@/app/actions/resources'
import { useRouter } from 'next/navigation'
import { ResourceEditModal } from './ResourceEditModal'

interface Tag {
  id: string
  name: string
  color: string | null
}

interface ResourceTag {
  tag_id: string
  tags: Tag
}

interface ResourceCardProps {
  resource: {
    id: string
    url: string | null
    file_url: string | null
    file_name: string | null
    mime_type: string | null
    title: string
    summary: string | null
    content_type: string | null
    favicon_url: string | null
    created_at: string
    resource_tags?: ResourceTag[]
  }
  isOwner: boolean
}

const CONTENT_TYPE_LABELS: Record<string, string> = {
  article: '아티클',
  video: '비디오',
  tool: '도구',
  documentation: '문서',
  tutorial: '튜토리얼',
  news: '뉴스',
}

export function ResourceCard({ resource, isOwner }: ResourceCardProps) {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // 태그 추출
  const tags = resource.resource_tags?.map(rt => rt.tags).filter(Boolean) || []

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
    if (!confirm('이 리소스를 삭제하시겠습니까?')) return

    setIsDeleting(true)
    const result = await deleteResource(resource.id)

    if (result.error) {
      alert(result.error)
      setIsDeleting(false)
    } else {
      router.refresh()
    }
  }

  function handleCopyUrl() {
    if (resource.url) {
      navigator.clipboard.writeText(resource.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
    setShowMenu(false)
  }

  function getIcon() {
    if (resource.url) {
      if (resource.favicon_url) {
        return (
          <img
            src={resource.favicon_url}
            alt=""
            className="w-5 h-5 rounded"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        )
      }
      return <ExternalLink className="w-5 h-5 text-blue-500" />
    }

    const mimeType = resource.mime_type || ''
    if (mimeType.startsWith('image/')) {
      return <Image className="w-5 h-5 text-purple-500" />
    }
    if (mimeType === 'application/pdf') {
      return <FileText className="w-5 h-5 text-red-500" />
    }
    return <File className="w-5 h-5 text-gray-500" />
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function getDomain(url: string) {
    try {
      return new URL(url).hostname.replace('www.', '')
    } catch {
      return ''
    }
  }

  return (
    <Card className={`group relative transition-all hover:shadow-md ${isDeleting ? 'opacity-50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
            {getIcon()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                  {resource.title}
                </h3>
                {resource.url && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:text-primary-600 flex items-center gap-1 mt-0.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {getDomain(resource.url)}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {resource.file_name && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {resource.file_name}
                  </p>
                )}
              </div>

              {/* Content Type Badge */}
              {resource.content_type && (
                <span className="text-xs px-2 py-0.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex-shrink-0">
                  {CONTENT_TYPE_LABELS[resource.content_type] || resource.content_type}
                </span>
              )}
            </div>

            {/* Summary */}
            {resource.summary && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-1">
                {resource.summary}
              </p>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.slice(0, 5).map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
                {tags.length > 5 && (
                  <span className="text-xs text-gray-400">+{tags.length - 5}</span>
                )}
              </div>
            )}

            {/* Meta */}
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span>{formatDate(resource.created_at)}</span>
            </div>
          </div>

          {/* Menu */}
          {isOwner && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                  <button
                    onClick={() => {
                      setShowMenu(false)
                      setShowEditModal(true)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Pencil className="w-4 h-4" />
                    수정
                  </button>
                  {resource.url && (
                    <button
                      onClick={handleCopyUrl}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-green-500" />
                          복사됨
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          URL 복사
                        </>
                      )}
                    </button>
                  )}
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
          )}
        </div>
      </CardContent>

      {/* Edit Modal */}
      {showEditModal && (
        <ResourceEditModal
          resource={resource}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </Card>
  )
}
