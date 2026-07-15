import React from 'react'
import { motion } from 'framer-motion'
import { Card } from './Card'
import { Fingerprint, Globe, WifiOff } from 'lucide-react'

import { useUIStore } from '../../store/uiStore'

export const ThreatIntelFeed: React.FC = () => {
  const { threatFeed, isLoading } = useUIStore()

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } }
  }

  const FeedItemSkeleton = () => (
    <div className="flex items-center justify-between p-3.5 rounded-xl border border-border-custom/40 bg-slate-800/10 animate-pulse">
      <div className="flex items-center space-x-4 min-w-0 flex-1">
        <div className="p-2 rounded-lg bg-slate-800 w-8 h-8 shrink-0"></div>
        <div className="min-w-0 space-y-2 flex-1">
          <div className="h-3 bg-slate-800 rounded w-1/4"></div>
          <div className="h-3.5 bg-slate-800 rounded w-3/4"></div>
        </div>
      </div>
      <div className="flex flex-col items-end space-y-1.5 pl-2">
        <div className="h-3 bg-slate-800 rounded w-10"></div>
        <div className="h-3.5 bg-slate-800 rounded w-14"></div>
      </div>
    </div>
  )

  return (
    <Card hoverEffect className="relative overflow-hidden bg-[#12182A]/90 border border-border-custom/80 shadow-[0_8px_30px_rgb(0,0,0,0.25)] rounded-2xl p-6 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-white leading-none">Threat Intelligence Feed</h3>
        <p className="text-slate-500 text-xs mt-1">Live ingest of global threat indicators and vulnerability reports.</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mt-6 space-y-4"
      >
        {isLoading && threatFeed.length === 0 ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <FeedItemSkeleton key={idx} />
          ))
        ) : threatFeed.length === 0 ? (
          <div className="py-8 text-center text-slate-500 font-mono text-xs">
            No live threats currently ingested.
          </div>
        ) : (
          threatFeed.map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#0A0F1F]/40 border border-border-custom/60 hover:bg-[#0A0F1F]/70 hover:border-slate-700/80 transition duration-200"
            >
              <div className="flex items-center space-x-4 min-w-0">
                <div className="p-2 rounded-lg bg-[#12182A] border border-border-custom text-slate-400 shrink-0">
                  {item.id.startsWith('CVE') ? <Fingerprint className="h-4 w-4 text-warning-custom" /> : 
                   item.id.startsWith('IP') ? <WifiOff className="h-4 w-4 text-critical-custom" /> :
                   <Globe className="h-4 w-4 text-info-custom" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-white shrink-0">{item.id}</span>
                    <span className="text-[9px] text-slate-500 font-mono">via {item.source}</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-1 font-medium">{item.indicator}</p>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0 pl-2">
                <span className="text-[10px] text-slate-500 font-mono">{item.timestamp}</span>
                <span className="text-[10px] text-accent font-mono mt-1.5 font-semibold">{item.status}</span>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </Card>
  )
}
