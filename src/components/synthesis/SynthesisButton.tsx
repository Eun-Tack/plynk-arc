'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { Sparkles, Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { createSynthesis } from '@/app/actions/synthesis'
import { useRouter } from 'next/navigation'
import { calculateInsightScore, canSynthesize, type InsightScoreResult } from '@/lib/insight-score'

interface Resource {
  id: string
  title: string
  summary: string | null
  category: string | null
  tags: Array<{ name: string }>
}

interface SynthesisButtonProps {
  arcId: string
  resources: Resource[]
}

export function SynthesisButton({ arcId, resources }: SynthesisButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 인사이트 점수 계산
  const scoreResult = useMemo<InsightScoreResult>(() => {
    if (!resources || resources.length === 0) {
      return {
        score: 0,
        level: 'low' as const,
        reasons: ['리소스가 없습니다.'],
        commonTags: [],
        topKeywords: [],
      }
    }
    return calculateInsightScore({
      resources: resources.map(r => ({
        id: r.id,
        title: r.title,
        summary: r.summary,
        category: r.category,
        tags: (r.tags || []).map(t => t.name),
      }))
    })
  }, [resources])

  const canDoSynthesis = canSynthesize(scoreResult)

  async function handleSynthesize() {
    if (!canDoSynthesis) {
      setError('인사이트 가능성이 낮습니다. 관련 리소스를 더 추가해보세요.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await createSynthesis(arcId)
      if (result.error) {
        setError(result.error)
      } else {
        router.refresh()
      }
    } catch (e) {
      setError('합성 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 레벨별 아이콘 및 색상
  const getLevelInfo = () => {
    switch (scoreResult.level) {
      case 'high':
        return {
          icon: TrendingUp,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-100 dark:bg-green-900/30',
          label: '높음',
        }
      case 'medium':
        return {
          icon: Minus,
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
          label: '보통',
        }
      default:
        return {
          icon: TrendingDown,
          color: 'text-gray-500 dark:text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-800',
          label: '낮음',
        }
    }
  }

  const levelInfo = getLevelInfo()
  const LevelIcon = levelInfo.icon

  return (
    <div className="space-y-2">
      {/* 인사이트 점수 표시 */}
      {resources && resources.length >= 2 && (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${levelInfo.bgColor}`}>
          <LevelIcon className={`w-4 h-4 ${levelInfo.color}`} />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${levelInfo.color}`}>
                인사이트 가능성: {levelInfo.label}
              </span>
              <span className={`text-xs ${levelInfo.color}`}>
                {scoreResult.score}점
              </span>
            </div>
            {scoreResult.reasons.length > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {scoreResult.reasons.join(' · ')}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 공통 태그 표시 */}
      {scoreResult.commonTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {scoreResult.commonTags.map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 합성 버튼 */}
      <Button
        onClick={handleSynthesize}
        disabled={isLoading || !canDoSynthesis}
        variant="outline"
        size="sm"
        className={canDoSynthesis
          ? "border-primary-300 text-primary-600 hover:bg-primary-50 dark:border-primary-700 dark:text-primary-400 dark:hover:bg-primary-900/30"
          : "border-gray-300 text-gray-400 dark:border-gray-700 dark:text-gray-500 cursor-not-allowed"
        }
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            분석 중...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-1" />
            {canDoSynthesis ? '인사이트 생성' : '합성 불가'}
          </>
        )}
      </Button>

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {!canDoSynthesis && resources && resources.length >= 2 && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          💡 관련 태그나 유사 주제의 리소스를 추가하면 인사이트 가능성이 높아집니다.
        </p>
      )}
    </div>
  )
}
