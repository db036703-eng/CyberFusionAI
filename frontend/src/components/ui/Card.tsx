import React from 'react'
import { motion } from 'framer-motion'
import type { HTMLMotionProps } from 'framer-motion'

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  variant?: 'normal' | 'large'
  hoverEffect?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'normal',
  hoverEffect = false,
  className = '',
  ...props
}) => {
  const radius = variant === 'large' ? 'rounded-card-lg' : 'rounded-card'
  
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={`bg-bg-secondary border border-border-custom p-6 shadow-sm overflow-hidden relative ${radius} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
