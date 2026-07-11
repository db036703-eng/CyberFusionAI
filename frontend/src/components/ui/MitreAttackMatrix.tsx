import React from 'react'
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

  return (
    <Card hoverEffect className="relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white leading-none">MITRE ATT&CK Matrix Mapping</h3>
          <p className="text-slate-500 text-xs mt-1">Real-time correlation of anomalies to adversary tactics and techniques.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
        {tactics.map((item, idx) => {
          const isActive = item.activeCount > 0
          const borderStyle = 
            item.severity === 'critical' ? 'border-critical-custom/30 hover:border-critical-custom/80 bg-critical-custom/5' :
            item.severity === 'warning' ? 'border-warning-custom/30 hover:border-warning-custom/80 bg-warning-custom/5' :
            'border-border-custom bg-bg-primary/20 hover:border-slate-700'

          return (
            <div
              key={idx}
              className={`flex flex-col justify-between p-3.5 rounded-xl border transition-all duration-300 hover:shadow-md ${borderStyle}`}
            >
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-1">
                  {item.tactic}
                </span>
                <span className="text-[11px] font-mono font-bold text-accent">
                  {item.techniqueId}
                </span>
                <h4 className="text-xs font-semibold text-slate-200 mt-1 leading-snug">
                  {item.techniqueName}
                </h4>
              </div>

              <div className="mt-4 flex items-center justify-between">
                {isActive ? (
                  <span className={`inline-flex items-center text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                    item.severity === 'critical' ? 'text-critical-custom bg-critical-custom/10' : 'text-warning-custom bg-warning-custom/10'
                  }`}>
                    <AlertCircle className="h-3 w-3 mr-1" />
                    <span>{item.activeCount} Active</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-600">Inactive</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
