import React from 'react'
import { Card } from './Card'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  change?: {
    value: number
    type: 'increase' | 'decrease'
    label?: string
  }
  className?: string
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  change,
  className = ''
}) => {
  return (
    <Card hoverEffect className={`flex flex-col justify-between min-h-[140px] ${className}`}>
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-slate-400 leading-none">{title}</span>
        {icon && <div className="text-slate-400 p-1.5 rounded-lg bg-bg-primary border border-border-custom">{icon}</div>}
      </div>
      
      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-3xl font-bold tracking-tight text-white">{value}</span>
        
        {change && (
          <div className={`flex items-center space-x-1 text-xs font-mono px-2 py-0.5 rounded-full ${
            change.type === 'increase' ? 'bg-success-custom/10 text-success-custom' : 'bg-critical-custom/10 text-critical-custom'
          }`}>
            {change.type === 'increase' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{change.value}%</span>
          </div>
        )}
      </div>
    </Card>
  )
}
