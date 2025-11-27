import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Bell, Check } from 'lucide-react'
import { Button } from '@/components/ui'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '알림 - plynk arc',
  description: '알림 센터',
}

export default async function NotificationsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            알림
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {unreadCount > 0 ? `${unreadCount}개의 읽지 않은 알림` : '모든 알림을 확인했어요'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" leftIcon={<Check className="w-4 h-4" />}>
            모두 읽음
          </Button>
        )}
      </div>

      {notifications && notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border transition-colors ${
                notification.is_read
                  ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  : 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  notification.is_read ? 'bg-gray-300 dark:bg-gray-600' : 'bg-primary-500'
                }`} />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {notification.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    {new Date(notification.created_at).toLocaleDateString('ko-KR', {
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            알림이 없어요
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            새로운 알림이 오면 여기에 표시됩니다
          </p>
        </div>
      )}
    </div>
  )
}
