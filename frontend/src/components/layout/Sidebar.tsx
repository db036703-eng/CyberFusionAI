import React from 'react'
import { motion } from 'framer-motion'
import { Shield, ChevronLeft, ChevronRight, LayoutDashboard, AlertOctagon, Activity, Settings } from 'lucide-react'
import { useUIStore } from '../../store/uiStore'

export const Sidebar: React.FC = () => {
  const { sidebarOpen, activeTab, toggleSidebar, setActiveTab } = useUIStore()
  
  const navItems = [
    { id: 'overview', name: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'incidents', name: 'Incidents', icon: <AlertOctagon className="h-5 w-5" /> },
    { id: 'health', name: 'System Health', icon: <Activity className="h-5 w-5" /> },
  ]
  
  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 260 : 80 }}
      transition={{ type: 'spring', damping: 25, stiffness: 220 }}
      className="h-screen sticky top-0 left-0 bg-bg-secondary border-r border-border-custom flex flex-col justify-between shrink-0 overflow-hidden z-20"
    >
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-border-custom flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-accent to-blue-600 flex items-center justify-center shadow-lg shadow-accent/15 shrink-0">
              <Shield className="h-5 w-5 text-[#0B1020] stroke-[2.5]" />
            </div>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col select-none"
              >
                <span className="font-extrabold text-sm tracking-wider text-white uppercase leading-none">CyberFusion</span>
                <span className="text-[9px] text-accent font-mono tracking-widest uppercase block mt-1">AI PLATFORM</span>
              </motion.div>
            )}
          </div>
          
          {sidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-lg text-slate-400 hover:bg-bg-primary/45 hover:text-white transition cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-accent/10 text-accent font-semibold border border-accent/20'
                    : 'text-slate-400 hover:bg-bg-primary/30 hover:text-slate-200 border border-transparent'
                }`}
              >
                <div className="shrink-0">{item.icon}</div>
                {sidebarOpen && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm">
                    {item.name}
                  </motion.span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Footer Toggle / Settings */}
      <div className="p-4 border-t border-border-custom space-y-2">
        <button className="w-full flex items-center space-x-3 p-3 text-slate-400 hover:text-slate-200 rounded-xl cursor-pointer">
          <Settings className="h-5 w-5 shrink-0" />
          {sidebarOpen && <span className="text-sm">Settings</span>}
        </button>
        
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center p-3 text-slate-400 hover:text-white rounded-xl hover:bg-bg-primary/30 cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </motion.aside>
  )
}
