import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { fetchUrlContent, fetchUrlMetadata } from '@/lib/jina'
import { generateSummary, generateYouTubeSummary } from '@/lib/gemini'
import { isYouTubeUrl, getYouTubeContent } from '@/lib/youtube'

// POST /api/preview - Preview URL metadata with AI analysis
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json({ error: 'URL이 필요합니다.' }, { status: 400 })
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: '올바른 URL을 입력해주세요.' }, { status: 400 })
    }

    let title = ''
    let summary = ''
    let contentType: string = 'article'
    let suggestedTags: string[] = []
    let favicon: string | null = null
    let content: string | null = null
    let extractionSuccess = true
    let thumbnailUrl: string | null = null
    let hasTranscript = true

    // YouTube URL 처리
    if (isYouTubeUrl(url)) {
      try {
        const ytContent = await getYouTubeContent(url)
        title = ytContent.title
        thumbnailUrl = ytContent.thumbnailUrl
        contentType = 'video'

        // YouTube 파비콘
        favicon = 'https://www.youtube.com/favicon.ico'

        if (ytContent.hasTranscript && ytContent.transcript) {
          // 자막 있음 - AI 요약
          const aiResult = await generateYouTubeSummary(
            ytContent.transcript,
            ytContent.title,
            url
          )
          summary = aiResult.summary
          suggestedTags = aiResult.suggestedTags
          content = ytContent.transcript
          hasTranscript = true
        } else {
          // 자막 없음
          summary = '자막이 없는 영상입니다. 영상을 직접 시청해주세요.'
          suggestedTags = extractTagsFromTitle(ytContent.title)
          hasTranscript = false
          extractionSuccess = false
        }
      } catch (ytError) {
        console.error('YouTube extraction error:', ytError)
        // YouTube 처리 실패 시 기본 메타데이터만
        const urlObj = new URL(url)
        title = 'YouTube 영상'
        favicon = 'https://www.youtube.com/favicon.ico'
        summary = '영상 정보를 가져올 수 없습니다.'
        contentType = 'video'
        extractionSuccess = false
        hasTranscript = false
      }
    } else {
      // 일반 URL 처리 (기존 로직)
      try {
        const jinaResult = await fetchUrlContent(url)
        title = jinaResult.title
        content = jinaResult.content || null
      } catch (jinaError) {
        console.log('Jina Reader failed, falling back to metadata extraction')
        extractionSuccess = false
        try {
          const metadata = await fetchUrlMetadata(url)
          title = metadata.title
          favicon = metadata.favicon
        } catch {
          const urlObj = new URL(url)
          title = urlObj.hostname
        }
      }

      // Get favicon if not already fetched
      if (!favicon) {
        const urlObj = new URL(url)
        favicon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`
      }

      // AI 분석으로 요약 및 태그 추천
      const aiResult = await generateSummary(
        content || title,
        title,
        url
      )
      summary = aiResult.summary
      contentType = aiResult.contentType
      suggestedTags = aiResult.suggestedTags
    }

    // 사용자의 기존 태그 목록 조회
    const { data: existingTags } = await supabase
      .from('tags')
      .select('name')
      .eq('user_id', user.id)
      .order('usage_count', { ascending: false })
      .limit(20)

    return NextResponse.json({
      success: true,
      preview: {
        url,
        title,
        summary,
        contentType,
        suggestedTags,
        favicon,
        content: content?.slice(0, 50000) || null,
        extractionSuccess,
        thumbnailUrl,
        hasTranscript,
      },
      existingTags: existingTags?.map(t => t.name) || [],
    })
  } catch (error) {
    console.error('Preview API error:', error)
    return NextResponse.json({ error: 'URL 미리보기 처리 중 오류가 발생했습니다.' }, { status: 500 })
  }
}

// 제목에서 간단한 태그 추출 (자막 없을 때 폴백)
function extractTagsFromTitle(title: string): string[] {
  const tags: string[] = []

  // 일반적인 기술/제품 키워드
  const keywords = [
    'AI', 'GPT', 'Claude', 'OpenAI', 'Google', 'Microsoft',
    'React', 'Next.js', 'Vue', 'Angular', 'Node.js', 'Python',
    'JavaScript', 'TypeScript', 'Rust', 'Go',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
    'ChatGPT', 'Gemini', 'Copilot', 'Cursor',
    '코딩', '개발', '프로그래밍', '튜토리얼',
  ]

  for (const keyword of keywords) {
    if (title.toLowerCase().includes(keyword.toLowerCase())) {
      tags.push(keyword)
    }
    if (tags.length >= 3) break
  }

  return tags
}
