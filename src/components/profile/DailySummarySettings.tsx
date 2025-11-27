'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Loader2, Check, Clock, Mail, Hash } from 'lucide-react'
import { updateDailySummarySettings } from '@/app/actions/profile'

interface DailySummarySettingsProps {
  initialSettings: {
    enabled: boolean
    time: string
    minCount: number
    email: string
  }
}

export function DailySummarySettings({ initialSettings }: DailySummarySettingsProps) {
  const [enabled, setEnabled] = useState(initialSettings.enabled)
  const [time, setTime] = useState(initialSettings.time)
  const [minCount, setMinCount] = useState(initialSettings.minCount)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    setIsSaving(true)
    setError(null)
    setSaved(false)

    try {
      const result = await updateDailySummarySettings({
        enabled,
        time,
        minCount,
      })

      if (result.error) {
        setError(result.error)
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (e) {
      setError('저장 중 오류가 발생했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges =
    enabled !== initialSettings.enabled ||
    time !== initialSettings.time ||
    minCount !== initialSettings.minCount

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Daily 요약 설정
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* 활성화 토글 */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Daily 요약 수신</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              매일 지정된 시간에 인사이트 요약을 받습니다
            </p>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              enabled
                ? 'bg-primary-500'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                enabled ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* 발송 시간 */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4" />
              발송 시간
              <span className="text-xs text-amber-600 dark:text-amber-400 font-normal">
                (현재 비활성 - 매일 오전 9시 고정)
              </span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              요약은 매일 오전 9시(KST)에 발송됩니다
            </p>
          </div>
          <select
            value="09:00"
            disabled={true}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="09:00">오전 9:00</option>
          </select>
        </div>

        {/* 최소 자료 개수 */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Hash className="w-4 h-4" />
              최소 자료 개수
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              이 개수 이상의 새 리소스가 있을 때만 요약을 보냅니다
            </p>
          </div>
          <select
            value={minCount}
            onChange={(e) => setMinCount(Number(e.target.value))}
            disabled={!enabled}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value={1}>1개 이상</option>
            <option value={2}>2개 이상</option>
            <option value={3}>3개 이상</option>
            <option value={5}>5개 이상</option>
            <option value={10}>10개 이상</option>
          </select>
        </div>

        {/* 수신 이메일 */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            요약은 <span className="font-medium text-gray-900 dark:text-white">{initialSettings.email}</span>으로 발송됩니다
          </p>
        </div>

        {/* 저장 버튼 */}
        <div className="flex items-center justify-between pt-2">
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          {saved && (
            <p className="text-sm text-green-500 flex items-center gap-1">
              <Check className="w-4 h-4" />
              저장되었습니다
            </p>
          )}
          {!error && !saved && <div />}

          <Button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                저장 중...
              </>
            ) : (
              '저장'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
