import { ResetPasswordForm } from '@/components/auth'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '비밀번호 재설정 - plynk arc',
  description: '비밀번호를 재설정하세요',
}

export default function ResetPasswordPage() {
  return <ResetPasswordForm />
}
