import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { fetchUrlContent, fetchUrlMetadata } from '@/lib/jina'
import { generateSummary } from '@/lib/gemini'

// POST /api/resources - Add a new resource
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const body = await request.json()
    const { arcId, url, customTitle } = body

    if (!arcId || !url) {
      return NextResponse.json({ error: 'arcId와 url이 필요합니다.' }, { status: 400 })
    }

    // Verify arc ownership
    const { data: arc } = await supabase
      .from('arcs')
      .select('id, user_id')
      .eq('id', arcId)
      .eq('user_id', user.id)
      .single()

    if (!arc) {
      return NextResponse.json({ error: 'Arc를 찾을 수 없거나 접근 권한이 없습니다.' }, { status: 403 })
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: '올바른 URL을 입력해주세요.' }, { status: 400 })
    }

    // Fetch content
    let extractedTitle = ''
    let content = ''
    let description: string | null = null
    let favicon: string | null = null

    try {
      const jinaResult = await fetchUrlContent(url)
      extractedTitle = jinaResult.title
      content = jinaResult.content
      description = jinaResult.description || null
    } catch (jinaError) {
      console.log('Jina Reader failed, falling back to metadata extraction')
      const metadata = await fetchUrlMetadata(url)
      extractedTitle = metadata.title
      description = metadata.description
      favicon = metadata.favicon
    }

    const title = customTitle || extractedTitle

    if (!favicon) {
      const urlObj = new URL(url)
      favicon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`
    }

    // Generate AI summary
    const { summary, contentType } = await generateSummary(
      content || description || title,
      title,
      url
    )

    // Save to database
    const { data, error } = await supabase
      .from('resources')
      .insert({
        arc_id: arcId,
        user_id: user.id,
        url,
        title,
        summary,
        content: content?.slice(0, 50000) || null,
        content_type: contentType,
        favicon_url: favicon,
      })
      .select()
      .single()

    if (error) {
      console.error('Resource creation error:', error)
      return NextResponse.json({ error: '리소스 저장에 실패했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ success: true, resource: data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: '처리 중 오류가 발생했습니다.' }, { status: 500 })
  }
}

// GET /api/resources/arcs - Get user's arcs for selection
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const { data: arcs, error } = await supabase
      .from('arcs')
      .select('id, name, icon, color')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: 'Arc 목록을 불러오지 못했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ arcs })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: '처리 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
