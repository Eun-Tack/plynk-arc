import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateSynthesis } from '@/lib/gemini'
import { calculateInsightScore, canSynthesize } from '@/lib/insight-score'

// Vercel Cron에서 호출되는 Daily Summary 생성 API
// vercel.json에서 cron 설정 필요:
// "crons": [{ "path": "/api/cron/daily-summary", "schedule": "0 * * * *" }]

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// 태그 추출 헬퍼
function extractTags(resourceTags: unknown): string[] {
  if (!resourceTags || !Array.isArray(resourceTags)) return []
  const tags: string[] = []
  for (const rt of resourceTags) {
    const tagObj = rt as { tags?: { name?: string } }
    if (tagObj.tags?.name) {
      tags.push(tagObj.tags.name)
    }
  }
  return tags
}

export async function GET(request: NextRequest) {
  // Vercel Cron 인증 확인
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Service Role 키로 Supabase 클라이언트 생성 (RLS 우회)
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // 현재 시간 (UTC)
  const now = new Date()
  const currentHour = now.getUTCHours().toString().padStart(2, '0') + ':00'

  // 해당 시간에 요약을 받기로 설정한 사용자 조회
  // (실제로는 타임존 고려 필요)
  const { data: users, error: usersError } = await supabase
    .from('user_profiles')
    .select('id, email, daily_summary_min_count, daily_summary_time')
    .eq('daily_summary_enabled', true)
    .eq('daily_summary_time', currentHour)

  if (usersError) {
    console.error('Error fetching users:', usersError)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }

  if (!users || users.length === 0) {
    return NextResponse.json({ message: 'No users scheduled for this hour' })
  }

  const results = []

  for (const user of users) {
    try {
      // 지난 24시간 내 추가된 리소스 조회
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

      const { data: resources, error: resourcesError } = await supabase
        .from('resources')
        .select(`
          id, title, summary, content, category,
          arc_id,
          arcs (id, name),
          resource_tags (
            tags (name)
          )
        `)
        .eq('arcs.user_id', user.id)
        .gte('created_at', yesterday.toISOString())
        .order('created_at', { ascending: false })

      if (resourcesError) {
        console.error(`Error fetching resources for user ${user.id}:`, resourcesError)
        continue
      }

      // 최소 자료 개수 체크
      const minCount = user.daily_summary_min_count || 3
      if (!resources || resources.length < minCount) {
        results.push({
          userId: user.id,
          status: 'skipped',
          reason: `Not enough resources (${resources?.length || 0} < ${minCount})`,
        })
        continue
      }

      // 인사이트 점수 계산
      const scoreInput = resources.map(r => ({
        id: r.id,
        title: r.title,
        summary: r.summary,
        category: r.category,
        tags: extractTags(r.resource_tags),
      }))

      const score = calculateInsightScore({ resources: scoreInput })

      if (!canSynthesize(score)) {
        results.push({
          userId: user.id,
          status: 'skipped',
          reason: 'Insight score too low',
          score: score.score,
        })
        continue
      }

      // AI 합성 생성
      const resourcesWithTags = resources.map(r => ({
        id: r.id,
        title: r.title,
        summary: r.summary,
        content: r.content,
        category: r.category,
        tags: extractTags(r.resource_tags),
      }))

      const synthesis = await generateSynthesis(resourcesWithTags)

      // daily_summaries 테이블에 저장
      const { data: savedSummary, error: saveError } = await supabase
        .from('daily_summaries')
        .insert({
          user_id: user.id,
          title: synthesis.title,
          storyline: synthesis.storyline,
          connections: synthesis.connections,
          action_items: synthesis.actionItems,
          resource_ids: resources.map(r => r.id),
          resource_count: resources.length,
          insight_score: score.score,
          status: 'completed',
        })
        .select()
        .single()

      if (saveError) {
        console.error(`Error saving summary for user ${user.id}:`, saveError)
        results.push({
          userId: user.id,
          status: 'error',
          error: saveError.message,
        })
        continue
      }

      // TODO: 이메일 발송 로직 추가
      // 실제 이메일 발송은 Resend, SendGrid 등의 서비스 필요

      results.push({
        userId: user.id,
        status: 'success',
        summaryId: savedSummary.id,
        resourceCount: resources.length,
      })
    } catch (error) {
      console.error(`Error processing user ${user.id}:`, error)
      results.push({
        userId: user.id,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  return NextResponse.json({
    message: 'Daily summary job completed',
    processedAt: now.toISOString(),
    results,
  })
}

// Vercel Cron config
export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5분 타임아웃
