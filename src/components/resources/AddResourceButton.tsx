'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Plus, Link as LinkIcon, X, Loader2, ArrowLeft, CheckCircle2, Edit2, Tag, FileText, Video, Wrench, BookOpen, Newspaper } from 'lucide-react'
import { saveResourceWithTags, PreviewResult } from '@/app/actions/resources'
import { useRouter } from 'next/navigation'

interface AddResourceButtonProps {
  arcId: string
}

interface PreviewData extends PreviewResult {
  extractionSuccess: boolean
}

type Step = 'input' | 'preview' | 'saving'

const CONTENT_TYPE_ICONS: Record<string, React.ReactNode> = {
  article: <FileText className="w-4 h-4" />,
  video: <Video className="w-4 h-4" />,
  tool: <Wrench className="w-4 h-4" />,
  documentation: <BookOpen className="w-4 h-4" />,
  tutorial: <BookOpen className="w-4 h-4" />,
  news: <Newspaper className="w-4 h-4" />,
}

const CONTENT_TYPE_LABELS: Record<string, string> = {
  article: '아티클',
  video: '비디오',
  tool: '도구',
  documentation: '문서',
  tutorial: '튜토리얼',
  news: '뉴스',
}

export function AddResourceButton({ arcId }: AddResourceButtonProps) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [url, setUrl] = useState('')
  const [customTitle, setCustomTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 2-step save state
  const [step, setStep] = useState<Step>('input')
  const [preview, setPreview] = useState<PreviewData | null>(null)
  const [editingTitle, setEditingTitle] = useState(false)

  // 태그 관련 state
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [existingTags, setExistingTags] = useState<string[]>([])
  const [newTagInput, setNewTagInput] = useState('')

  function resetForm() {
    setUrl('')
    setCustomTitle('')
    setError(null)
    setStep('input')
    setPreview(null)
    setEditingTitle(false)
    setSelectedTags([])
    setExistingTags([])
    setNewTagInput('')
  }

  // Step 1: Fetch preview with AI analysis
  async function handleFetchPreview(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'URL 미리보기를 가져오지 못했습니다.')
        return
      }

      setPreview(data.preview)
      setCustomTitle(data.preview.title || '')
      setSelectedTags(data.preview.suggestedTags || [])
      setExistingTags(data.existingTags || [])
      setStep('preview')
    } catch (e) {
      setError('URL 미리보기에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 태그 토글
  function toggleTag(tag: string) {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  // 새 태그 추가 (콤마/세미콜론으로 다중 입력 지원)
  function addNewTag() {
    const input = newTagInput.trim()
    if (!input) return

    // 콤마 또는 세미콜론으로 분리
    const tags = input
      .split(/[,;]/)
      .map(t => t.trim())
      .filter(t => t.length > 0 && !selectedTags.includes(t))

    if (tags.length > 0) {
      setSelectedTags(prev => [...prev, ...tags])
      setNewTagInput('')
    }
  }

  // Step 2: Save resource with tags
  async function handleSave() {
    if (!preview) return

    setStep('saving')
    setError(null)

    try {
      const result = await saveResourceWithTags(
        arcId,
        {
          url: preview.url,
          title: preview.title,
          summary: preview.summary,
          contentType: preview.contentType,
          suggestedTags: preview.suggestedTags,
          favicon: preview.favicon || '',
          content: preview.content || undefined,
        },
        customTitle.trim() || undefined,
        selectedTags
      )

      if (result.error) {
        setError(result.error)
        setStep('preview')
      } else {
        setShowModal(false)
        resetForm()
        router.refresh()
      }
    } catch (e) {
      setError('URL 저장에 실패했습니다.')
      setStep('preview')
    }
  }

  function handleClose() {
    setShowModal(false)
    resetForm()
  }

  function handleBack() {
    setStep('input')
    setError(null)
  }

  // 모든 사용 가능한 태그 (기존 + AI 추천)
  const allAvailableTags = Array.from(new Set([...existingTags, ...(preview?.suggestedTags || [])]))
    .filter(tag => !selectedTags.includes(tag))

  return (
    <>
      <Button onClick={() => setShowModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
        리소스 추가
      </Button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center gap-2">
                {step === 'preview' && (
                  <button
                    onClick={handleBack}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mr-1"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                  </button>
                )}
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {step === 'input' && '리소스 추가'}
                  {step === 'preview' && '미리보기'}
                  {step === 'saving' && '저장 중...'}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Step 1: Input */}
            {step === 'input' && (
              <div className="p-4">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleFetchPreview}>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/article"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    disabled={isLoading}
                    autoFocus
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    AI가 자동으로 요약하고 태그를 추천합니다.
                  </p>
                  <Button
                    type="submit"
                    className="w-full mt-4"
                    disabled={isLoading || !url.trim()}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        분석 중...
                      </>
                    ) : (
                      '미리보기'
                    )}
                  </Button>
                </form>
              </div>
            )}

            {/* Step 2: Preview */}
            {step === 'preview' && preview && (
              <div className="p-4 overflow-y-auto flex-1">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Content Type Badge */}
                <div className="mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium">
                    {CONTENT_TYPE_ICONS[preview.contentType]}
                    {CONTENT_TYPE_LABELS[preview.contentType] || preview.contentType}
                  </span>
                  {preview.extractionSuccess && (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      콘텐츠 추출 완료
                    </span>
                  )}
                </div>

                {/* URL Preview */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    {preview.favicon && (
                      <img
                        src={preview.favicon}
                        alt=""
                        className="w-4 h-4 flex-shrink-0"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {preview.url}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
                      제목
                    </label>
                    <button
                      onClick={() => setEditingTitle(!editingTitle)}
                      className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      {editingTitle ? '완료' : '수정'}
                    </button>
                  </div>
                  {editingTitle ? (
                    <input
                      type="text"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                      placeholder="제목을 입력하세요"
                      autoFocus
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {customTitle || '(제목 없음)'}
                      </p>
                    </div>
                  )}
                </div>

                {/* AI Summary */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    AI 요약
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {preview.summary}
                    </p>
                  </div>
                </div>

                {/* Tags Section */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    태그
                  </label>

                  {/* Selected Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {selectedTags.length === 0 ? (
                      <span className="text-xs text-gray-400">선택된 태그 없음</span>
                    ) : (
                      selectedTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors"
                        >
                          {tag}
                          <X className="w-3 h-3" />
                        </button>
                      ))
                    )}
                  </div>

                  {/* Available Tags */}
                  {allAvailableTags.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-400 mb-1.5">추천 태그:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {allAvailableTags.slice(0, 10).map((tag) => (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Tag Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addNewTag()
                        }
                      }}
                      placeholder="태그 입력 (콤마로 구분)"
                      className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-xs"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addNewTag}
                      disabled={!newTagInput.trim()}
                      className="text-xs px-3"
                    >
                      추가
                    </Button>
                  </div>
                </div>

                {/* Save Button */}
                <Button
                  onClick={handleSave}
                  className="w-full mt-2"
                  disabled={!customTitle.trim()}
                >
                  저장하기
                </Button>
              </div>
            )}

            {/* Step 3: Saving */}
            {step === 'saving' && (
              <div className="p-8 text-center">
                <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  리소스를 저장하고 있습니다...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
