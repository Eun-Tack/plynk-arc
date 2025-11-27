'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { createArc, updateArc } from '@/app/actions/arcs'
import { Loader2 } from 'lucide-react'

const COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#6B7280', // Gray
]

const ICONS = ['⌒', '📚', '💡', '🎯', '🔬', '💻', '🎨', '📝', '🚀', '⭐']

interface ArcFormProps {
  arc?: {
    id: string
    name: string
    goal: string | null
    icon: string
    color: string
    is_public: boolean
    auto_synthesis_enabled: boolean
    auto_synthesis_threshold: number
  }
  mode: 'create' | 'edit'
}

export function ArcForm({ arc, mode }: ArcFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState(arc?.color || COLORS[0])
  const [selectedIcon, setSelectedIcon] = useState(arc?.icon || ICONS[0])

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    formData.set('color', selectedColor)
    formData.set('icon', selectedIcon)

    try {
      const result = mode === 'create'
        ? await createArc(formData)
        : await updateArc(arc!.id, formData)

      if (result.error) {
        setError(result.error)
        return
      }

      if (result.success) {
        router.push(mode === 'create' ? `/arcs/${result.arc.id}` : `/arcs/${arc!.id}`)
        router.refresh()
      }
    } catch (e) {
      setError('오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? '새 Arc 만들기' : 'Arc 수정'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              아이콘
            </label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                    selectedIcon === icon
                      ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/30'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              색상
            </label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: color }}
                  className={`w-8 h-8 rounded-full transition-all ${
                    selectedColor === color
                      ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-900'
                      : ''
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Name */}
          <Input
            name="name"
            label="이름"
            placeholder="예: 프론트엔드 개발 학습"
            defaultValue={arc?.name || ''}
            required
          />

          {/* Goal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              목표 (선택)
            </label>
            <textarea
              name="goal"
              rows={3}
              placeholder="이 Arc에서 무엇을 달성하고 싶으신가요?"
              defaultValue={arc?.goal || ''}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Advanced Options (Edit mode only) */}
          {mode === 'edit' && (
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                고급 설정
              </h3>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isPublic"
                  value="true"
                  defaultChecked={arc?.is_public}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  이 Arc를 공개합니다
                </span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="autoSynthesisEnabled"
                  value="true"
                  defaultChecked={arc?.auto_synthesis_enabled ?? true}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  자동 합성 활성화
                </span>
              </label>

              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  자동 합성 임계값 (리소스 개수)
                </label>
                <input
                  type="number"
                  name="autoSynthesisThreshold"
                  min="5"
                  max="50"
                  defaultValue={arc?.auto_synthesis_threshold || 10}
                  className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  저장 중...
                </>
              ) : (
                mode === 'create' ? 'Arc 만들기' : '저장'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
