import React from 'react'

interface TimelineItemProps {
  title: string
  time: string
  description?: string
  icon?: React.ReactNode
  statusColor?: 'success' | 'warning' | 'critical' | 'info' | 'default'
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  title,
  time,
  description,
  icon,
  statusColor = 'default'
}) => {
  const badgeColors = {
    success: 'bg-success-custom/20 text-success-custom border-success-custom/30',
    warning: 'bg-warning-custom/20 text-warning-custom border-warning-custom/30',
    critical: 'bg-critical-custom/20 text-critical-custom border-critical-custom/30',
    info: 'bg-info-custom/20 text-info-custom border-info-custom/30',
    default: 'bg-slate-800 text-slate-450 border-slate-700'
  }
  
  return (
    <div className="relative pl-8 pb-6 last:pb-0">
      {/* Timeline line */}
      <div className="absolute left-[11px] top-2.5 bottom-0 w-[2px] bg-border-custom last:hidden" />
      
      {/* Timeline indicator node */}
      <div className={`absolute left-0 top-1.5 h-6 w-6 rounded-full border flex items-center justify-center z-10 ${badgeColors[statusColor]}`}>
        {icon ? icon : <div className="h-1.5 w-1.5 rounded-full bg-current" />}
      </div>
      
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-white">{title}</h4>
          <span className="text-xs font-mono text-slate-500">{time}</span>
        </div>
        {description && <p className="text-xs text-slate-400 leading-relaxed">{description}</p>}
      </div>
    </div>
  )
}

interface TimelineProps {
  children: React.ReactNode
  className?: string
}

export const Timeline: React.FC<TimelineProps> = ({ children, className = '' }) => {
  return <div className={`flex flex-col ${className}`}>{children}</div>
}
