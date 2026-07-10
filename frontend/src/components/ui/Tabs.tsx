import React from 'react'

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({ value, onValueChange, children, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activeValue: value, onValueChange } as any)
        }
        return child;
      })}
    </div>
  )
}

interface TabsListProps {
  children: React.ReactNode
  activeValue?: string
  onValueChange?: (value: string) => void
  className?: string
}

export const TabsList: React.FC<TabsListProps> = ({ children, activeValue, onValueChange, className = '' }) => {
  return (
    <div className={`inline-flex items-center p-1 rounded-xl bg-bg-secondary border border-border-custom ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activeValue, onValueChange } as any)
        }
        return child;
      })}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  activeValue?: string
  onValueChange?: (value: string) => void
  className?: string
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  activeValue,
  onValueChange,
  className = ''
}) => {
  const isActive = activeValue === value
  return (
    <button
      onClick={() => onValueChange?.(value)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
        isActive
          ? 'bg-accent text-[#0B1020] font-semibold shadow-md shadow-accent/10'
          : 'text-slate-400 hover:text-slate-200'
      } ${className}`}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  activeValue?: string
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, children, activeValue }) => {
  if (activeValue !== value) return null
  return <div className="mt-4">{children}</div>
}
