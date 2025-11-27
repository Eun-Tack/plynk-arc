import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { ThemeToggle } from '@/components/layout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '설정 - plynk arc',
  description: '앱 설정',
}

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          설정
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          앱 설정을 관리하세요
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>테마</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 dark:text-white font-medium">외관 모드</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                라이트, 다크 또는 시스템 설정을 따를 수 있습니다
              </p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>알림</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 dark:text-white font-medium">이메일 알림</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Daily 요약 및 중요 알림 수신
              </p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-500">
              <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 dark:text-white font-medium">Synthesis 알림</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Synthesis 준비 완료 시 알림
              </p>
            </div>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-500">
              <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>데이터</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 dark:text-white font-medium">데이터 내보내기</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                모든 데이터를 JSON 형식으로 내보내기
              </p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
              내보내기
            </button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">위험 구역</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 dark:text-white font-medium">계정 삭제</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                모든 데이터가 영구적으로 삭제됩니다
              </p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
              계정 삭제
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
