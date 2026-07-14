import React from 'react'
import { Card } from './Card'
import { Brain, Sparkles, ShieldAlert, Cpu } from 'lucide-react'

export const AiAnalystSummary: React.FC = () => {
  return (
    <Card hoverEffect className="relative overflow-hidden border-accent/20 bg-[#12182A]/90 rounded-2xl p-6 h-full flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.3)] cyber-glow-accent glass-panel">
      {/* Background radial glow */}
      <div className="absolute right-[-40px] top-[-40px] h-32 w-32 bg-accent/5 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-3">
            <div className="h-8.5 w-8.5 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent shadow-sm">
              <Brain className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-none">AI Analyst Cognitive Summary</h3>
              <p className="text-slate-500 text-xs mt-1">Autonomous correlation report on active subnet vulnerabilities.</p>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/25 text-[9px] font-mono font-semibold text-accent select-none">
            <Sparkles className="h-3 w-3" />
            <span>Cognitive Engine v2.4</span>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-[#0A0F1F]/40 border border-border-custom/60 space-y-4">
          <div className="flex items-start space-x-3.5">
            <div className="mt-0.5 text-accent shrink-0">
              <Cpu className="h-4.5 w-4.5 animate-spin-slow text-accent" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              I have analyzed <strong className="text-white font-semibold">5 active anomaly logs</strong> and identified a correlated multi-stage threat vector. 
              An adversary brute force SSH authentication scan is actively probing <span className="font-mono text-accent bg-[#12182A] border border-border-custom/50 px-1.5 py-0.5 rounded text-[10px]">10.0.4.82 (DB-Node)</span>. 
              This traffic correlates directly with a malicious payload execution on <span className="font-mono text-accent bg-[#12182A] border border-border-custom/50 px-1.5 py-0.5 rounded text-[10px]">Workstation-HR-04</span>.
            </p>
          </div>

          <div className="border-t border-border-custom/40 pt-4 space-y-3">
            <h4 className="text-[10px] font-bold font-mono text-slate-400 tracking-wider flex items-center">
              <ShieldAlert className="h-3.5 w-3.5 text-warning-custom mr-2 shrink-0" />
              RECOMMENDED IR PLAYBOOKS:
            </h4>
            <ul className="text-xs text-slate-400 space-y-2 list-none pl-0">
              <li className="flex items-start space-x-2">
                <span className="text-[#00C2FF] font-bold select-none mt-0.5">•</span>
                <span>Apply immediate ingress drop rules for IPv4 range <strong className="text-slate-200">198.51.100.0/24</strong> at firewall.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#00C2FF] font-bold select-none mt-0.5">•</span>
                <span>Trigger workstation quarantine playbook for <strong className="text-slate-200">Workstation-HR-04</strong> to halt lateral escalation.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#00C2FF] font-bold select-none mt-0.5">•</span>
                <span>Initiate directory credential revocation and AD password vault rotation for compromised service accounts.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  )
}
