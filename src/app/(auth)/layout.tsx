import Image from 'next/image'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header with Logo */}
      <header className="py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg p-1 flex items-center justify-center">
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
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; 2025 plynk arc. All rights reserved.</p>
      </footer>
    </div>
  )
}
