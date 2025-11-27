'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface UpdateDailySummaryParams {
  enabled: boolean
  time: string
  minCount: number
}

export async function updateDailySummarySettings(params: UpdateDailySummaryParams) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  const { error } = await supabase
    .from('user_profiles')
    .update({
      daily_summary_enabled: params.enabled,
      daily_summary_time: params.time,
      daily_summary_min_count: params.minCount,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    console.error('Profile update error:', error)
    return { error: '설정 저장에 실패했습니다.' }
  }

  revalidatePath('/profile')

  return { success: true }
}

interface UpdateProfileParams {
  fullName?: string
}

export async function updateProfile(params: UpdateProfileParams) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (params.fullName !== undefined) {
    updateData.full_name = params.fullName
  }

  const { error } = await supabase
    .from('user_profiles')
    .update(updateData)
    .eq('id', user.id)

  if (error) {
    console.error('Profile update error:', error)
    return { error: '프로필 저장에 실패했습니다.' }
  }

  revalidatePath('/profile')

  return { success: true }
}
