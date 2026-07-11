import React, { useState } from 'react'
import { PageShell } from '../ui/PageShell'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { ShieldAlert, Search } from 'lucide-react'

export const ThreatIntelPage: React.FC = () => {
  const [searchVal, setSearchVal] = useState('')
  const [searched, setSearched] = useState(false)

  const activeThreats = [
    { source: 'APT-29 (Cozy Bear)', signature: 'Win/Backdoor.Agent.L', cve: 'CVE-2026-3011' },
    { source: 'Lazarus Group', signature: 'Linux/Trojan.Dropper.K', cve: 'CVE-2025-9981' }
  ]

  return (
    <PageShell
      title="Threat Intelligence"
      description="Access integrated databases mapping out global threat indices, zero-day CVE records, and suspicious reputation logs."
      breadcrumbs={['Subnets', 'Threat Intelligence']}
      emptyState={
        !searched
          ? {
              title: 'No search queries performed',
              description: 'Audit malicious IPs or check indicator records using the search bar above.',
              actionText: 'Check IP: 198.51.100.12',
              onAction: () => {
                setSearchVal('198.51.100.12')
                setSearched(true)
              }
            }
          : undefined
      }
    >
      <div className="flex items-center space-x-3 max-w-xl bg-bg-secondary border border-border-custom px-4 py-2.5 rounded-xl">
        <Search className="h-4.5 w-4.5 text-slate-400" />
        <input
          type="text"
          placeholder="Lookup IP Address, Domain, File Hash..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          className="flex-1 bg-transparent border-0 outline-none text-sm text-slate-100 placeholder-slate-500"
          onKeyDown={(e) => e.key === 'Enter' && setSearched(true)}
        />
        <Button variant="primary" size="sm" onClick={() => setSearched(true)} className="font-mono text-xs">
          Analyze
        </Button>
      </div>

      {searched && (
        <Card className="p-6 border border-critical-custom/30 bg-critical-custom/5">
          <div className="flex items-center space-x-3 mb-4">
            <ShieldAlert className="h-5 w-5 text-critical-custom" />
            <h3 className="font-bold text-white text-sm">Threat Match Identified: {searchVal}</h3>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">
            Target matches critical signatures linked to active brute force scans. Associated APT Campaigns: Cozy Bear (APT-29).
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeThreats.map((item, idx) => (
          <Card key={idx} hoverEffect className="space-y-4">
            <div>
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Threat Group Match</span>
              <h3 className="text-base font-bold text-white mt-1">{item.source}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-bg-primary/50 border border-border-custom rounded-lg">
                <span className="text-slate-500 text-[10px] block uppercase">Malware Signature</span>
                <span className="text-slate-200 block mt-1">{item.signature}</span>
              </div>
              <div className="p-3 bg-bg-primary/50 border border-border-custom rounded-lg">
                <span className="text-slate-500 text-[10px] block uppercase">CVE Tag</span>
                <span className="text-accent block mt-1 font-semibold">{item.cve}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageShell>
  )
}
