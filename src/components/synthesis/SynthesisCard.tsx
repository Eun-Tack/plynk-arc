'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Link as LinkIcon,
  Trash2,
  Share2,
  BookOpen,
  Target,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import { deleteSynthesis } from '@/app/actions/synthesis'
import { useRouter } from 'next/navigation'

interface StorySection {
  title: string
  content: string
  relatedResources?: string[]
}

interface SynthesisConnection {
  from: string
  to: string
  relationship: string
}

// 새 스토리라인 구조
interface StorylineData {
  context?: StorySection
  discoveries?: StorySection[]
  synthesis?: StorySection
  conclusion?: StorySection
}

interface SynthesisCardProps {
  synthesis: {
    id: string
    title: string
    // 새 구조
    storyline?: StorylineData
    actionItems?: string[]
    // 레거시 구조 (하위 호환)
    summary?: string
    insights?: Array<{ title: string; description: string; relatedResources?: string[] }>
    connections?: SynthesisConnection[]
    resource_count: number
    created_at: string
  }
  resources?: Array<{ id: string; title: string }>
  isOwner?: boolean
}

export function SynthesisCard({ synthesis, resources = [], isOwner = false }: SynthesisCardProps) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function getResourceTitle(resourceId: string): string {
    const resource = resources.find(r => r.id === resourceId)
    return resource?.title || resourceId.slice(0, 8) + '...'
  }

  // 스토리라인 형식으로 마크다운 생성
  function formatAsMarkdown(): string {
    const lines: string[] = []
    lines.push(`# ${synthesis.title}`)
    lines.push('')
    lines.push(`> ${formatDate(synthesis.created_at)} · ${synthesis.resource_count}개 리소스 분석`)
    lines.push('')

    if (synthesis.storyline) {
      const { context, discoveries, synthesis: synth, conclusion } = synthesis.storyline

      if (context?.content) {
        lines.push(`## 📖 ${context.title || '배경'}`)
        lines.push(context.content)
        lines.push('')
      }

      if (discoveries && discoveries.length > 0) {
        lines.push('## 💡 핵심 발견')
        discoveries.forEach((d, i) => {
          lines.push(`### ${i + 1}. ${d.title}`)
          lines.push(d.content)
          lines.push('')
        })
      }

      if (synth?.content) {
        lines.push(`## 🔗 ${synth.title || '연결'}`)
        lines.push(synth.content)
        lines.push('')
      }

      if (conclusion?.content) {
        lines.push(`## 🎯 ${conclusion.title || '결론'}`)
        lines.push(conclusion.content)
        lines.push('')
      }

      if (synthesis.actionItems && synthesis.actionItems.length > 0) {
        lines.push('## ✅ 실행 항목')
        synthesis.actionItems.forEach(item => {
          lines.push(`- [ ] ${item}`)
        })
        lines.push('')
      }
    } else {
      // 레거시 형식
      if (synthesis.summary) {
        lines.push(synthesis.summary)
        lines.push('')
      }
    }

    return lines.join('\n')
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(formatAsMarkdown())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error('Copy failed:', e)
    }
  }

  async function handleShare() {
    const markdown = formatAsMarkdown()
    if (navigator.share) {
      try {
        await navigator.share({
          title: synthesis.title,
          text: markdown,
        })
      } catch (e) {
        handleCopy()
      }
    } else {
      handleCopy()
    }
  }

  async function handleDelete() {
    if (!confirm('이 인사이트를 삭제하시겠습니까?')) return

    setIsDeleting(true)
    try {
      const result = await deleteSynthesis(synthesis.id)
      if (result.error) {
        alert(result.error)
      } else {
        router.refresh()
      }
    } catch (e) {
      alert('삭제 중 오류가 발생했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }

  const hasStoryline = synthesis.storyline && synthesis.storyline.context
  const connections = Array.isArray(synthesis.connections) ? synthesis.connections : []
  const actionItems = Array.isArray(synthesis.actionItems) ? synthesis.actionItems : []

  // 레거시 형식일 때 discoveries 개수 계산
  const discoveriesCount = hasStoryline
    ? (synthesis.storyline?.discoveries?.length || 0)
    : (synthesis.insights?.length || 0)

  return (
    <Card className="border-primary-200 dark:border-primary-800 bg-gradient-to-br from-primary-50/50 to-white dark:from-primary-900/20 dark:to-gray-900">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {synthesis.title}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatDate(synthesis.created_at)} · {synthesis.resource_count}개 리소스 분석
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="p-2"
              title="공유하기"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="p-2"
              title="복사하기"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
            {isOwner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                title="삭제"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Context (배경) - 항상 표시 */}
        {hasStoryline && synthesis.storyline?.context?.content && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-2">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">{synthesis.storyline.context.title || '배경'}</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              {synthesis.storyline.context.content}
            </p>
          </div>
        )}

        {/* 레거시: Summary */}
        {!hasStoryline && synthesis.summary && (
          <div className="mb-4">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {synthesis.summary}
            </p>
          </div>
        )}

        {/* Expandable Section */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              접기
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              {hasStoryline ? `스토리라인 전체 보기` : `인사이트 ${discoveriesCount}개 보기`}
            </>
          )}
        </button>

        {expanded && (
          <div className="mt-4 space-y-4">
            {/* 스토리라인 형식 */}
            {hasStoryline && (
              <>
                {/* Discoveries (핵심 발견) */}
                {synthesis.storyline?.discoveries && synthesis.storyline.discoveries.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      핵심 발견
                    </h4>
                    <div className="space-y-3">
                      {synthesis.storyline.discoveries.map((discovery, index) => (
                        <div
                          key={index}
                          className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700"
                        >
                          <h5 className="font-medium text-gray-900 dark:text-white text-sm flex items-center gap-2">
                            <span className="w-5 h-5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs flex items-center justify-center">
                              {index + 1}
                            </span>
                            {discovery.title}
                          </h5>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 pl-7">
                            {discovery.content}
                          </p>
                          {discovery.relatedResources && discovery.relatedResources.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2 pl-7">
                              {discovery.relatedResources.map((rid, i) => (
                                <span
                                  key={i}
                                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded"
                                >
                                  {getResourceTitle(rid)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Synthesis (연결/통합) */}
                {synthesis.storyline?.synthesis?.content && (
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                    <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 mb-2">
                      <LinkIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">{synthesis.storyline.synthesis.title || '연결'}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {synthesis.storyline.synthesis.content}
                    </p>
                  </div>
                )}

                {/* Conclusion (결론) */}
                {synthesis.storyline?.conclusion?.content && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-2">
                      <Target className="w-4 h-4" />
                      <span className="text-sm font-medium">{synthesis.storyline.conclusion.title || '결론'}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {synthesis.storyline.conclusion.content}
                    </p>
                  </div>
                )}

                {/* Action Items */}
                {actionItems.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      실행 항목
                    </h4>
                    <div className="space-y-2">
                      {actionItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2"
                        >
                          <ArrowRight className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* 레거시: Insights */}
            {!hasStoryline && synthesis.insights && synthesis.insights.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  <Lightbulb className="w-4 h-4" />
                  핵심 인사이트
                </h4>
                <div className="space-y-3">
                  {synthesis.insights.map((insight, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700"
                    >
                      <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                        {insight.title}
                      </h5>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        {insight.description}
                      </p>
                      {insight.relatedResources && insight.relatedResources.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {insight.relatedResources.map((rid, i) => (
                            <span
                              key={i}
                              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded"
                            >
                              {getResourceTitle(rid)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Connections */}
            {connections.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  <LinkIcon className="w-4 h-4" />
                  리소스 연결
                </h4>
                <div className="space-y-2">
                  {connections.map((conn, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 flex-wrap"
                    >
                      <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs">
                        {getResourceTitle(conn.from)}
                      </span>
                      <span className="text-gray-400">↔</span>
                      <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs">
                        {getResourceTitle(conn.to)}
                      </span>
                      <span className="text-gray-500 text-xs">
                        ({conn.relationship})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
