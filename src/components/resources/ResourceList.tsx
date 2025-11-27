'use client'

import { useState } from 'react'
import { ResourceCard } from './ResourceCard'
import { ResourceTable } from './ResourceTable'
import { ResourceViewToggle } from './ResourceViewToggle'
import { Card, CardContent } from '@/components/ui/Card'
import { Link as LinkIcon } from 'lucide-react'
import { AddResourceButton } from './AddResourceButton'

interface Tag {
  id: string
  name: string
  color: string | null
}

interface ResourceTag {
  tag_id: string
  tags: Tag
}

interface Resource {
  id: string
  url: string | null
  file_url: string | null
  file_name: string | null
  mime_type: string | null
  title: string
  summary: string | null
  content_type: string | null
  favicon_url: string | null
  created_at: string
  resource_tags?: ResourceTag[]
}

interface ResourceListProps {
  resources: Resource[]
  arcId: string
  isOwner: boolean
}

export function ResourceList({ resources, arcId, isOwner }: ResourceListProps) {
  const [view, setView] = useState<'card' | 'table'>('card')

  if (!resources || resources.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <LinkIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            아직 리소스가 없습니다
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            URL이나 파일을 추가해서 지식을 모아보세요
          </p>
          {isOwner && <AddResourceButton arcId={arcId} />}
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          리소스
          <span className="ml-2 text-sm font-normal text-gray-500">
            {resources.length}개
          </span>
        </h2>
        <ResourceViewToggle view={view} onViewChange={setView} />
      </div>

      {view === 'card' ? (
        <div className="space-y-3">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} isOwner={isOwner} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <ResourceTable resources={resources} isOwner={isOwner} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
