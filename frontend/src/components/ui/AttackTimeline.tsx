import React from 'react'
import { Card } from './Card'
import { Badge } from './Badge'
import { PlayCircle, ShieldAlert, Key, Database, ArrowRightLeft } from 'lucide-react'

interface TimelinePhase {
  phase: string
  title: string
  timestamp: string
  description: string
  status: 'active' | 'mitigated' | 'pending'
  severity: 'critical' | 'warning' | 'info'
  icon: React.ReactNode
}

export const AttackTimeline: React.FC = () => {
  const phases: TimelinePhase[] = [
    {
      phase: 'T1566.002',
      title: 'Initial Access: Spearphishing Link Executed',
      timestamp: '19:12:03',
      description: 'Employee opened malicious link on Workstation-HR-04 triggering payload download.',
      status: 'active',
      severity: 'critical',
      icon: <ShieldAlert className="h-4 w-4" />
    },
    {
      phase: 'T1110.001',
      title: 'Credential Access: Adversary Bruteforce on DB Node',
      timestamp: '19:42:15',
      description: 'SSH bruteforce authentication failures detected on postgresql cluster from 198.51.100.12.',
      status: 'active',
      severity: 'critical',
      icon: <Database className="h-4 w-4" />
    },
    {
      phase: 'T1078.002',
      title: 'Privilege Escalation: Domain Controller Admin Attempt',
      timestamp: '19:28:46',
      description: 'Security log anomaly: unauthorized attempt to fetch active AD credentials token.',
      status: 'mitigated',
      severity: 'warning',
      icon: <Key className="h-4 w-4" />
    },
    {
      phase: 'T1048.003',
      title: 'Exfiltration: DNS Tunneling High Entropy Queries',
      timestamp: '19:35:48',
      description: 'Exfiltration channel active: high-frequency DNS query anomalies detected on node 10.0.12.14.',
      status: 'active',
      severity: 'critical',
      icon: <ArrowRightLeft className="h-4 w-4" />
    }
  ]

  const statusColors = {
    active: 'border-critical-custom text-critical-custom bg-critical-custom/10 cyber-pulse-ring',
    mitigated: 'border-success-custom text-success-custom bg-success-custom/10',
    pending: 'border-slate-700 text-slate-500 bg-slate-800'
  }

  return (
    <Card hoverEffect className="cyber-scanner relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-white leading-none">Attack Path Timeline</h3>
          <p className="text-slate-500 text-xs mt-1">Multi-stage incident tracking correlation across corporate subnets.</p>
        </div>
        <div className="flex items-center space-x-2">
          <PlayCircle className="h-4 w-4 text-accent animate-pulse" />
          <span className="text-xs font-mono text-accent">Simulation Active</span>
        </div>
      </div>

      <div className="relative pl-4 space-y-8">
        {/* Connecting vertical line */}
        <div className="absolute left-[29px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-critical-custom via-warning-custom to-border-custom" />

        {phases.map((item, idx) => (
          <div key={idx} className="relative flex items-start space-x-6 group">
            {/* Timeline node */}
            <div className={`relative z-10 flex items-center justify-center h-8 w-8 rounded-full border-2 transition-transform duration-300 group-hover:scale-110 shrink-0 ${statusColors[item.status]}`}>
              {item.icon}
            </div>

            {/* Content box */}
            <div className="flex-1 p-4 rounded-xl bg-bg-primary/45 border border-border-custom/50 hover:border-slate-700 transition duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs text-accent font-semibold">{item.phase}</span>
                  <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <Badge variant={item.severity} type="severity" size="sm">{item.severity}</Badge>
                  <span className="text-xs font-mono text-slate-500">{item.timestamp}</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
