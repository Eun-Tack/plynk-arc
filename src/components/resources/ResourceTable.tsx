'use client'

import { useState } from 'react'
import { ExternalLink, FileText, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { deleteResource } from '@/app/actions/resources'
import { useRouter } from 'next/navigation'

interface Tag {
  id: string
  name: string
  color: string | null
}

interface ResourceTag {
  tag_id: string
  tags: Tag
}

interface Resource {
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

interface ResourceTableProps {
  resources: Resource[]
  isOwner: boolean
}

type SortKey = 'title' | 'content_type' | 'created_at' | 'source'

// 글자 제한
const TITLE_LIMIT = 40
const SUMMARY_LIMIT = 60
type SortOrder = 'asc' | 'desc'

const CONTENT_TYPE_LABELS: Record<string, string> = {
  article: '아티클',
  video: '비디오',
  tool: '도구',
  documentation: '문서',
  tutorial: '튜토리얼',
  news: '뉴스',
}

export function ResourceTable({ resources, isOwner }: ResourceTableProps) {
  const router = useRouter()
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  function getSource(url: string | null) {
    if (!url) return ''
    try {
      return new URL(url).hostname.replace('www.', '')
    } catch {
      return ''
    }
  }

  function truncateText(text: string | null, limit: number) {
    if (!text) return '-'
    if (text.length <= limit) return text
    return text.slice(0, limit) + '...'
  }

  // 출처 정보와 태그를 포함한 리소스 배열 생성
  const resourcesWithSource = resources.map(r => ({
    ...r,
    source: getSource(r.url),
    tags: r.resource_tags?.map(rt => rt.tags).filter(Boolean) || []
  }))

  const sortedResources = [...resourcesWithSource].sort((a, b) => {
    let aVal: string
    let bVal: string

    if (sortKey === 'source') {
      aVal = a.source || ''
      bVal = b.source || ''
    } else {
      aVal = (a as any)[sortKey] || ''
      bVal = (b as any)[sortKey] || ''
    }

    if (sortKey === 'created_at') {
      aVal = new Date(aVal).getTime().toString()
      bVal = new Date(bVal).getTime().toString()
    }

    if (sortOrder === 'asc') {
      return aVal.localeCompare(bVal)
    }
    return bVal.localeCompare(aVal)
  })

  async function handleDelete(id: string) {
    if (!confirm('이 리소스를 삭제하시겠습니까?')) return

    setDeletingId(id)
    const result = await deleteResource(id)

    if (result.error) {
      alert(result.error)
    } else {
      router.refresh()
    }
    setDeletingId(null)
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) return null
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    )
  }

  if (resources.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        리소스가 없습니다
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            {/* 타입 */}
            <th className="text-left py-3 px-3 text-sm font-medium text-gray-500 dark:text-gray-400 w-12">
              타입
            </th>
            {/* 제목 */}
            <th
              className="text-left py-3 px-3 text-sm font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
              onClick={() => handleSort('title')}
            >
              제목
              <SortIcon columnKey="title" />
            </th>
            {/* 태그 */}
            <th className="text-left py-3 px-3 text-sm font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">
              태그
            </th>
            {/* 유형 */}
            <th
              className="text-left py-3 px-3 text-sm font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 hidden sm:table-cell"
              onClick={() => handleSort('content_type')}
            >
              유형
              <SortIcon columnKey="content_type" />
            </th>
            {/* 요약 */}
            <th className="text-left py-3 px-3 text-sm font-medium text-gray-500 dark:text-gray-400 hidden xl:table-cell">
              요약
            </th>
            {/* 출처 */}
            <th
              className="text-left py-3 px-3 text-sm font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 hidden lg:table-cell"
              onClick={() => handleSort('source')}
            >
              출처
              <SortIcon columnKey="source" />
            </th>
            {/* 날짜 */}
            <th
              className="text-left py-3 px-3 text-sm font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
              onClick={() => handleSort('created_at')}
            >
              날짜
              <SortIcon columnKey="created_at" />
            </th>
            {/* 작업 */}
            {isOwner && (
              <th className="text-right py-3 px-3 text-sm font-medium text-gray-500 dark:text-gray-400 w-12">

              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {sortedResources.map((resource) => (
            <tr
              key={resource.id}
              className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                deletingId === resource.id ? 'opacity-50' : ''
              }`}
            >
              {/* 타입 아이콘 */}
              <td className="py-3 px-3">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                  {resource.url ? (
                    resource.favicon_url ? (
                      <img
                        src={resource.favicon_url}
                        alt=""
                        className="w-4 h-4 rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    ) : (
                      <ExternalLink className="w-4 h-4 text-blue-500" />
                    )
                  ) : (
                    <FileText className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              </td>

              {/* 제목 */}
              <td className="py-3 px-3">
                <p
                  className="font-medium text-gray-900 dark:text-white text-sm"
                  title={resource.title}
                >
                  {truncateText(resource.title, TITLE_LIMIT)}
                </p>
              </td>

              {/* 태그 */}
              <td className="py-3 px-3 hidden md:table-cell">
                {resource.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {resource.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.id}
                        className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full"
                      >
                        {tag.name}
                      </span>
                    ))}
                    {resource.tags.length > 3 && (
                      <span className="text-xs text-gray-400">+{resource.tags.length - 3}</span>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">-</span>
                )}
              </td>

              {/* 유형 */}
              <td className="py-3 px-3 hidden sm:table-cell">
                {resource.content_type ? (
                  <span className="text-xs px-2 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full">
                    {CONTENT_TYPE_LABELS[resource.content_type] || resource.content_type}
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>

              {/* 요약 */}
              <td className="py-3 px-3 hidden xl:table-cell">
                <p
                  className="text-sm text-gray-600 dark:text-gray-400 max-w-xs"
                  title={resource.summary || ''}
                >
                  {truncateText(resource.summary, SUMMARY_LIMIT)}
                </p>
              </td>

              {/* 출처 */}
              <td className="py-3 px-3 hidden lg:table-cell">
                {resource.url ? (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 flex items-center gap-1"
                  >
                    {resource.source}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : resource.file_name ? (
                  <span className="text-sm text-gray-500">파일</span>
                ) : (
                  <span className="text-sm text-gray-400">-</span>
                )}
              </td>

              {/* 날짜 */}
              <td className="py-3 px-3 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {formatDate(resource.created_at)}
              </td>

              {/* 작업 */}
              {isOwner && (
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => handleDelete(resource.id)}
                    disabled={deletingId === resource.id}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
