'use client'

import { LayoutGrid, Table } from 'lucide-react'

interface ResourceViewToggleProps {
  view: 'card' | 'table'
  onViewChange: (view: 'card' | 'table') => void
}

export function ResourceViewToggle({ view, onViewChange }: ResourceViewToggleProps) {
  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => onViewChange('card')}
        className={`p-1.5 rounded transition-colors ${
          view === 'card'
            ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
        title="카드 뷰"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
      <button
        onClick={() => onViewChange('table')}
        className={`p-1.5 rounded transition-colors ${
          view === 'table'
            ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
        }`}
        title="테이블 뷰"
      >
        <Table className="w-4 h-4" />
      </button>
    </div>
  )
}
