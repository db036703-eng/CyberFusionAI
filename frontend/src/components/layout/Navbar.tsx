import React, { useState, useRef, useEffect } from 'react'
import { Bell, LogOut, User as UserIcon, Settings, Shield, ChevronDown, HardDrive } from 'lucide-react'
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
  const [workspaceOpen, setWorkspaceOpen] = useState(false)
  const [currentWorkspace, setCurrentWorkspace] = useState('US-East Ingress')
  
  const dropdownRef = useRef<HTMLDivElement>(null)
  const workspaceRef = useRef<HTMLDivElement>(null)
  
  const activeAlerts = incidents.filter(inc => inc.status === 'active').length
  
  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
      if (workspaceRef.current && !workspaceRef.current.contains(event.target as Node)) {
        setWorkspaceOpen(false)
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

  const workspaces = [
    { id: 'us', name: 'US-East Ingress', desc: 'Active primary gateway' },
    { id: 'eu', name: 'EU-West Cluster', desc: 'Failover mirror channel' },
    { id: 'global', name: 'Global Gateway', desc: 'BGP edge routing route' }
  ]
  
  return (
    <header className="sticky top-0 z-10 w-full h-[65px] bg-[#0A0F1F]/70 backdrop-blur-xl border-b border-border-custom/50 px-8 flex items-center justify-between shrink-0 shadow-lg">
      
      {/* Left side: Workspace Switcher & API Status */}
      <div className="flex items-center space-x-4">
        {/* Workspace Switcher */}
        <div className="relative" ref={workspaceRef}>
          <button
            onClick={() => setWorkspaceOpen(!workspaceOpen)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-border-custom bg-[#12182A]/40 hover:bg-[#1E293B]/30 hover:border-slate-700/80 text-slate-300 hover:text-white transition duration-200 text-xs font-semibold cursor-pointer select-none"
          >
            <HardDrive className="h-3.5 w-3.5 text-accent" />
            <span className="font-mono text-[11px] tracking-wide">{currentWorkspace}</span>
            <ChevronDown className="h-3 w-3 text-slate-500" />
          </button>
          
          {workspaceOpen && (
            <div className="absolute left-0 mt-2 w-56 bg-[#12182A]/95 border border-border-custom/80 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 glass-panel">
              <span className="text-[8px] font-mono text-slate-500 uppercase px-2 py-1 block tracking-wider">Switch Cluster Node</span>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    setCurrentWorkspace(ws.name)
                    setWorkspaceOpen(false)
                  }}
                  className={`w-full flex flex-col items-start px-2 py-1.5 rounded-lg text-left text-xs transition cursor-pointer hover:border-transparent ${
                    currentWorkspace === ws.name
                      ? 'bg-accent/10 text-accent font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-[#1E293B]/40'
                  }`}
                >
                  <span className="font-medium">{ws.name}</span>
                  <span className="text-[8.5px] text-slate-500 font-normal mt-0.5">{ws.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* API Health Connection Badge */}
        <Badge variant={statusConfig[apiStatus].variant} type="status" className="px-2.5 py-0.5 text-[10px] select-none font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                apiStatus === 'healthy' ? 'bg-success' : apiStatus === 'loading' ? 'bg-warning' : 'bg-danger'
              }`} />
              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                apiStatus === 'healthy' ? 'bg-success' : apiStatus === 'loading' ? 'bg-warning' : 'bg-danger'
              }`} />
            </span>
            <span className="font-semibold">{statusConfig[apiStatus].text}</span>
          </div>
        </Badge>
      </div>

      {/* Middle: Command Palette Search */}
      <div className="flex-1 max-w-lg mx-6 hidden md:flex items-center space-x-2">
        <SearchBar placeholder="Search telemetry logs, assets, techniques..." onSearchChange={setSearchQuery} />
        <CommandPalette />
      </div>
      
      {/* Right side: Controls & Profile Dropdown */}
      <div className="flex items-center space-x-4">
        
        {/* Notification Bell */}
        <button
          onClick={toggleNotificationPanel}
          className="relative p-2 rounded-xl border border-border-custom hover:border-slate-700 bg-[#12182A]/30 hover:bg-[#1E293B]/20 transition cursor-pointer text-slate-400 hover:text-white"
        >
          <Bell className="h-4.5 w-4.5" />
          {activeAlerts > 0 && (
            <span className="absolute -top-1 -right-1 h-4.5 w-4.5 bg-danger text-white font-mono text-[9px] font-bold rounded-full flex items-center justify-center border border-[#0A0F1F] animate-pulse">
              {activeAlerts}
            </span>
          )}
        </button>
        
        {/* Profile Avatar & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-3 pl-4 border-l border-border-custom/50 cursor-pointer focus:outline-none text-left"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-accent to-[#3B82F6] flex items-center justify-center font-bold text-xs text-[#0A0F1F] border border-accent/20 shadow-md shadow-accent/5">
              {getInitials(user?.username)}
            </div>
            <div className="hidden sm:flex flex-col select-none">
              <span className="text-xs font-semibold text-white leading-none">
                {user?.username || 'Operator'}
              </span>
              <div className="flex items-center mt-1">
                <span className="text-[9px] text-accent font-mono uppercase tracking-wider font-semibold">
                  {user?.role || 'SOC Analyst'}
                </span>
              </div>
            </div>
          </button>

          {/* Premium Dropdown Panel */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-[#12182A]/95 border border-border-custom rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 glass-panel">
              <div className="p-3 border-b border-border-custom/50 flex flex-col space-y-1">
                <span className="text-[8px] text-slate-500 font-mono uppercase tracking-wider">Terminal Operator Context</span>
                <span className="text-xs font-bold text-white truncate">{user?.username}</span>
                <span className="text-[10px] text-slate-450 truncate">{user?.email}</span>
                <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent text-[9px] font-mono mt-1.5 self-start select-none">
                  <Shield className="h-3 w-3" />
                  <span>{user?.role}</span>
                </div>
              </div>

              <div className="py-2 space-y-0.5">
                <button
                  onClick={() => {
                    setActiveTab('profile')
                    setDropdownOpen(false)
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-slate-300 hover:text-white hover:bg-[#1E293B]/25 rounded-lg transition text-left text-xs cursor-pointer"
                >
                  <UserIcon className="h-4 w-4 text-slate-450" />
                  <span>Profile Settings</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('settings')
                    setDropdownOpen(false)
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-slate-300 hover:text-white hover:bg-[#1E293B]/25 rounded-lg transition text-left text-xs cursor-pointer"
                >
                  <Settings className="h-4 w-4 text-slate-450" />
                  <span>Workspace Preferences</span>
                </button>
              </div>

              <div className="pt-2 border-t border-border-custom/50">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2.5 px-3 py-2.5 text-danger hover:text-white hover:bg-danger/10 rounded-lg transition text-left text-xs font-semibold cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>De-authorize Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
