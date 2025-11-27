'use server'

import { createClient } from '@/lib/supabase/server'

export interface SearchResult {
  id: string
  title: string
  summary: string | null
  url: string | null
  file_name: string | null
  category: string | null
  favicon_url: string | null
  created_at: string
  arc: {
    id: string
    name: string
    icon: string
    color: string
  }
}

export async function searchResources(query: string): Promise<{
  results?: SearchResult[]
  error?: string
}> {
  if (!query || query.trim().length === 0) {
    return { results: [] }
  }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  try {
    // Use PostgreSQL full-text search
    const searchQuery = query
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0)
      .map(word => `${word}:*`)
      .join(' & ')

    const { data, error } = await supabase
      .from('resources')
      .select(`
        id,
        title,
        summary,
        url,
        file_name,
        category,
        favicon_url,
        created_at,
        arcs!inner (
          id,
          name,
          icon,
          color,
          user_id,
          is_public
        )
      `)
      .or(`user_id.eq.${user.id},arcs.is_public.eq.true`)
      .textSearch('fts', searchQuery)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Search error:', error)
      // Fallback to ILIKE search if full-text search fails
      return await fallbackSearch(query, user.id)
    }

    const results: SearchResult[] = (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      url: item.url,
      file_name: item.file_name,
      category: item.category,
      favicon_url: item.favicon_url,
      created_at: item.created_at,
      arc: {
        id: item.arcs.id,
        name: item.arcs.name,
        icon: item.arcs.icon,
        color: item.arcs.color,
      },
    }))

    return { results }
  } catch (error) {
    console.error('Search error:', error)
    return { error: '검색 중 오류가 발생했습니다.' }
  }
}

async function fallbackSearch(query: string, userId: string): Promise<{
  results?: SearchResult[]
  error?: string
}> {
  const supabase = await createClient()

  const searchPattern = `%${query}%`

  const { data, error } = await supabase
    .from('resources')
    .select(`
      id,
      title,
      summary,
      url,
      file_name,
      category,
      favicon_url,
      created_at,
      arcs!inner (
        id,
        name,
        icon,
        color,
        user_id,
        is_public
      )
    `)
    .or(`title.ilike.${searchPattern},summary.ilike.${searchPattern}`)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Fallback search error:', error)
    return { error: '검색 중 오류가 발생했습니다.' }
  }

  // Filter by user access
  const results: SearchResult[] = (data || [])
    .filter((item: any) => item.arcs.user_id === userId || item.arcs.is_public)
    .map((item: any) => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      url: item.url,
      file_name: item.file_name,
      category: item.category,
      favicon_url: item.favicon_url,
      created_at: item.created_at,
      arc: {
        id: item.arcs.id,
        name: item.arcs.name,
        icon: item.arcs.icon,
        color: item.arcs.color,
      },
    }))

  return { results }
}

export async function searchArcs(query: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  const searchPattern = `%${query}%`

  const { data, error } = await supabase
    .from('arcs')
    .select('*')
    .eq('user_id', user.id)
    .or(`name.ilike.${searchPattern},goal.ilike.${searchPattern}`)
    .order('updated_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Arc search error:', error)
    return { error: '검색 중 오류가 발생했습니다.' }
  }

  return { results: data }
}
