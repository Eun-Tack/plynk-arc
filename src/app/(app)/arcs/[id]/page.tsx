import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import {
  Settings,
  Globe,
  Lock,
  FileText,
  Calendar,
  Sparkles,
} from 'lucide-react'
import { AddResourceButton } from '@/components/resources/AddResourceButton'
import { ResourceList } from '@/components/resources/ResourceList'
import { SynthesisButton } from '@/components/synthesis/SynthesisButton'
import { SynthesisCard } from '@/components/synthesis/SynthesisCard'

interface ArcDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ArcDetailPage({ params }: ArcDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch arc with resources
  const { data: arc, error: arcError } = await supabase
    .from('arcs')
    .select('*')
    .eq('id', id)
    .single()

  if (arcError || !arc) {
    notFound()
  }

  // Check access
  if (arc.user_id !== user.id && !arc.is_public) {
    notFound()
  }

  const isOwner = arc.user_id === user.id

  // Fetch resources with tags
  const { data: resources } = await supabase
    .from('resources')
    .select(`
      *,
      resource_tags (
        tag_id,
        tags (
          id,
          name,
          color
        )
      )
    `)
    .eq('arc_id', id)
    .order('created_at', { ascending: false })

  // Fetch syntheses
  const { data: syntheses } = await supabase
    .from('syntheses')
    .select('*')
    .eq('arc_id', id)
    .order('created_at', { ascending: false })

  const latestSynthesis = syntheses?.[0]

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const resourceCount = resources?.length || 0

  // SynthesisButton에 전달할 리소스 형식으로 변환
  const resourcesForSynthesis = resources?.map(r => ({
    id: r.id,
    title: r.title,
    summary: r.summary,
    category: r.category,
    tags: r.resource_tags?.map((rt: { tags: { name: string } }) => ({ name: rt.tags?.name })).filter((t: { name: string }) => t.name) || [],
  })) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{ backgroundColor: `${arc.color}20` }}
          >
            {arc.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {arc.name}
              </h1>
              {arc.is_public ? (
                <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                  <Globe className="w-3 h-3" />
                  공개
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                  <Lock className="w-3 h-3" />
                  비공개
                </span>
              )}
            </div>
            {arc.goal && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {arc.goal}
              </p>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {resourceCount}개 리소스
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(arc.created_at)}
              </span>
            </div>
          </div>
        </div>

        {isOwner && (
          <div className="flex items-center gap-2">
            <SynthesisButton arcId={arc.id} resources={resourcesForSynthesis} />
            <AddResourceButton arcId={arc.id} />
            <Link href={`/arcs/${arc.id}/edit`}>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-1" />
                설정
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {resourceCount}
            </p>
            <p className="text-sm text-gray-500">리소스</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {resources?.filter(r => r.url).length || 0}
            </p>
            <p className="text-sm text-gray-500">URL</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {resources?.filter(r => r.file_url).length || 0}
            </p>
            <p className="text-sm text-gray-500">파일</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {syntheses?.length || 0}
            </p>
            <p className="text-sm text-gray-500">합성</p>
          </CardContent>
        </Card>
      </div>

      {/* Latest Synthesis */}
      {latestSynthesis && (
        <SynthesisCard
          synthesis={latestSynthesis}
          resources={resources?.map(r => ({ id: r.id, title: r.title })) || []}
          isOwner={isOwner}
        />
      )}

      {/* No Synthesis Prompt */}
      {!latestSynthesis && resourceCount >= 2 && isOwner && (
        <Card className="border-dashed border-2 border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <CardContent className="p-6 text-center">
            <Sparkles className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
              리소스를 합성해보세요
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              AI가 {resourceCount}개의 리소스를 분석하여 인사이트를 도출합니다
            </p>
            <SynthesisButton arcId={arc.id} resources={resourcesForSynthesis} />
          </CardContent>
        </Card>
      )}

      {/* Resources List */}
      <ResourceList
        resources={resources || []}
        arcId={arc.id}
        isOwner={isOwner}
      />
    </div>
  )
}
