import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { DailySummarySettings } from '@/components/profile/DailySummarySettings'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '프로필 - plynk arc',
  description: '내 프로필',
}

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          프로필
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          계정 정보를 관리하세요
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profile?.full_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {profile?.full_name || '이름 없음'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">이메일</span>
              <span className="text-gray-900 dark:text-white">{profile?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">구독 플랜</span>
              <span className="text-gray-900 dark:text-white capitalize">
                {profile?.subscription_tier === 'free' ? '무료' : '프로'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Arc 한도</span>
              <span className="text-gray-900 dark:text-white">
                {profile?.arc_limit}개
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">가입일</span>
              <span className="text-gray-900 dark:text-white">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('ko-KR') : '-'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <DailySummarySettings
        initialSettings={{
          enabled: profile?.daily_summary_enabled ?? false,
          time: profile?.daily_summary_time ?? '09:00',
          minCount: profile?.daily_summary_min_count ?? 3,
          email: user.email || '',
        }}
      />
    </div>
  )
}
