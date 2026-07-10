import React from 'react'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'critical' | 'info' | 'default'
  size?: 'sm' | 'md'
  type?: 'status' | 'severity'
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  type = 'status',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-mono font-medium rounded-full'
  
  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs'
  }
  
  const colors = {
    success: 'bg-success-custom/10 text-success-custom border border-success-custom/20',
    warning: 'bg-warning-custom/10 text-warning-custom border border-warning-custom/20',
    critical: 'bg-critical-custom/10 text-critical-custom border border-critical-custom/20',
    info: 'bg-info-custom/10 text-info-custom border border-info-custom/20',
    default: 'bg-slate-800 text-slate-300 border border-slate-700'
  }
  
  return (
    <span className={`${baseStyles} ${sizes[size]} ${colors[variant]} ${className}`} {...props}>
      {type === 'status' && (
        <span className="h-1.5 w-1.5 rounded-full mr-1.5 bg-current shrink-0"></span>
      )}
      {children}
    </span>
  )
}
