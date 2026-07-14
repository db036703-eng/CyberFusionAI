import React from 'react'
import { motion } from 'framer-motion'
import {
  Shield,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  AlertOctagon,
  Play,
  Globe,
  Target,
  Users,
  Layers,
  History,
  FileText,
  Brain,
  Settings,
  User,
  ShieldCheck,
  Activity
} from 'lucide-react'
import { useUIStore } from '../../store/uiStore'
import { useAuthStore } from '../../store/authStore'

export const Sidebar: React.FC = () => {
  const { sidebarOpen, activeTab, toggleSidebar, setActiveTab } = useUIStore()
  const { user } = useAuthStore()
  
  const navItems = [
    { id: 'overview', name: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'incidents', name: 'Incidents', icon: <AlertOctagon className="h-4 w-4" /> },
    { id: 'simulator', name: 'Attack Simulator', icon: <Play className="h-4 w-4" /> },
    { id: 'intel', name: 'Threat Intelligence', icon: <Globe className="h-4 w-4" /> },
    { id: 'ioc', name: 'IOC Manager', icon: <Target className="h-4 w-4" /> },
    { id: 'actors', name: 'Threat Actors', icon: <Users className="h-4 w-4" /> },
    { id: 'mitre', name: 'MITRE ATT&CK', icon: <Layers className="h-4 w-4" /> },
    { id: 'timeline', name: 'Attack Timeline', icon: <History className="h-4 w-4" /> },
    { id: 'reports', name: 'Reports', icon: <FileText className="h-4 w-4" /> },
    { id: 'ai_analyst', name: 'AI Analyst', icon: <Brain className="h-4 w-4" /> },
    { id: 'settings', name: 'Settings', icon: <Settings className="h-4 w-4" /> },
    { id: 'profile', name: 'Profile', icon: <User className="h-4 w-4" /> },
    { id: 'admin', name: 'Admin', icon: <ShieldCheck className="h-4 w-4" /> },
    { id: 'health', name: 'System Health', icon: <Activity className="h-4 w-4" /> }
  ]

  const filteredNavItems = navItems.filter((item) => {
    if (!user) return false
    if (user.role === 'Viewer') {
      return !['admin', 'simulator', 'ioc'].includes(item.id)
    }
    if (user.role === 'Threat Hunter') {
      return !['admin', 'simulator'].includes(item.id)
    }
    if (user.role === 'SOC Analyst') {
      return item.id !== 'admin'
    }
    return true
  })
  
  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 250 : 78 }}
      transition={{ type: 'spring', damping: 24, stiffness: 200 }}
      className="h-screen sticky top-0 left-0 bg-[#0E1324] border-r border-border-custom/80 flex flex-col justify-between shrink-0 overflow-hidden z-20 shadow-2xl"
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Brand Header */}
        <div className="p-4 border-b border-border-custom/50 flex items-center justify-between shrink-0 h-[65px] bg-[#0A0F1F]/40 backdrop-blur-md">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="h-8.5 w-8.5 rounded-lg bg-gradient-to-tr from-[#00C2FF] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-accent/10 shrink-0">
              <Shield className="h-4.5 w-4.5 text-[#0A0F1F] stroke-[2.5]" />
            </div>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col select-none"
              >
                <span className="font-extrabold text-[13px] tracking-wide text-white uppercase leading-none">CyberFusion</span>
                <span className="text-[7.5px] text-accent font-mono tracking-widest uppercase block mt-1">AI PLATFORM</span>
              </motion.div>
            )}
          </div>
          
          {sidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-lg text-slate-400 hover:bg-[#1E293B]/40 hover:text-white transition cursor-pointer border border-transparent hover:border-border-custom/60"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Navigation Items (Scrollable) */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar scrollbar-thin">
          {filteredNavItems.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center p-2.5 rounded-lg transition-all duration-150 cursor-pointer relative select-none group ${
                  sidebarOpen ? 'space-x-3.5 px-3' : 'justify-center'
                } ${
                  isActive
                    ? 'text-accent font-semibold bg-accent/5'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-[#1E293B]/25'
                }`}
              >
                {/* Active soft-glow line indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 w-[3px] h-5 bg-accent rounded-r-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
                
                <div className={`shrink-0 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-accent' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {item.icon}
                </div>
                
                {sidebarOpen && (
                  <motion.span 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="text-[12px] whitespace-nowrap text-left font-medium tracking-wide"
                  >
                    {item.name}
                  </motion.span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Footer Toggle */}
      <div className="p-3 border-t border-border-custom/50 shrink-0 bg-[#0A0F1F]/40 backdrop-blur-md">
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#1E293B]/40 cursor-pointer border border-transparent hover:border-border-custom/50"
          >
            <ChevronRight className="h-4.5 w-4.5" />
          </button>
        )}
        {sidebarOpen && (
          <div className="flex items-center justify-between px-2.5 py-1 select-none">
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">CONSOLE STABLE</span>
            <div className="flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  )
}
