import { SignupForm } from '@/components/auth'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '회원가입 - plynk arc',
  description: 'plynk arc에 가입하세요',
}

export default function SignupPage() {
  return <SignupForm />
}
