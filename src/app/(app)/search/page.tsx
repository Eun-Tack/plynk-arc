import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Search } from 'lucide-react'
import type { Metadata } from 'next'
import { SearchInput } from '@/components/search/SearchInput'
import { SearchResults } from '@/components/search/SearchResults'
import { searchResources } from '@/app/actions/search'

export const metadata: Metadata = {
  title: '검색 - plynk arc',
  description: '자료 검색',
}

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const query = params.q || ''
  let results: any[] = []
  let error: string | null = null

  if (query) {
    const searchResult = await searchResources(query)
    if (searchResult.error) {
      error = searchResult.error
    } else {
      results = searchResult.results || []
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          검색
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          모든 Arc에서 자료를 검색하세요
        </p>
      </div>

      {/* Search Input */}
      <SearchInput />

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Results or Empty State */}
      {query ? (
        <SearchResults results={results} query={query} />
      ) : (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            검색어를 입력하세요
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            제목, 내용, 요약으로 검색할 수 있습니다
          </p>
        </div>
      )}
    </div>
  )
}
