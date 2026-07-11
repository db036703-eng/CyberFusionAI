import React, { useState } from 'react'
import { PageShell } from '../ui/PageShell'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Terminal, RefreshCw } from 'lucide-react'

export const AdminPage: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 2000)
  }

  return (
    <PageShell
      title="System Administration"
      description="Manage cluster settings, verify postgres pool details, check Redis caches, and run docker integrity scans."
      breadcrumbs={['System Health', 'Admin Panel']}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">Docker Cluster Status Summary</h3>
        <Button variant="secondary" size="sm" onClick={handleRefresh} disabled={refreshing} className="font-mono text-xs flex items-center space-x-2">
          <RefreshCw className={`h-4.5 w-4.5 text-accent ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Force System Check'}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col justify-between min-h-[160px]">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">Docker Stack Ingress</span>
            <h4 className="text-base font-bold text-white mt-1">Docker Compose Stack</h4>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Status: Operational</span>
            <Badge variant="success">Active</Badge>
          </div>
        </Card>

        <Card className="flex flex-col justify-between min-h-[160px]">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">Database connection pool</span>
            <h4 className="text-base font-bold text-white mt-1">PostgreSQL db cluster</h4>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Pool: 24/50 active</span>
            <Badge variant="info">Healthy</Badge>
          </div>
        </Card>

        <Card className="flex flex-col justify-between min-h-[160px]">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">Redis session cache</span>
            <h4 className="text-base font-bold text-white mt-1">Token memory cache</h4>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Latency: 1.2ms</span>
            <Badge variant="success">Active</Badge>
          </div>
        </Card>
      </div>

      <Card className="p-6 border border-border-custom">
        <div className="flex items-center space-x-2.5 mb-4">
          <Terminal className="h-5 w-5 text-accent animate-pulse" />
          <h3 className="text-sm font-bold text-white">Docker Drift Manifest Registry Log</h3>
        </div>
        
        <div className="bg-bg-primary/50 p-4 rounded-xl border border-border-custom/50 font-mono text-[11px] text-slate-500 space-y-2 leading-relaxed">
          <p>[10:42:15] postgres:15-alpine: verified sha256 mismatch: matches upstream hash check.</p>
          <p>[10:40:12] redis:7-alpine: verified sha256 mismatch: matches upstream hash check.</p>
          <p>[10:35:48] fastapi-backend-service: verified build manifests: 0 warnings.</p>
        </div>
      </Card>
    </PageShell>
  )
}
