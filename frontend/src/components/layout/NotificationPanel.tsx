import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShieldAlert, CircleAlert } from 'lucide-react'
import { useUIStore } from '../../store/uiStore'
import { Badge } from '../ui/Badge'

export const NotificationPanel: React.FC = () => {
  const { isNotificationOpen, closeNotificationPanel, incidents, selectIncident } = useUIStore()
  
  const activeIncidents = incidents.filter(inc => inc.status === 'active' || inc.status === 'investigating')
  
  return (
    <AnimatePresence>
      {isNotificationOpen && (
        <>
          {/* Transparent Backdrop Click Catcher */}
          <div className="fixed inset-0 z-35" onClick={closeNotificationPanel} />
          
          {/* Dropdown panel */}
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.98 }}
            className="absolute right-8 top-20 w-96 bg-bg-secondary border border-border-custom shadow-2xl rounded-card overflow-hidden z-40"
          >
            <div className="p-4 border-b border-border-custom bg-bg-primary/20 flex items-center justify-between">
              <span className="font-bold text-white text-sm">Active Threat Alerts</span>
              <button onClick={closeNotificationPanel} className="p-1 rounded text-slate-400 hover:text-white transition cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="max-h-[360px] overflow-y-auto divide-y divide-border-custom/50">
              {activeIncidents.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">No active threats detected.</div>
              ) : (
                activeIncidents.map((inc) => (
                  <div
                    key={inc.id}
                    onClick={() => {
                      selectIncident(inc)
                      closeNotificationPanel()
                    }}
                    className="p-4 hover:bg-bg-primary/25 cursor-pointer transition flex items-start space-x-3"
                  >
                    <div className={`mt-0.5 p-1 rounded-lg ${
                      inc.severity === 'critical' ? 'bg-critical-custom/10 text-critical-custom' : 'bg-warning-custom/10 text-warning-custom'
                    }`}>
                      {inc.severity === 'critical' ? <ShieldAlert className="h-4 w-4" /> : <CircleAlert className="h-4 w-4" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white truncate">{inc.title}</span>
                        <Badge variant={inc.severity} size="sm" type="severity">
                          {inc.severity}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 truncate">{inc.description}</p>
                      <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-slate-500">
                        <span>Source: {inc.source}</span>
                        <span>{inc.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
