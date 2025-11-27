import { LoginForm } from '@/components/auth'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '로그인 - plynk arc',
  description: 'plynk arc에 로그인하세요',
}

export default function LoginPage() {
  return <LoginForm />
}
