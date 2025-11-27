'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button, Input } from '@/components/ui'
import { signIn } from '@/app/actions/auth'
import { GoogleLoginButton } from './GoogleLoginButton'
import { Mail, Lock } from 'lucide-react'

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    const result = await signIn(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          다시 오셨군요!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          계정에 로그인해 주세요
        </p>
      </div>

      <div className="space-y-6">
        <GoogleLoginButton />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
              또는 이메일로 로그인
            </span>
          </div>
        </div>

        <form action={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
              {error}
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

          <Input
            name="password"
            type="password"
            label="비밀번호"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            required
            autoComplete="current-password"
          />

          <div className="flex justify-end">
            <Link
              href="/reset-password"
              className="text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400"
            >
              비밀번호를 잊으셨나요?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            로그인
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          계정이 없으신가요?{' '}
          <Link
            href="/signup"
            className="text-primary-500 hover:text-primary-600 dark:text-primary-400 font-medium"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}
