import React from 'react'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  description = 'Your query returned empty results.',
  icon
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed border-border-custom bg-bg-secondary/40 rounded-card">
      <div className="text-slate-500 mb-3 p-3 rounded-2xl bg-bg-primary border border-border-custom">
        {icon ? icon : <Inbox className="h-6 w-6 text-slate-400" />}
      </div>
      <h4 className="text-sm font-semibold text-slate-200">{title}</h4>
      <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">{description}</p>
    </div>
  )
}
