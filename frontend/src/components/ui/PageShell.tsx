import React from 'react'
import { Card } from './Card'
import { Button } from './Button'
import { ChevronRight, ShieldAlert } from 'lucide-react'
import { motion } from 'framer-motion'

interface PageShellProps {
  title: string
  description: string
  breadcrumbs: string[]
  emptyState?: {
    title: string
    description: string
    actionText?: string
    onAction?: () => void
  }
  children?: React.ReactNode
}

export const PageShell: React.FC<PageShellProps> = ({
  title,
  description,
  breadcrumbs,
  emptyState,
  children
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Breadcrumb Trail */}
      <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-500">
        <span className="hover:text-accent cursor-pointer transition">Home</span>
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className={idx === breadcrumbs.length - 1 ? "text-accent font-semibold" : "hover:text-slate-350 cursor-pointer transition"}>
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white m-0">{title}</h2>
        <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">{description}</p>
      </div>

      {/* Main Page Content */}
      <div className="space-y-6">
        {children}

        {/* Empty State Block */}
        {emptyState && (
          <Card className="flex flex-col items-center justify-center text-center p-12 border-dashed border-border-custom bg-bg-secondary/20">
            <div className="h-12 w-12 rounded-2xl bg-bg-primary border border-border-custom flex items-center justify-center text-slate-400 mb-4 animate-pulse">
              <ShieldAlert className="h-6 w-6 text-accent/80" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">{emptyState.title}</h3>
            <p className="text-slate-500 text-xs max-w-sm mb-6 leading-relaxed">{emptyState.description}</p>
            {emptyState.actionText && (
              <Button variant="primary" size="sm" onClick={emptyState.onAction} className="font-mono text-xs">
                {emptyState.actionText}
              </Button>
            )}
          </Card>
        )}
      </div>
    </motion.div>
  )
}
