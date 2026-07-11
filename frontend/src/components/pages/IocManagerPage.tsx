import React, { useState } from 'react'
import { PageShell } from '../ui/PageShell'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Target, Upload, Database, Check } from 'lucide-react'

export const IocManagerPage: React.FC = () => {
  const [synced, setSynced] = useState(false)

  const activeIocs = [
    { type: 'IP Address', value: '198.51.100.12', category: 'Botnet SSH' },
    { type: 'SHA-256 Hash', value: '4a8f9a2b8e3d8f1c7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f', category: 'LockBit Bin' },
    { type: 'Domain Name', value: 'dga-exfil.xyz', category: 'DNS Tunneling C2' }
  ]

  return (
    <PageShell
      title="IOC Manager"
      description="Manage enterprise indicators of compromise. Import CSV or STIX/TAXII manifests to deploy threat matching rules instantly."
      breadcrumbs={['Subnets', 'IOC Manager']}
      emptyState={
        !synced
          ? {
              title: 'Database requires sync',
              description: 'Local indicator matching definitions have not been fully broadcasted to the endpoint client group.',
              actionText: 'Broadcast Sync Rules',
              onAction: () => setSynced(true)
            }
          : undefined
      }
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-bg-secondary p-6 rounded-xl border border-border-custom">
        <div className="flex items-center space-x-3.5">
          <div className="h-10 w-10 bg-accent/10 border border-accent/30 rounded-xl flex items-center justify-center text-accent">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-none">Ingested Custom Rules</h3>
            <p className="text-slate-400 text-xs mt-1">3 active matched targets across 1,428 monitored endpoints.</p>
          </div>
        </div>

        <Button variant="secondary" size="sm" className="font-mono text-xs flex items-center space-x-2">
          <Upload className="h-4 w-4 text-slate-400" />
          <span>Upload CSV Manifest</span>
        </Button>
      </div>

      {synced && (
        <Card className="p-4 border-success-custom/35 bg-success-custom/5 text-success-custom flex items-center space-x-3">
          <Check className="h-5 w-5" />
          <span className="text-xs font-mono font-semibold">Endpoint threat sync completed successfully. All nodes updated.</span>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white">Active IOC Database Matching Rules</h3>
        {activeIocs.map((ioc, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-4 rounded-xl bg-bg-primary/45 border border-border-custom/50 hover:bg-bg-primary/95 transition duration-200"
          >
            <div className="flex items-center space-x-4 min-w-0">
              <div className="p-2 bg-bg-secondary border border-border-custom rounded-lg text-slate-450 shrink-0">
                <Target className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-accent block uppercase">{ioc.type}</span>
                <span className="text-xs font-mono font-bold text-white truncate block mt-0.5 max-w-[280px] sm:max-w-xl">
                  {ioc.value}
                </span>
              </div>
            </div>
            <Badge variant="warning">{ioc.category}</Badge>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
