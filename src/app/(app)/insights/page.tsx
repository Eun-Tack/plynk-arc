import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  Sparkles,
  Calendar,
  FolderOpen,
  ArrowRight,
  BookOpen,
  Lightbulb,
  Target,
} from 'lucide-react'

export default async function InsightsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch all syntheses for the user with arc info
  const { data: syntheses } = await supabase
    .from('syntheses')
    .select(`
      *,
      arcs (
        id,
        name,
        icon,
        color
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-primary-500" />
            Insights
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            리소스 합성으로 생성된 인사이트를 한눈에 확인하세요
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {syntheses?.length || 0}
            </p>
            <p className="text-sm text-gray-500">총 인사이트</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {syntheses?.reduce((sum, s) => sum + (s.resource_count || 0), 0) || 0}
            </p>
            <p className="text-sm text-gray-500">분석된 리소스</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {new Set(syntheses?.map(s => s.arc_id) || []).size}
            </p>
            <p className="text-sm text-gray-500">관련 Arc</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {syntheses?.filter(s => {
                const date = new Date(s.created_at)
                const weekAgo = new Date()
                weekAgo.setDate(weekAgo.getDate() - 7)
                return date > weekAgo
              }).length || 0}
            </p>
            <p className="text-sm text-gray-500">이번 주</p>
          </CardContent>
        </Card>
      </div>

      {/* Insights List */}
      {syntheses && syntheses.length > 0 ? (
        <div className="space-y-4">
          {syntheses.map((synthesis) => {
            const arc = synthesis.arcs as { id: string; name: string; icon: string; color: string } | null
            const hasStoryline = synthesis.storyline && synthesis.storyline.context

            return (
              <Card
                key={synthesis.id}
                className="hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Arc Icon */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: `${arc?.color || '#6366f1'}20` }}
                    >
                      {arc?.icon || '✨'}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {synthesis.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <FolderOpen className="w-3.5 h-3.5" />
                              {arc?.name || 'Unknown Arc'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(synthesis.created_at)}
                            </span>
                            <span>{synthesis.resource_count}개 리소스</span>
                          </div>
                        </div>

                        <Link href={`/arcs/${synthesis.arc_id}`}>
                          <Button variant="ghost" size="sm" className="flex-shrink-0">
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>

                      {/* Preview Content */}
                      {hasStoryline ? (
                        <div className="mt-3 space-y-2">
                          {/* Context Preview */}
                          {synthesis.storyline.context?.content && (
                            <div className="flex items-start gap-2 text-sm">
                              <BookOpen className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                              <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                                {synthesis.storyline.context.content}
                              </p>
                            </div>
                          )}

                          {/* Discovery Count */}
                          {synthesis.storyline.discoveries && synthesis.storyline.discoveries.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Lightbulb className="w-4 h-4 text-yellow-500" />
                              <span>핵심 발견 {synthesis.storyline.discoveries.length}개</span>
                            </div>
                          )}

                          {/* Conclusion Preview */}
                          {synthesis.storyline.conclusion?.content && (
                            <div className="flex items-start gap-2 text-sm">
                              <Target className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <p className="text-gray-600 dark:text-gray-400 line-clamp-1">
                                {synthesis.storyline.conclusion.content}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : synthesis.summary ? (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {synthesis.summary}
                        </p>
                      ) : null}

                      {/* Action Items Preview */}
                      {synthesis.action_items && synthesis.action_items.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {synthesis.action_items.slice(0, 2).map((item: string, i: number) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded"
                            >
                              <span className="w-1 h-1 bg-primary-500 rounded-full" />
                              {item.length > 40 ? item.slice(0, 40) + '...' : item}
                            </span>
                          ))}
                          {synthesis.action_items.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{synthesis.action_items.length - 2}개 더
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border-dashed border-2 border-gray-300 dark:border-gray-700">
          <CardContent className="p-12 text-center">
            <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              아직 인사이트가 없습니다
            </h3>
            <p className="text-gray-500 mb-4">
              Arc에서 리소스를 합성하면 인사이트가 여기에 표시됩니다
            </p>
            <Link href="/arcs">
              <Button>
                <FolderOpen className="w-4 h-4 mr-2" />
                Arcs 보러가기
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
