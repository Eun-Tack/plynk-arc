'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createArc(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  // Check arc limit
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('arc_limit')
    .eq('id', user.id)
    .single()

  const { count } = await supabase
    .from('arcs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const arcLimit = (profile as any)?.arc_limit || 2
  if ((count || 0) >= arcLimit) {
    return { error: `Arc 개수 한도(${arcLimit}개)에 도달했습니다.` }
  }

  const name = formData.get('name') as string
  const goal = formData.get('goal') as string
  const icon = formData.get('icon') as string || '⌒'
  const color = formData.get('color') as string || '#3B82F6'

  if (!name || name.trim().length === 0) {
    return { error: 'Arc 이름을 입력해주세요.' }
  }

  const { data, error } = await supabase
    .from('arcs')
    .insert({
      user_id: user.id,
      name: name.trim(),
      goal: goal?.trim() || null,
      icon,
      color,
    })
    .select()
    .single()

  if (error) {
    console.error('Arc creation error:', error)
    return { error: 'Arc 생성에 실패했습니다.' }
  }

  revalidatePath('/arcs')
  revalidatePath('/dashboard')

  return { success: true, arc: data }
}

export async function updateArc(arcId: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  const name = formData.get('name') as string
  const goal = formData.get('goal') as string
  const icon = formData.get('icon') as string
  const color = formData.get('color') as string
  const isPublic = formData.get('isPublic') === 'true'
  const autoSynthesisEnabled = formData.get('autoSynthesisEnabled') !== 'false'
  const autoSynthesisThreshold = parseInt(formData.get('autoSynthesisThreshold') as string) || 10

  if (!name || name.trim().length === 0) {
    return { error: 'Arc 이름을 입력해주세요.' }
  }

  const { data, error } = await supabase
    .from('arcs')
    .update({
      name: name.trim(),
      goal: goal?.trim() || null,
      icon,
      color,
      is_public: isPublic,
      auto_synthesis_enabled: autoSynthesisEnabled,
      auto_synthesis_threshold: autoSynthesisThreshold,
    })
    .eq('id', arcId)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Arc update error:', error)
    return { error: 'Arc 수정에 실패했습니다.' }
  }

  revalidatePath('/arcs')
  revalidatePath(`/arcs/${arcId}`)
  revalidatePath('/dashboard')

  return { success: true, arc: data }
}

export async function deleteArc(arcId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  const { error } = await supabase
    .from('arcs')
    .delete()
    .eq('id', arcId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Arc deletion error:', error)
    return { error: 'Arc 삭제에 실패했습니다.' }
  }

  revalidatePath('/arcs')
  revalidatePath('/dashboard')

  return { success: true }
}

export async function getArc(arcId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  const { data, error } = await supabase
    .from('arcs')
    .select('*')
    .eq('id', arcId)
    .single()

  if (error) {
    console.error('Arc fetch error:', error)
    return { error: 'Arc를 찾을 수 없습니다.' }
  }

  // Check ownership or public access
  if (data.user_id !== user.id && !data.is_public) {
    return { error: '접근 권한이 없습니다.' }
  }

  return { success: true, arc: data }
}

export async function getArcs() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  const { data, error } = await supabase
    .from('arcs')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Arcs fetch error:', error)
    return { error: 'Arc 목록을 불러오는데 실패했습니다.' }
  }

  return { success: true, arcs: data }
}

export async function toggleArcPublic(arcId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  // Get current state
  const { data: arc } = await supabase
    .from('arcs')
    .select('is_public')
    .eq('id', arcId)
    .eq('user_id', user.id)
    .single()

  if (!arc) {
    return { error: 'Arc를 찾을 수 없습니다.' }
  }

  const { error } = await supabase
    .from('arcs')
    .update({ is_public: !arc.is_public })
    .eq('id', arcId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Arc toggle error:', error)
    return { error: '공개 상태 변경에 실패했습니다.' }
  }

  revalidatePath('/arcs')
  revalidatePath(`/arcs/${arcId}`)

  return { success: true, isPublic: !arc.is_public }
}
