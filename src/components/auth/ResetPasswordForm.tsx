'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button, Input } from '@/components/ui'
import { resetPassword } from '@/app/actions/auth'
import { Mail, ArrowLeft } from 'lucide-react'

export function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const result = await resetPassword(formData)

    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.message || '이메일을 확인해 주세요.')
    }

    setIsLoading(false)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          비밀번호 재설정
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          가입하신 이메일을 입력해 주세요
        </p>
      </div>

      <form action={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-lg">
            {success}
          </div>
        )}

        <Input
          name="email"
          type="email"
          label="이메일"
          placeholder="you@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          required
          autoComplete="email"
        />

        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
        >
          재설정 링크 보내기
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        >
          <ArrowLeft className="w-4 h-4" />
          로그인으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
