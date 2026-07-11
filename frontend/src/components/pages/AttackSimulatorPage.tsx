import React, { useState } from 'react'
import { PageShell } from '../ui/PageShell'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Play, Cpu, CheckCircle } from 'lucide-react'

export const AttackSimulatorPage: React.FC = () => {
  const [runningSim, setRunningSim] = useState<string | null>(null)
  const [completedSim, setCompletedSim] = useState<string | null>(null)

  const scenarios = [
    { id: 'SIM-001', name: 'Spearphishing payload execution T1566.002', complexity: 'Low', target: 'Workstations' },
    { id: 'SIM-002', name: 'LockBit ransomware binary behavior validation', complexity: 'Critical', target: 'Server Nodes' },
    { id: 'SIM-003', name: 'DNS Tunneling custom exfiltration patterns', complexity: 'Warning', target: 'DNS Proxies' }
  ]

  const handleStartSim = (id: string) => {
    setRunningSim(id)
    setCompletedSim(null)
    setTimeout(() => {
      setRunningSim(null)
      setCompletedSim(id)
    }, 3000)
  }

  return (
    <PageShell
      title="Attack Simulator"
      description="Configure and inject simulated red-team adversarial actions in real-time to audit security coverage and detection pipelines."
      breadcrumbs={['Automation', 'Attack Simulator']}
      emptyState={
        !runningSim && !completedSim
          ? {
              title: 'No active simulation runs',
              description: 'Select an adversarial scenario profile from the options below to begin telemetry injection.',
              actionText: 'Initialize Threat Injection',
              onAction: () => handleStartSim('SIM-001')
            }
          : undefined
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scenarios.map((sc) => (
          <Card key={sc.id} hoverEffect className="flex flex-col justify-between min-h-[200px]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-accent font-semibold">{sc.id}</span>
                <Badge variant={sc.complexity === 'Critical' ? 'critical' : sc.complexity === 'Warning' ? 'warning' : 'info'} size="sm">
                  {sc.complexity}
                </Badge>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{sc.name}</h3>
              <p className="text-slate-500 text-xs mt-1">Scope: {sc.target}</p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border-custom/50 flex items-center justify-between">
              {runningSim === sc.id ? (
                <span className="text-xs text-accent font-mono flex items-center space-x-1.5 animate-pulse">
                  <Cpu className="h-3.5 w-3.5 animate-spin" />
                  <span>Injecting Telemetry...</span>
                </span>
              ) : completedSim === sc.id ? (
                <span className="text-xs text-success-custom font-mono flex items-center space-x-1.5">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Logs Generated</span>
                </span>
              ) : (
                <span className="text-xs text-slate-500 font-mono">Status: Standby</span>
              )}
              
              <Button
                variant="secondary"
                size="sm"
                disabled={runningSim !== null}
                onClick={() => handleStartSim(sc.id)}
                className="font-mono text-xs flex items-center space-x-1.5"
              >
                <Play className="h-3.5 w-3.5 text-accent" />
                <span>Run</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </PageShell>
  )
}
