import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Zap, Brain, Table, Chrome } from 'lucide-react'
import { Button } from '@/components/ui'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg p-1 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                <Image
                  src="/logo.png"
                  alt="plynk arc"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                plynk arc
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                로그인
              </Link>
              <Link href="/signup">
                <Button size="sm">무료로 시작하기</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
              Draw Your{' '}
              <span className="bg-gradient-to-r from-primary-500 to-violet-500 bg-clip-text text-transparent">
                Arcs
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              지식을 Arc에 담고, 인사이트를 그리세요.
              <br />
              AI가 자동으로 정리하고, 패턴을 발견해 드립니다.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  무료로 시작하기
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="secondary" size="lg">
                  기능 살펴보기
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              신용카드 필요 없음 • 무료 플랜 영구 제공
            </p>
          </div>
        </div>

        {/* Background Gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-900/10 dark:to-transparent" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              왜 plynk arc인가요?
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              지식 관리의 새로운 패러다임을 경험하세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                3초 저장
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Chrome Extension으로 원클릭 저장. 태그도 카테고리도 AI가 자동으로.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                AI 자동 정리
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                수동 태깅 불필요. AI가 내용을 분석하고 자동으로 분류합니다.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card">
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center mb-4">
                <Table className="w-6 h-6 text-violet-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                스마트 Synthesis
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                자료가 쌓이면 AI가 패턴을 발견하고, 비교 테이블을 자동 생성합니다.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-card">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
                <Chrome className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                어디서나 사용
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                웹, Chrome Extension, PWA 모바일 앱. 어디서든 지식을 관리하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            지금 바로 시작하세요
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            무료로 2개의 Arc를 만들 수 있습니다.
            <br />
            신용카드 없이 지금 바로 시작하세요.
          </p>
          <div className="mt-10">
            <Link href="/signup">
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                무료로 시작하기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Company Info - Korean */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg p-0.5 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                  <Image
                    src="/logo.png"
                    alt="plynk arc"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  (주)플링크데이터
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>이메일: master@plynkin.com</p>
                <p>주소: 서울특별시 동작구 상도로55길 6, 테크스테이션 308호</p>
              </div>
            </div>

            {/* Company Info - English */}
            <div className="space-y-4">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Plynk Data Co., Ltd.
              </span>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>Email: master@plynkin.com</p>
                <p>Address: Room 308, Tech Station, 6, Sangdoro 55-gil, Dongjak-gu, Seoul, Republic of Korea</p>
              </div>
            </div>
          </div>

          {/* Links & Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/terms" className="hover:text-gray-900 dark:hover:text-white">
                이용약관
              </Link>
              <Link href="/privacy" className="hover:text-gray-900 dark:hover:text-white">
                개인정보처리방침
              </Link>
              <Link href="/help" className="hover:text-gray-900 dark:hover:text-white">
                도움말
              </Link>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; 2025 Plynk. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
