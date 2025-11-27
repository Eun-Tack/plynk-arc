'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button, Input } from '@/components/ui'
import { signUp } from '@/app/actions/auth'
import { GoogleLoginButton } from './GoogleLoginButton'
import { Mail, Lock, User } from 'lucide-react'

export function SignupForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      setIsLoading(false)
      return
    }

    const result = await signUp(formData)

    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.message || '회원가입이 완료되었습니다.')
    }

    setIsLoading(false)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          plynk arc 시작하기
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          지식을 Arc에 담고, 인사이트를 그려보세요
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
              또는 이메일로 가입
            </span>
          </div>
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
            name="fullName"
            type="text"
            label="이름"
            placeholder="홍길동"
            leftIcon={<User className="w-4 h-4" />}
            required
            autoComplete="name"
          />

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
            placeholder="6자 이상 입력해주세요"
            leftIcon={<Lock className="w-4 h-4" />}
            required
            autoComplete="new-password"
          />

          <Input
            name="confirmPassword"
            type="password"
            label="비밀번호 확인"
            placeholder="비밀번호를 다시 입력해주세요"
            leftIcon={<Lock className="w-4 h-4" />}
            required
            autoComplete="new-password"
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            회원가입
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          이미 계정이 있으신가요?{' '}
          <Link
            href="/login"
            className="text-primary-500 hover:text-primary-600 dark:text-primary-400 font-medium"
          >
            로그인
          </Link>
        </p>

        <p className="text-center text-xs text-gray-500 dark:text-gray-500">
          회원가입 시{' '}
          <Link href="/terms" className="underline hover:text-gray-600">
            이용약관
          </Link>
          {' '}및{' '}
          <Link href="/privacy" className="underline hover:text-gray-600">
            개인정보처리방침
          </Link>
          에 동의하게 됩니다.
        </p>
      </div>
    </div>
  )
}
