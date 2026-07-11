import React from 'react'
import { Bell } from 'lucide-react'
import { SearchBar } from '../ui/SearchBar'
import { Badge } from '../ui/Badge'
import { useUIStore } from '../../store/uiStore'
import { CommandPalette } from '../ui/CommandPalette'

interface NavbarProps {
  apiStatus: 'healthy' | 'unhealthy' | 'loading'
}

export const Navbar: React.FC<NavbarProps> = ({ apiStatus }) => {
  const { toggleNotificationPanel, setSearchQuery, incidents } = useUIStore()
  
  const activeAlerts = incidents.filter(inc => inc.status === 'active').length
  
  const statusConfig = {
    healthy: { variant: 'success', text: 'API Connected' },
    unhealthy: { variant: 'critical', text: 'API Disconnected' },
    loading: { variant: 'warning', text: 'Connecting...' }
  } as const
  
  return (
    <header className="sticky top-0 z-10 w-full glass-panel border-b border-border-custom px-8 py-4 flex items-center justify-between">
      {/* Search Input & Command Palette */}
      <div className="flex items-center space-x-3 flex-1 max-w-xl pr-4">
        <SearchBar placeholder="Search active incidents, sources, anomalies..." onSearchChange={setSearchQuery} />
        <CommandPalette />
      </div>
      
      {/* Controls */}
      <div className="flex items-center space-x-6">
        {/* API Health Connection Badge */}
        <Badge variant={statusConfig[apiStatus].variant} type="status">
          {statusConfig[apiStatus].text}
        </Badge>
        
        {/* Notification Bell */}
        <button
          onClick={toggleNotificationPanel}
          className="relative p-2 rounded-xl border border-border-custom hover:border-slate-650 bg-bg-secondary hover:bg-bg-primary/40 transition cursor-pointer text-slate-300 hover:text-white"
        >
          <Bell className="h-4.5 w-4.5" />
          {activeAlerts > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-critical-custom text-white font-mono text-[10px] font-bold rounded-full flex items-center justify-center border border-bg-secondary">
              {activeAlerts}
            </span>
          )}
        </button>
        
        {/* Profile Avatar Mock */}
        <div className="flex items-center space-x-3 pl-2 border-l border-border-custom">
          <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-white border border-border-custom">
            OP
          </div>
          <div className="hidden sm:flex flex-col select-none">
            <span className="text-xs font-semibold text-white leading-none">Operator #04</span>
            <span className="text-[10px] text-slate-500 font-mono mt-1">SOC Level-2</span>
          </div>
        </div>
      </div>
    </header>
  )
}
