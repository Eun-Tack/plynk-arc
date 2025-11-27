'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Loader2, Check, X, ChevronDown } from 'lucide-react'

interface Arc {
  id: string
  name: string
  icon: string
  color: string
}

function SharePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [arcs, setArcs] = useState<Arc[]>([])
  const [selectedArcId, setSelectedArcId] = useState<string>('')
  const [customTitle, setCustomTitle] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showArcDropdown, setShowArcDropdown] = useState(false)

  // Get shared URL from query params
  const sharedUrl = searchParams.get('url') || searchParams.get('text') || ''
  const sharedTitle = searchParams.get('title') || ''

  useEffect(() => {
    async function loadArcs() {
      try {
        const response = await fetch('/api/resources')
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login?redirect=/share')
            return
          }
          throw new Error('Failed to load arcs')
        }
        const data = await response.json()
        setArcs(data.arcs || [])
        if (data.arcs?.length > 0) {
          setSelectedArcId(data.arcs[0].id)
        }
      } catch (err) {
        setError('Arc 목록을 불러오지 못했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    loadArcs()
  }, [router])

  useEffect(() => {
    if (sharedTitle) {
      setCustomTitle(sharedTitle)
    }
  }, [sharedTitle])

  async function handleSave() {
    if (!selectedArcId || !sharedUrl) return

    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          arcId: selectedArcId,
          url: sharedUrl,
          customTitle: customTitle.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '저장에 실패했습니다.')
      }

      setSuccess(true)
      setTimeout(() => {
        window.close()
        // If window.close() doesn't work (not opened by script), redirect
        router.push(`/arcs/${selectedArcId}`)
      }, 1500)
    } catch (err: any) {
      setError(err.message || '저장에 실패했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  function handleClose() {
    window.close()
    router.push('/dashboard')
  }

  const selectedArc = arcs.find(a => a.id === selectedArcId)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              저장 완료!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              리소스가 Arc에 저장되었습니다.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Plynk Arc에 저장
            </h1>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* URL Preview */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              URL
            </label>
            <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400 truncate">
              {sharedUrl || '공유된 URL이 없습니다'}
            </div>
          </div>

          {/* Arc Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Arc 선택
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowArcDropdown(!showArcDropdown)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-left flex items-center justify-between"
              >
                {selectedArc ? (
                  <div className="flex items-center gap-2">
                    <span>{selectedArc.icon}</span>
                    <span className="text-gray-900 dark:text-white">{selectedArc.name}</span>
                  </div>
                ) : (
                  <span className="text-gray-500">Arc를 선택하세요</span>
                )}
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showArcDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {arcs.map((arc) => (
                    <button
                      key={arc.id}
                      type="button"
                      onClick={() => {
                        setSelectedArcId(arc.id)
                        setShowArcDropdown(false)
                      }}
                      className={`w-full px-4 py-3 text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        selectedArcId === arc.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                      }`}
                    >
                      <span>{arc.icon}</span>
                      <span className="text-gray-900 dark:text-white">{arc.name}</span>
                    </button>
                  ))}
                  {arcs.length === 0 && (
                    <div className="px-4 py-3 text-gray-500 text-sm">
                      Arc가 없습니다. 먼저 Arc를 생성하세요.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Custom Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              제목 (선택사항)
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="비워두면 자동 추출됩니다"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleClose}
            >
              취소
            </Button>
            <Button
              className="flex-1"
              onClick={handleSave}
              disabled={isSaving || !selectedArcId || !sharedUrl}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  저장 중...
                </>
              ) : (
                '저장하기'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SharePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      }
    >
      <SharePageContent />
    </Suspense>
  )
}
