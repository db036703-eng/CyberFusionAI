import React from 'react'
import { PageShell } from '../ui/PageShell'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Activity, Clock } from 'lucide-react'

export const ProfilePage: React.FC = () => {
  return (
    <PageShell
      title="Operator Profile"
      description="Review privileges, credentials flags, security tokens, and historical audit actions."
      breadcrumbs={['User Profile', 'Operator #04']}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <Card className="flex flex-col items-center justify-center p-6 text-center space-y-3 col-span-1">
          <div className="h-16 w-16 bg-slate-700 border-2 border-accent rounded-full flex items-center justify-center text-white font-bold text-xl font-mono">
            OP
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">Operator #04</h3>
            <span className="text-[10px] text-slate-500 font-mono block mt-1">ID: SOC-OP-4491-X</span>
          </div>
          <Badge variant="info">Level-2 Privileged Access</Badge>
        </Card>

        {/* Audit Details */}
        <Card className="col-span-2 space-y-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-accent animate-pulse" />
            <h3 className="text-sm font-bold text-white">Session Security Audits</h3>
          </div>
          
          <div className="space-y-3.5 text-xs font-mono">
            <div className="flex justify-between items-center py-2 border-b border-border-custom/50">
              <span className="text-slate-450">Active VPN Location</span>
              <span className="text-white">New York Subnet (10.0.124.9)</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border-custom/50">
              <span className="text-slate-450">Ingestion Ingress Token</span>
              <span className="text-accent truncate max-w-xs font-bold">eyJhY3RpdmVfc2Vzc2lvbl9pcCI6IjEwLjAuMTI0...</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-450">AD Group Mappings</span>
              <span className="text-white">SOC-Level2, IT-Core-Admins</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center">
          <Clock className="h-4.5 w-4.5 text-slate-450 mr-2" />
          Recent Session Logs (Operator Activity)
        </h3>
        
        <div className="p-4 rounded-xl bg-bg-secondary border border-border-custom space-y-3 text-xs font-mono">
          <div className="flex justify-between text-slate-400">
            <span>[2026-07-11 10:42:15] Mitigated adversary brute force (INC-2026-001) on server 10.0.4.82.</span>
            <span className="text-success-custom font-semibold">Success</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>[2026-07-11 08:12:03] Revoked Active Directory credentials for Workstation HR-04 user.</span>
            <span className="text-success-custom font-semibold">Success</span>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
