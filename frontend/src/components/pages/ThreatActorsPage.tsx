import React, { useState } from 'react'
import { PageShell } from '../ui/PageShell'
import { Card } from '../ui/Card'
import { Users, ShieldAlert } from 'lucide-react'

export const ThreatActorsPage: React.FC = () => {
  const [selectedActor, setSelectedActor] = useState<string | null>(null)

  const actors = [
    {
      id: 'APT-29',
      name: 'Cozy Bear / Nobelium',
      origin: 'State-Sponsored (Russia)',
      targeting: 'Government, Think-Tanks, IT Providers',
      tools: ['SUNBURST', 'TEARDROP', 'CozyCar'],
      activeCampaign: 'Spearphishing vectors targeting AD cloud endpoints.'
    },
    {
      id: 'APT-34',
      name: 'Helix Kitten / OilRig',
      origin: 'State-Sponsored (Middle East)',
      targeting: 'Aviation, Financial Services, Gov',
      tools: ['WebShells', 'Karkoff', 'RGard'],
      activeCampaign: 'Credential scavenging campaigns against VPN gateways.'
    },
    {
      id: 'Lazarus Group',
      name: 'Guardians of Peace',
      origin: 'State-Sponsored (North Korea)',
      targeting: 'Cryptocurrency, Defense, Retail',
      tools: ['NukeSped', 'Manuscrypt', 'Hermit'],
      activeCampaign: 'Trojanized crypto apps lateral ingress simulation.'
    }
  ]

  return (
    <PageShell
      title="Threat Actors"
      description="Access dossiers, signature histories, and command-and-control (C2) patterns mapped to known Advanced Persistent Threats (APT)."
      breadcrumbs={['Subnets', 'Threat Actors']}
      emptyState={
        !selectedActor
          ? {
              title: 'No actor details inspected',
              description: 'Select an adversary profile card below to view detailed operational intel and signature indicators.',
              actionText: 'Inspect APT-29 cozy bear profile',
              onAction: () => setSelectedActor('APT-29')
            }
          : undefined
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actors.map((act) => (
          <Card
            key={act.id}
            hoverEffect
            className={`cursor-pointer transition-all duration-300 flex flex-col justify-between min-h-[220px] ${
              selectedActor === act.id ? 'border-accent bg-accent/5' : 'border-border-custom'
            }`}
            onClick={() => setSelectedActor(act.id)}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-accent font-semibold">{act.id}</span>
                <span className="text-[10px] text-slate-500 font-mono">{act.origin}</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{act.name}</h3>
              <p className="text-slate-400 text-xs line-clamp-2">Targeting: {act.targeting}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-border-custom/50 flex flex-wrap gap-1.5">
              {act.tools.map((tool, idx) => (
                <span key={idx} className="text-[9px] font-mono px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">
                  {tool}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {selectedActor && (
        <Card className="p-6 border border-accent/30 bg-accent/5 space-y-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-accent" />
            <h3 className="text-sm font-bold text-white">Active Dossier Intelligence: {selectedActor}</h3>
          </div>
          
          {actors.filter((a) => a.id === selectedActor).map((act) => (
            <div key={act.id} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
              <div className="space-y-2">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-mono">Primary Target Vector</span>
                  <p className="text-white font-medium mt-0.5">{act.targeting}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-mono">Known Malware Loadouts</span>
                  <p className="text-white font-medium mt-0.5">{act.tools.join(', ')}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-mono">Ongoing Cyber Campaigns</span>
                  <p className="text-slate-350 mt-0.5">{act.activeCampaign}</p>
                </div>
                <div className="flex items-center space-x-1.5 text-warning-custom text-[11px] font-mono">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Recommend blocking AD ingress ports matching Cozy Bear signatures.</span>
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}
    </PageShell>
  )
}
