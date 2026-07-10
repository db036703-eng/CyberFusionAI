import React from 'react'
import { Search } from 'lucide-react'

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearchChange?: (val: string) => void
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearchChange, className = '', ...props }) => {
  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
        <Search className="h-4 w-4" />
      </div>
      <input
        type="text"
        className="w-full pl-10 pr-4 py-2.5 text-sm bg-bg-primary border border-border-custom hover:border-slate-700 focus:border-accent focus:ring-1 focus:ring-accent/40 rounded-xl transition duration-200 outline-none text-slate-200 placeholder-slate-500"
        onChange={(e) => onSearchChange?.(e.target.value)}
        {...props}
      />
    </div>
  )
}
