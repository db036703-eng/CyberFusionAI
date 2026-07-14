import React from 'react'
import { motion } from 'framer-motion'
import { Card } from './Card'
import { AlertCircle } from 'lucide-react'

interface MitreTactics {
  tactic: string
  techniqueId: string
  techniqueName: string
  activeCount: number
  severity: 'critical' | 'warning' | 'none'
}

export const MitreAttackMatrix: React.FC = () => {
  const tactics: MitreTactics[] = [
    {
      tactic: 'Initial Access',
      techniqueId: 'T1566.002',
      techniqueName: 'Spearphishing Link',
      activeCount: 1,
      severity: 'critical'
    },
    {
      tactic: 'Execution',
      techniqueId: 'T1204.002',
      techniqueName: 'User Execution',
      activeCount: 1,
      severity: 'critical'
    },
    {
      tactic: 'Persistence',
      techniqueId: 'T1078.002',
      techniqueName: 'Domain Accounts',
      activeCount: 0,
      severity: 'none'
    },
    {
      tactic: 'Credential Access',
      techniqueId: 'T1110.001',
      techniqueName: 'Brute Force SSH',
      activeCount: 1,
      severity: 'critical'
    },
    {
      tactic: 'Command & Control',
      techniqueId: 'T1071.004',
      techniqueName: 'DNS Tunneling',
      activeCount: 1,
      severity: 'warning'
    },
    {
      tactic: 'Exfiltration',
      techniqueId: 'T1048.003',
      techniqueName: 'Exfil Over Protocol',
      activeCount: 0,
      severity: 'none'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.96 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' as const } }
  }

  return (
    <Card hoverEffect className="relative bg-[#12182A]/90 border border-border-custom/80 shadow-[0_8px_30px_rgb(0,0,0,0.25)] rounded-2xl p-6 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white leading-none">MITRE ATT&CK Matrix Mapping</h3>
            <p className="text-slate-500 text-xs mt-1">Real-time correlation of anomalies to adversary tactics and techniques.</p>
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-6"
        >
          {tactics.map((item, idx) => {
            const isActive = item.activeCount > 0
            const borderStyle = 
              item.severity === 'critical' ? 'border-danger/30 hover:border-danger/80 bg-danger/5 shadow-danger/5' :
              item.severity === 'warning' ? 'border-warning/30 hover:border-warning/80 bg-warning/5 shadow-warning/5' :
              'border-border-custom bg-[#0A0F1F]/40 hover:border-slate-700/80'

            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className={`flex flex-col justify-between p-4 rounded-xl border transition-all duration-300 hover:shadow-lg ${borderStyle}`}
              >
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block mb-1.5">
                    {item.tactic}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-accent">
                    {item.techniqueId}
                  </span>
                  <h4 className="text-xs font-semibold text-slate-200 mt-1.5 leading-snug">
                    {item.techniqueName}
                  </h4>
                </div>

                <div className="mt-5 flex items-center justify-between select-none">
                  {isActive ? (
                    <span className={`inline-flex items-center text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                      item.severity === 'critical' ? 'text-critical-custom bg-critical-custom/10' : 'text-warning-custom bg-warning-custom/10'
                    }`}>
                      <AlertCircle className="h-3 w-3 mr-1 shrink-0" />
                      <span>{item.activeCount} Active</span>
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-slate-600 font-medium">Inactive</span>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </Card>
  )
}
