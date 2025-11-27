import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, FolderOpen, Clock, TrendingUp, Sparkles } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '대시보드 - plynk arc',
  description: '나의 지식 관리 현황',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get arcs count
  const { count: arcsCount } = await supabase
    .from('arcs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // Get recent arcs
  const { data: recentArcs } = await supabase
    .from('arcs')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(5)

  // Get total resources count
  const { count: resourcesCount } = await supabase
    .from('resources')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // Get recent resources
  const { data: recentResources } = await supabase
    .from('resources')
    .select('*, arcs(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return '좋은 아침이에요'
    if (hour < 18) return '좋은 오후예요'
    return '좋은 저녁이에요'
  }

  return (
    <div className="space-y-8 overflow-x-hidden">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {greeting()}, {(profile as any)?.full_name || '사용자'}님!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            오늘도 지식을 Arc에 담아보세요
          </p>
        </div>
        <Link href="/arcs/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            새 Arc 만들기
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {arcsCount || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Arcs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {resourcesCount || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">자료</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-violet-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  0
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">인사이트</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(profile as any)?.arc_limit || 2}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Arc 한도</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Arcs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>최근 Arcs</CardTitle>
              <Link
                href="/arcs"
                className="text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400"
              >
                모두 보기
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentArcs && recentArcs.length > 0 ? (
              <div className="space-y-3">
                {recentArcs.map((arc) => (
                  <Link
                    key={arc.id}
                    href={`/arcs/${arc.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: arc.color + '20' }}
                    >
                      {arc.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {arc.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {arc.resource_count || 0}개 자료
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FolderOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  아직 Arc가 없어요
                </p>
                <Link href="/arcs/new">
                  <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                    첫 Arc 만들기
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Resources */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>최근 자료</CardTitle>
              <Link
                href="/search"
                className="text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400"
              >
                모두 보기
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentResources && recentResources.length > 0 ? (
              <div className="space-y-3">
                {recentResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-w-0"
                  >
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {resource.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                      {resource.summary || '요약 없음'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {resource.category && (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                          {resource.category}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {(resource as any).arcs?.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  저장된 자료가 없어요
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-primary-500 to-violet-500 text-white border-none">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Chrome Extension 설치하기</h3>
              <p className="text-white/80 mt-1">
                브라우저에서 원클릭으로 자료를 저장하세요
              </p>
            </div>
            <Button
              variant="secondary"
              className="bg-white/50 text-white cursor-not-allowed border-none"
              disabled
            >
              준비 중
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
