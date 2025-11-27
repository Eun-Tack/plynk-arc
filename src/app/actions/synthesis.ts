'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { generateSynthesis } from '@/lib/gemini'

export async function createSynthesis(arcId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  // Verify arc ownership
  const { data: arc } = await supabase
    .from('arcs')
    .select('id, name, user_id')
    .eq('id', arcId)
    .eq('user_id', user.id)
    .single()

  if (!arc) {
    return { error: 'Arc를 찾을 수 없거나 접근 권한이 없습니다.' }
  }

  // Get resources for this arc with tags
  const { data: resources, error: resourcesError } = await supabase
    .from('resources')
    .select(`
      id, title, summary, content, category,
      resource_tags (
        tags (name)
      )
    `)
    .eq('arc_id', arcId)
    .order('created_at', { ascending: false })

  if (resourcesError) {
    return { error: '리소스를 불러오는데 실패했습니다.' }
  }

  if (!resources || resources.length < 2) {
    return { error: '합성하려면 최소 2개 이상의 리소스가 필요합니다.' }
  }

  try {
    // 태그 추출하여 resources에 추가
    const resourcesWithTags = resources.map(r => {
      // resource_tags 구조: Array<{ tags: { name: string } }>
      const tagNames: string[] = []
      if (r.resource_tags && Array.isArray(r.resource_tags)) {
        for (const rt of r.resource_tags) {
          const tagObj = rt as { tags?: { name?: string } }
          if (tagObj.tags?.name) {
            tagNames.push(tagObj.tags.name)
          }
        }
      }
      return {
        id: r.id,
        title: r.title,
        summary: r.summary,
        content: r.content,
        category: r.category,
        tags: tagNames,
      }
    })

    // Generate synthesis using AI (새 스토리라인 구조)
    const synthesisResult = await generateSynthesis(resourcesWithTags)

    // Save to database (새 구조로 저장)
    const { data, error } = await supabase
      .from('syntheses')
      .insert({
        arc_id: arcId,
        user_id: user.id,
        title: synthesisResult.title,
        // 새 스토리라인 구조를 storyline 필드에 저장
        storyline: synthesisResult.storyline,
        connections: synthesisResult.connections,
        action_items: synthesisResult.actionItems,
        resource_ids: resources.map(r => r.id),
        resource_count: resources.length,
        synthesis_type: 'manual',
        status: 'completed',
      })
      .select()
      .single()

    if (error) {
      console.error('Synthesis creation error:', error)
      return { error: '합성 저장에 실패했습니다.' }
    }

    revalidatePath(`/arcs/${arcId}`)

    return {
      success: true,
      synthesis: data,
    }
  } catch (error) {
    console.error('Synthesis error:', error)
    return { error: '합성 중 오류가 발생했습니다.' }
  }
}

export async function getSyntheses(arcId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  const { data, error } = await supabase
    .from('syntheses')
    .select('*')
    .eq('arc_id', arcId)
    .order('created_at', { ascending: false })

  if (error) {
    return { error: '합성 목록을 불러오는데 실패했습니다.' }
  }

  return { success: true, syntheses: data }
}

export async function deleteSynthesis(synthesisId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  // Get synthesis to find arc_id
  const { data: synthesis } = await supabase
    .from('syntheses')
    .select('arc_id, user_id')
    .eq('id', synthesisId)
    .single()

  if (!synthesis) {
    return { error: '합성을 찾을 수 없습니다.' }
  }

  if (synthesis.user_id !== user.id) {
    return { error: '삭제 권한이 없습니다.' }
  }

  const { error } = await supabase
    .from('syntheses')
    .delete()
    .eq('id', synthesisId)

  if (error) {
    return { error: '합성 삭제에 실패했습니다.' }
  }

  revalidatePath(`/arcs/${synthesis.arc_id}`)

  return { success: true }
}
