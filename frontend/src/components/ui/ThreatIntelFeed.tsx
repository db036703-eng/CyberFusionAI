import React from 'react'
import { Card } from './Card'
import { Fingerprint, Globe, WifiOff } from 'lucide-react'

interface ThreatFeedItem {
  id: string
  source: string
  indicator: string
  severity: 'critical' | 'warning' | 'info'
  timestamp: string
  status: string
}

export const ThreatIntelFeed: React.FC = () => {
  const feeds: ThreatFeedItem[] = [
    {
      id: 'CVE-2026-3011',
      source: 'NVD Registry',
      indicator: 'CVSS 9.8: RCE in enterprise directory authentication services',
      severity: 'critical',
      timestamp: '10m ago',
      status: 'Active Scan'
    },
    {
      id: 'IP-MALICIOUS',
      source: 'CrowdStrike Intelligence',
      indicator: 'Host 198.51.100.12 tagged as active SSH brute force agent',
      severity: 'critical',
      timestamp: '30m ago',
      status: 'Blocked'
    },
    {
      id: 'RANSOMWARE-SIG',
      source: 'AlienVault OTX',
      indicator: 'LockBit v4 malware variant file hashes registered in threat vaults',
      severity: 'warning',
      timestamp: '2h ago',
      status: 'Ingested'
    },
    {
      id: 'IOC-DOMAIN',
      source: 'SentinelOne Feed',
      indicator: 'Exfiltration DNS proxy endpoint dga-exfil.xyz blocked',
      severity: 'info',
      timestamp: '4h ago',
      status: 'Blocked'
    }
  ]

  return (
    <Card hoverEffect className="relative overflow-hidden">
      <div>
        <h3 className="text-base font-bold text-white leading-none">Threat Intelligence Feed</h3>
        <p className="text-slate-500 text-xs mt-1">Live ingest of global threat indicators and vulnerability reports.</p>
      </div>

      <div className="mt-6 space-y-4">
        {feeds.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3.5 rounded-xl bg-bg-primary/40 border border-border-custom/50 hover:bg-bg-primary/80 transition duration-200"
          >
            <div className="flex items-center space-x-4 min-w-0">
              <div className={`p-2 rounded-lg bg-bg-secondary border border-border-custom text-slate-400 shrink-0`}>
                {item.id.startsWith('CVE') ? <Fingerprint className="h-4 w-4 text-warning-custom" /> : 
                 item.id.startsWith('IP') ? <WifiOff className="h-4 w-4 text-critical-custom" /> :
                 <Globe className="h-4 w-4 text-info-custom" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-white shrink-0">{item.id}</span>
                  <span className="text-[10px] text-slate-500 font-mono">via {item.source}</span>
                </div>
                <p className="text-xs text-slate-450 truncate mt-1">{item.indicator}</p>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0 pl-2">
              <span className="text-[10px] text-slate-500 font-mono">{item.timestamp}</span>
              <span className="text-[10px] text-accent font-mono mt-1 font-semibold">{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
