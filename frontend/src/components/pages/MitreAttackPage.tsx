import React, { useState } from 'react'
import { PageShell } from '../ui/PageShell'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Layers } from 'lucide-react'

export const MitreAttackPage: React.FC = () => {
  const [selectedTactic, setSelectedTactic] = useState<string | null>(null)

  const matrix = [
    { tactic: 'Initial Access', coverage: '90%', count: 12, techniques: ['Spearphishing Link (T1566.002)', 'Valid Accounts (T1078)', 'External Services (T1133)'] },
    { tactic: 'Execution', coverage: '85%', count: 9, techniques: ['User Execution (T1204.002)', 'PowerShell Command (T1059.001)', 'WMI Client (T1047)'] },
    { tactic: 'Persistence', coverage: '70%', count: 6, techniques: ['Registry Run Keys (T1547.001)', 'Scheduled Task (T1053.005)', 'Create Account (T1136)'] },
    { tactic: 'Credential Access', coverage: '80%', count: 8, techniques: ['Brute Force (T1110.001)', 'OS Credential Dumping (T1003)', 'Kerberoasting (T1558.003)'] },
    { tactic: 'Command & Control', coverage: '95%', count: 11, techniques: ['DNS Tunneling (T1071.004)', 'Web Protocols HTTP/S (T1071.001)', 'Fallback Channels (T1008)'] },
    { tactic: 'Exfiltration', coverage: '65%', count: 4, techniques: ['Exfil Over protocol (T1048.003)', 'Alternative Medium (T1041)', 'Data Encrypted (T1020)'] }
  ]

  return (
    <PageShell
      title="MITRE ATT&CK Matrix"
      description="Inspect threat coverage, detection mappings, and configuration gaps across the MITRE Enterprise ATT&CK matrix layout."
      breadcrumbs={['Compliance', 'MITRE ATT&CK']}
      emptyState={
        !selectedTactic
          ? {
              title: 'No tactic selected',
              description: 'Select an adversarial tactic block to review simulated technique coverages and active alerts.',
              actionText: 'Review Command & Control Coverage',
              onAction: () => setSelectedTactic('Command & Control')
            }
          : undefined
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {matrix.map((item, idx) => (
          <Card
            key={idx}
            hoverEffect
            className={`cursor-pointer border transition-all duration-300 p-4 min-h-[160px] flex flex-col justify-between ${
              selectedTactic === item.tactic ? 'border-accent bg-accent/5' : 'border-border-custom'
            }`}
            onClick={() => setSelectedTactic(item.tactic)}
          >
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">{item.tactic}</span>
              <div className="text-xl font-extrabold text-white mt-2 font-mono">{item.coverage}</div>
            </div>
            <div className="mt-4 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">{item.count} Techniques</span>
              <Badge variant={parseInt(item.coverage) >= 85 ? 'success' : parseInt(item.coverage) >= 70 ? 'warning' : 'critical'} size="sm">
                {parseInt(item.coverage) >= 85 ? 'High' : parseInt(item.coverage) >= 70 ? 'Medium' : 'Audit Required'}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {selectedTactic && (
        <Card className="p-6 border border-accent/30 bg-accent/5 space-y-4">
          <div className="flex items-center space-x-2">
            <Layers className="h-5 w-5 text-accent animate-pulse" />
            <h3 className="text-sm font-bold text-white">Technique Audit: {selectedTactic}</h3>
          </div>

          {matrix.filter((m) => m.tactic === selectedTactic).map((item) => (
            <div key={item.tactic} className="space-y-4">
              <div className="text-xs text-slate-400">
                Primary matched rules and endpoint detections in scope for <strong className="text-white">{item.tactic}</strong>:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {item.techniques.map((tech, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-bg-primary border border-border-custom space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-accent font-semibold">T-{tech.split('T')[1].split(')')[0]}</span>
                      <span className="h-2 w-2 rounded-full bg-success-custom shrink-0" />
                    </div>
                    <h4 className="text-xs font-bold text-white">{tech.split(' (')[0]}</h4>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">Ingestion validation rule operational.</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Card>
      )}
    </PageShell>
  )
}
