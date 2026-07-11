import React from 'react'
import { Card } from './Card'
import { Brain, Sparkles, ShieldAlert, Cpu } from 'lucide-react'

export const AiAnalystSummary: React.FC = () => {
  return (
    <Card hoverEffect className="relative overflow-hidden border-accent/25 cyber-glow-accent">
      {/* Background radial glow */}
      <div className="absolute right-[-40px] top-[-40px] h-32 w-32 bg-accent/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
            <Brain className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white leading-none">AI Analyst Cognitive Summary</h3>
            <p className="text-slate-500 text-xs mt-1">Autonomous correlation report on active subnet vulnerabilities.</p>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-accent/10 border border-accent/25 text-[10px] font-mono text-accent">
          <Sparkles className="h-3 w-3" />
          <span>Cognitive Engine v2.4</span>
        </div>
      </div>

      <div className="mt-4 p-4 rounded-xl bg-bg-primary/40 border border-border-custom/50 space-y-4">
        <div className="flex items-start space-x-3">
          <div className="mt-0.5 text-accent shrink-0">
            <Cpu className="h-4 w-4 animate-spin-slow" />
          </div>
          <p className="text-xs text-slate-350 leading-relaxed">
            I have analyzed <strong className="text-white">5 active anomaly logs</strong> and identified a correlated multi-stage threat vector. 
            An adversary brute force SSH authentication scan is actively probing <span className="font-mono text-white bg-slate-800 px-1 rounded text-[11px]">10.0.4.82 (DB-Node)</span>. 
            This traffic correlates directly with a malicious payload execution on <span className="font-mono text-white bg-slate-800 px-1 rounded text-[11px]">Workstation-HR-04</span>.
          </p>
        </div>

        <div className="border-t border-border-custom/40 pt-4 space-y-2">
          <h4 className="text-xs font-mono text-slate-400 flex items-center">
            <ShieldAlert className="h-3.5 w-3.5 text-warning-custom mr-2" />
            RECOMMENDED IR PLAYBOOKS:
          </h4>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-5">
            <li>
              Apply immediate ingress drop rules for IPv4 range <strong className="text-white">198.51.100.0/24</strong> at firewall.
            </li>
            <li>
              Trigger workstation quarantine playbook for <strong className="text-white">Workstation-HR-04</strong> to halt lateral escalation.
            </li>
            <li>
              Initiate directory credential revocation and AD password vault rotation for compromised service accounts.
            </li>
          </ul>
        </div>
      </div>
    </Card>
  )
}
