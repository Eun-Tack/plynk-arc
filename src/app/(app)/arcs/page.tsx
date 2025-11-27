import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui'
import { ArcCard } from '@/components/arcs/ArcCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Arcs - plynk arc',
  description: '나의 Arc 목록',
}

export default async function ArcsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: arcs } = await supabase
    .from('arcs')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('arc_limit')
    .eq('id', user.id)
    .single()

  const arcLimit = (profile as { arc_limit: number } | null)?.arc_limit || 2
  const canCreateMore = (arcs?.length || 0) < arcLimit

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Arcs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {arcs?.length || 0} / {arcLimit} Arcs 사용 중
          </p>
        </div>
        {canCreateMore ? (
          <Link href="/arcs/new">
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              새 Arc 만들기
            </Button>
          </Link>
        ) : (
          <Button disabled leftIcon={<Plus className="w-4 h-4" />}>
            Arc 한도 도달
          </Button>
        )}
      </div>

      {arcs && arcs.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {arcs.map((arc) => (
            <ArcCard key={arc.id} arc={arc} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <FolderOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            아직 Arc가 없어요
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            첫 번째 Arc를 만들어 지식을 정리해보세요
          </p>
          <Link href="/arcs/new">
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              첫 Arc 만들기
            </Button>
          </Link>
        </div>
      )}

      {!canCreateMore && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            무료 플랜에서는 {arcLimit}개의 Arc만 생성할 수 있습니다.
            더 많은 Arc가 필요하시다면 프로 플랜을 고려해보세요.
          </p>
        </div>
      )}
    </div>
  )
}
