import React from 'react'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rect' | 'circle'
}

export const Skeleton: React.FC<SkeletonProps> = ({ variant = 'rect', className = '', ...props }) => {
  const shapes = {
    text: 'h-4 w-full rounded-md',
    rect: 'h-24 w-full rounded-card',
    circle: 'h-10 w-10 rounded-full'
  }
  
  return (
    <div
      className={`animate-pulse bg-slate-800/40 border border-border-custom/30 ${shapes[variant]} ${className}`}
      {...props}
    />
  )
}
