import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { ExternalLink, FileText, Search } from 'lucide-react'
import type { SearchResult } from '@/app/actions/search'

interface SearchResultsProps {
  results: SearchResult[]
  query: string
}

export function SearchResults({ results, query }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          검색 결과가 없습니다
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          &quot;{query}&quot;에 대한 결과를 찾을 수 없습니다
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">
        {results.length}개의 결과
      </p>
      {results.map((result) => (
        <SearchResultCard key={result.id} result={result} />
      ))}
    </div>
  )
}

function SearchResultCard({ result }: { result: SearchResult }) {
  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
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
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
            {result.url ? (
              result.favicon_url ? (
                <img
                  src={result.favicon_url}
                  alt=""
                  className="w-5 h-5 rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              ) : (
                <ExternalLink className="w-5 h-5 text-blue-500" />
              )
            ) : (
              <FileText className="w-5 h-5 text-gray-500" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                  {result.title}
                </h3>
                {result.url && (
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:text-primary-600 flex items-center gap-1 mt-0.5"
                  >
                    {getDomain(result.url)}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Category */}
              {result.category && (
                <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full flex-shrink-0">
                  {result.category}
                </span>
              )}
            </div>

            {/* Summary */}
            {result.summary && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                {result.summary}
              </p>
            )}

            {/* Meta */}
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <Link
                href={`/arcs/${result.arc.id}`}
                className="flex items-center gap-1 hover:text-primary-600"
              >
                <span
                  className="w-4 h-4 rounded flex items-center justify-center text-xs"
                  style={{ backgroundColor: `${result.arc.color}20` }}
                >
                  {result.arc.icon}
                </span>
                {result.arc.name}
              </Link>
              <span>{formatDate(result.created_at)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
