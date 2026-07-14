import React, { useState, useRef, useEffect } from 'react'
import { Bell, LogOut, User as UserIcon, Settings, Shield } from 'lucide-react'
import { SearchBar } from '../ui/SearchBar'
import { Badge } from '../ui/Badge'
import { useUIStore } from '../../store/uiStore'
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'
import { CommandPalette } from '../ui/CommandPalette'

interface NavbarProps {
  apiStatus: 'healthy' | 'unhealthy' | 'loading'
}

export const Navbar: React.FC<NavbarProps> = ({ apiStatus }) => {
  const { toggleNotificationPanel, setSearchQuery, incidents, setActiveTab } = useUIStore()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const activeAlerts = incidents.filter(inc => inc.status === 'active').length
  
  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const statusConfig = {
    healthy: { variant: 'success', text: 'API Connected' },
    unhealthy: { variant: 'critical', text: 'API Disconnected' },
    loading: { variant: 'warning', text: 'Connecting...' }
  } as const

  const getInitials = (name?: string) => {
    if (!name) return 'OP'
    return name.slice(0, 2).toUpperCase()
  }
  
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
        
        {/* Profile Avatar & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-3 pl-2 border-l border-border-custom cursor-pointer focus:outline-none text-left"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-accent to-blue-600 flex items-center justify-center font-bold text-xs text-[#0B1020] border border-accent/30 shadow-sm shadow-accent/5">
              {getInitials(user?.username)}
            </div>
            <div className="hidden sm:flex flex-col select-none">
              <span className="text-xs font-semibold text-white leading-none">
                {user?.username || 'Operator'}
              </span>
              <span className="text-[10px] text-accent font-mono mt-1 block">
                {user?.role || 'SOC Level-2'}
              </span>
            </div>
          </button>

          {/* Premium Dropdown Panel */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 glass-panel border border-border-custom rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Header Info */}
              <div className="p-3 border-b border-border-custom/50 flex flex-col space-y-1">
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Active Credentials</span>
                <span className="text-xs font-bold text-white truncate">{user?.username}</span>
                <span className="text-[10px] text-slate-400 truncate">{user?.email}</span>
                <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-accent/10 border border-accent/25 text-accent text-[9px] font-mono mt-1.5 self-start">
                  <Shield className="h-3 w-3" />
                  <span>{user?.role}</span>
                </div>
              </div>

              {/* Navigation Options */}
              <div className="py-2 space-y-0.5">
                <button
                  onClick={() => {
                    setActiveTab('profile')
                    setDropdownOpen(false)
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-slate-300 hover:text-white hover:bg-bg-primary/45 rounded-lg transition text-left text-xs cursor-pointer hover:border-transparent"
                >
                  <UserIcon className="h-4 w-4 text-slate-400" />
                  <span>Profile Overview</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('settings')
                    setDropdownOpen(false)
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-slate-300 hover:text-white hover:bg-bg-primary/45 rounded-lg transition text-left text-xs cursor-pointer hover:border-transparent"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  <span>System Settings</span>
                </button>
              </div>

              {/* Logout Option */}
              <div className="pt-2 border-t border-border-custom/50">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2.5 px-3 py-2.5 text-critical-custom hover:text-white hover:bg-critical-custom/10 rounded-lg transition text-left text-xs font-semibold cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>De-authorize Terminal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
