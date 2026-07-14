import React, { useState, useEffect, useRef } from 'react'
import { PageShell } from '../ui/PageShell'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import {
  Play,
  Pause,
  RotateCcw,
  Activity,
  Layers,
  Globe,
  Brain,
  Clock,
  Terminal
} from 'lucide-react'

interface SimStep {
  name: string
  tactic: string
  technique: string
  severity: 'critical' | 'warning' | 'info' | 'success'
  description: string
  risk: number
  iocs: {
    ip?: string
    domain?: string
    hash?: string
  }
  aiExplanation: string
}

interface Scenario {
  name: string
  description: string
  complexity: 'Critical' | 'Warning' | 'Info'
  steps: SimStep[]
}

export const AttackSimulatorPage: React.FC = () => {
  // 5 Scenarios Database
  const scenarios: Scenario[] = [
    {
      name: 'Phishing → Credential Theft',
      description: 'Simulates a spearphishing email campaign executing a credential harvesting portal leading to session hijack.',
      complexity: 'Critical',
      steps: [
        {
          name: 'Spearphishing Email Opened',
          tactic: 'Initial Access',
          technique: 'T1566.002',
          severity: 'info',
          description: 'Employee opened high-risk link in a simulated spearphishing campaign email on Workstation-HR-04.',
          risk: 38,
          iocs: { domain: 'secure-office-login.com', ip: '192.0.2.14' },
          aiExplanation: 'AI detects an employee clicked an untrusted external link leading to a mock Microsoft login clone.'
        },
        {
          name: 'Credential Harvesting',
          tactic: 'Credential Access',
          technique: 'T1204.001',
          severity: 'warning',
          description: 'Active Directory login payload entered on lookalike portal. Credentials harvested.',
          risk: 58,
          iocs: { hash: 'f3a9e8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9' },
          aiExplanation: 'User credentials submitted. Active Directory monitoring warns of lookalike authentication requests.'
        },
        {
          name: 'VPN Session Hijack',
          tactic: 'Defense Evasion',
          technique: 'T1078.002',
          severity: 'critical',
          description: 'Adversary generates session token and logs into company VPN from anomalous IP block.',
          risk: 82,
          iocs: { ip: '203.0.113.88' },
          aiExplanation: 'Adversary gains active remote network access via hijacked AD accounts. Quarantine checklist triggered.'
        },
        {
          name: 'Internal Asset Recon',
          tactic: 'Discovery',
          technique: 'T1087.002',
          severity: 'warning',
          description: 'Anomalous LDAP directory queries mapping core postgresql server clusters.',
          risk: 88,
          iocs: { ip: '10.0.4.82' },
          aiExplanation: 'Adversary attempts account and network group discoveries, seeking local database administrator paths.'
        },
        {
          name: 'AD Session Containment',
          tactic: 'Mitigation',
          technique: 'T1562.001',
          severity: 'success',
          description: 'AD session revoked, firewall rule applied. Threat vector fully isolated.',
          risk: 32,
          iocs: {},
          aiExplanation: 'Remediation completed: employee VPN token terminated, attacker subnet blacklisted at gateway level.'
        }
      ]
    },
    {
      name: 'Ransomware Outbreak',
      description: 'Simulates high-speed local file encryption macro payloads attempting shadow copy deletion.',
      complexity: 'Critical',
      steps: [
        {
          name: 'Macro Payload Execution',
          tactic: 'Execution',
          technique: 'T1204.002',
          severity: 'warning',
          description: 'Finance employee runs email attachment spreadsheet, launching hidden powershell macro.',
          risk: 42,
          iocs: { hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
          aiExplanation: 'A malicious macro payload launched on Workstation-Finance-03. Subprocess spawn matches known ransomware loader signatures.'
        },
        {
          name: 'Backup Volume Deletion',
          tactic: 'Defense Evasion',
          technique: 'T1489',
          severity: 'critical',
          description: 'Execution command net stop "Volume Shadow Copy" detected to prevent system restoration.',
          risk: 74,
          iocs: {},
          aiExplanation: 'Ransomware initiates system backup disablement. Host security registry attempts remediation rules block.'
        },
        {
          name: 'Cryptographic Encryption',
          tactic: 'Impact',
          technique: 'T1486',
          severity: 'critical',
          description: 'Mass local file writes detected. Files renamed with .locked extension at 180 actions/sec.',
          risk: 94,
          iocs: { domain: 'ransom-recovery-portal.net' },
          aiExplanation: 'High-frequency encryptions active on local partition. Risk assessment raised to maximum priority.'
        },
        {
          name: 'Automated Port Quarantine',
          tactic: 'Mitigation',
          technique: 'T1486',
          severity: 'success',
          description: 'Workstation-Finance-03 network port isolated, halts further directory spread.',
          risk: 35,
          iocs: {},
          aiExplanation: 'Host isolated from corporate VLAN. Infection contained. Decryption key backup recovery script initiated.'
        }
      ]
    },
    {
      name: 'Gateway SSH Brute Force',
      description: 'Simulates dictionary attack queries on core SSH entry ports targeting administrative users.',
      complexity: 'Warning',
      steps: [
        {
          name: 'Concurrent SSH Scans',
          tactic: 'Credential Access',
          technique: 'T1110.001',
          severity: 'warning',
          description: 'IP 198.51.100.12 scans SSH gateway Port 22 at 80 connections/sec.',
          risk: 45,
          iocs: { ip: '198.51.100.12' },
          aiExplanation: 'Gateway telemetry detects high-volume network scans probing for responsive administrative portals.'
        },
        {
          name: 'Password Guessing Threshold',
          tactic: 'Credential Access',
          technique: 'T1110',
          severity: 'warning',
          description: '150 failed password login queries logged on user account: root.',
          risk: 62,
          iocs: {},
          aiExplanation: 'Password brute force attempts exceeded maximum safety margins. System security policy raises alerts.'
        },
        {
          name: 'Session Connection Established',
          tactic: 'Initial Access',
          technique: 'T1078',
          severity: 'critical',
          description: 'Bruteforce password match succeeds, SSH session spawned on primary postgres server node.',
          risk: 88,
          iocs: { ip: '10.0.4.82' },
          aiExplanation: 'Host database compromised. Threat actor opened SSH connection shell utilizing compromised administrative passwords.'
        },
        {
          name: 'IP Ingress Drop Rule',
          tactic: 'Mitigation',
          technique: 'T1110.001',
          severity: 'success',
          description: 'Attacker IP blocklisted, SSH gateway service pool cycled. Connection severed.',
          risk: 30,
          iocs: {},
          aiExplanation: 'Firewall drop rule applied on CIDR block 198.51.100.0/24. Administrator password rotation cycle forced.'
        }
      ]
    },
    {
      name: 'Insider Data Exfiltration',
      description: 'Simulates database exfiltration executed by compromised internal credentials fetching registry tables.',
      complexity: 'Warning',
      steps: [
        {
          name: 'Anomalous Repo Inquiries',
          tactic: 'Collection',
          technique: 'T1213',
          severity: 'warning',
          description: 'Active database credentials mapping customer registry lists outside standard hours by user Developer-09.',
          risk: 48,
          iocs: { ip: '10.0.12.14' },
          aiExplanation: 'Internal employee user account queries unusually large repository database tables during office off-hours.'
        },
        {
          name: 'Data Zip Archiving',
          tactic: 'Collection',
          technique: 'T1560.001',
          severity: 'warning',
          description: 'Mass ZIP generation: file customer_db_dump.zip packaged on server local drives.',
          risk: 68,
          iocs: { hash: '9b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c' },
          aiExplanation: 'Local zip compression activity executed on parsed database directories. Signature matches exfiltration prep.'
        },
        {
          name: 'HTTPS Cloud Exfiltration',
          tactic: 'Exfiltration',
          technique: 'T1567.002',
          severity: 'critical',
          description: 'Outbound upload stream transferring customer_db_dump.zip to mega-upload-cloud.net (4.2GB sent).',
          risk: 90,
          iocs: { domain: 'mega-upload-cloud.net' },
          aiExplanation: 'High-volume exfiltration connection currently uploading customer profile registers to unverified storage nodes.'
        },
        {
          name: 'AD Ingress Suspension',
          tactic: 'Mitigation',
          technique: 'T1567',
          severity: 'success',
          description: 'Employee AD profile disabled, outbound mega-upload connection dropped at proxy level.',
          risk: 32,
          iocs: {},
          aiExplanation: 'Operator credentials disabled, exfiltration link terminated at firewall proxy filters. Log audits saved.'
        }
      ]
    },
    {
      name: 'Command & Control Beacon',
      description: 'Simulates host beacon channels communicating out using DNS Domain Generation Algorithms.',
      complexity: 'Critical',
      steps: [
        {
          name: 'Web Protocol Inception',
          tactic: 'Command & Control',
          technique: 'T1071.001',
          severity: 'warning',
          description: 'Host Workstation-Ops-09 registers anomalous HTTP beacon pings to external base c2-controller-base.org.',
          risk: 46,
          iocs: { domain: 'c2-controller-base.org' },
          aiExplanation: 'System telemetry records recurring outbound web packets aligning with adversary C2 beacon signals.'
        },
        {
          name: 'DNS DGA Tunnel Active',
          tactic: 'Command & Control',
          technique: 'T1071.004',
          severity: 'critical',
          description: 'High-entropy subdomain queries matching domain generation algorithms (dga-exfil.xyz).',
          risk: 76,
          iocs: { domain: 'dga-exfil.xyz' },
          aiExplanation: 'DNS query entropy spikes. Adversary utilizing DNS tunneling to bypass proxy filter blocks.'
        },
        {
          name: 'Payload Command Execution',
          tactic: 'Execution',
          technique: 'T1059',
          severity: 'critical',
          description: 'Base64 encoded interactive shell commands downloaded and executed by command line.',
          risk: 86,
          iocs: { hash: '3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f' },
          aiExplanation: 'Attacker executes script inputs locally. Active host remote shells must be contained immediately.'
        },
        {
          name: 'Domain DNS Sinkhole',
          tactic: 'Mitigation',
          technique: 'T1071',
          severity: 'success',
          description: 'DNS sinkhole rule applied to DGA domain vectors, host quarantined.',
          risk: 32,
          iocs: {},
          aiExplanation: 'Adversary beacons sinkholed at router level. Compromised host fully contained from server subnets.'
        }
      ]
    }
  ]

  // Simulator State Machine
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1) // -1 means simulation hasn't started yet
  const [speed, setSpeed] = useState<1 | 2 | 4>(1)

  const activeScenario = scenarios[activeScenarioIdx]
  const isFinished = currentStep >= activeScenario.steps.length - 1

  // Dynamic simulation timer hook
  const intervalRef = useRef<any>(null)

  useEffect(() => {
    if (isPlaying) {
      const duration = 3000 / speed
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < activeScenario.steps.length - 1) {
            return prev + 1
          } else {
            setIsPlaying(false)
            if (intervalRef.current) clearInterval(intervalRef.current)
            return prev
          }
        })
      }, duration)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, speed, activeScenarioIdx, activeScenario.steps.length])

  const handleSelectScenario = (idx: number) => {
    setIsPlaying(false)
    setActiveScenarioIdx(idx)
    setCurrentStep(-1)
  }

  const handlePlay = () => {
    if (isFinished) {
      setCurrentStep(0)
    } else if (currentStep === -1) {
      setCurrentStep(0)
    }
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStep(-1)
  }

  // Derived current metrics
  const activeStepDetail = currentStep >= 0 ? activeScenario.steps[currentStep] : null
  const currentRiskScore = activeStepDetail ? activeStepDetail.risk : 30
  
  // History timeline built from starting up to currentStep
  const timelineEvents = currentStep >= 0 
    ? activeScenario.steps.slice(0, currentStep + 1).map((s, idx) => ({
        timestamp: `10:48:${30 + idx * 5}`,
        name: s.name,
        tactic: s.tactic,
        technique: s.technique,
        severity: s.severity,
        description: s.description
      })).reverse()
    : []

  // All IOCs generated up to currentStep
  const timelineIocs = currentStep >= 0
    ? activeScenario.steps.slice(0, currentStep + 1).reduce((acc: { type: string; value: string }[], step) => {
        if (step.iocs.ip) acc.push({ type: 'Host IP', value: step.iocs.ip })
        if (step.iocs.domain) acc.push({ type: 'C2 Domain', value: step.iocs.domain })
        if (step.iocs.hash) acc.push({ type: 'Payload Hash', value: step.iocs.hash })
        return acc
      }, []).reverse()
    : []

  // MITRE technique list to map inside the UI panel
  const allMitreCodes = [
    { code: 'T1566.002', name: 'Spearphishing Link', tactic: 'Initial Access' },
    { code: 'T1204.001', name: 'User Execution: Link', tactic: 'Credential Access' },
    { code: 'T1204.002', name: 'User Execution: File', tactic: 'Execution' },
    { code: 'T1078', name: 'Valid Accounts', tactic: 'Initial Access' },
    { code: 'T1078.002', name: 'Domain Accounts', tactic: 'Defense Evasion' },
    { code: 'T1087.002', name: 'Account Discovery', tactic: 'Discovery' },
    { code: 'T1562.001', name: 'Impair Defenses', tactic: 'Mitigation' },
    { code: 'T1489', name: 'Service Stop', tactic: 'Defense Evasion' },
    { code: 'T1486', name: 'Data Encrypted', tactic: 'Impact' },
    { code: 'T1110.001', name: 'Brute Force SSH', tactic: 'Credential Access' },
    { code: 'T1110', name: 'Brute Force', tactic: 'Credential Access' },
    { code: 'T1213', name: 'Info Repositories', tactic: 'Collection' },
    { code: 'T1560.001', name: 'Archive via Utility', tactic: 'Collection' },
    { code: 'T1567.002', name: 'Exfil to Cloud', tactic: 'Exfiltration' },
    { code: 'T1071.001', name: 'Web Protocols', tactic: 'Command & Control' },
    { code: 'T1071.004', name: 'DNS Tunneling', tactic: 'Command & Control' },
    { code: 'T1059', name: 'Scripting Interpreter', tactic: 'Execution' }
  ]

  // Severity colors helper
  const severityBadgeColor = (sev: string) => {
    switch (sev) {
      case 'critical': return 'critical'
      case 'warning': return 'warning'
      case 'info': return 'info'
      case 'success': return 'success'
      default: return 'default'
    }
  }

  return (
    <PageShell
      title="Attack Simulator & Threat Ingestion"
      description="Inject active adversary telemetry vectors client-side. Validate detection coverage thresholds, firewall mitigations, and AI response auditing."
      breadcrumbs={['Automation', 'Attack Simulator']}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Scenario Library, Control Panel, IOC list */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Scenario Selector */}
          <Card className="relative overflow-hidden">
            <div className="flex items-center space-x-2.5 mb-4">
              <Layers className="h-5 w-5 text-accent animate-pulse" />
              <h3 className="text-sm font-bold text-white leading-none">Scenario Library</h3>
            </div>
            
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {scenarios.map((sc, idx) => {
                const isSelected = activeScenarioIdx === idx
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectScenario(idx)}
                    className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      isSelected 
                        ? 'bg-accent/10 border-accent/20 shadow-md shadow-accent/5' 
                        : 'bg-bg-primary/20 border-border-custom hover:bg-bg-primary/45 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h4 className={`text-xs font-bold ${isSelected ? 'text-white font-extrabold' : 'text-slate-350'}`}>
                        {sc.name}
                      </h4>
                      <Badge variant={sc.complexity === 'Critical' ? 'critical' : 'warning'} size="sm">
                        {sc.complexity}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-snug line-clamp-2">{sc.description}</p>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Control Panel */}
          <Card className="border-accent/15 cyber-glow-accent">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono font-semibold text-slate-400">SIMULATION CONTROLS</h3>
              {isPlaying && (
                <span className="text-[10px] font-mono text-accent flex items-center space-x-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
                  <span>Running ({speed}x)</span>
                </span>
              )}
            </div>

            {/* Main Buttons */}
            <div className="flex items-center space-x-3.5 mb-5">
              {!isPlaying ? (
                <Button
                  variant="primary"
                  onClick={handlePlay}
                  className="flex-1 font-mono text-xs flex items-center justify-center space-x-1.5"
                >
                  <Play className="h-4 w-4" />
                  <span>Play</span>
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={handlePause}
                  className="flex-1 font-mono text-xs flex items-center justify-center space-x-1.5 border border-warning-custom/30 text-warning-custom hover:bg-warning-custom/5"
                >
                  <Pause className="h-4 w-4" />
                  <span>Pause</span>
                </Button>
              )}
              
              <Button
                variant="secondary"
                onClick={handleReset}
                className="font-mono text-xs flex items-center justify-center space-x-1.5 border border-border-custom hover:border-slate-650"
              >
                <RotateCcw className="h-4 w-4 text-slate-400" />
                <span>Reset</span>
              </Button>
            </div>

            {/* Speed Multipliers */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-bg-primary/50 border border-border-custom text-xs font-mono">
              <span className="text-slate-450">Simulation Speed:</span>
              <div className="flex space-x-1 bg-bg-secondary p-1 rounded-lg border border-border-custom">
                {([1, 2, 4] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded cursor-pointer transition ${
                      speed === s 
                        ? 'bg-accent text-[#0B1020]' 
                        : 'text-slate-500 hover:text-slate-200'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Ingestion Progress bar */}
            {currentStep >= 0 && (
              <div className="mt-5 space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>Progress: {currentStep + 1} / {activeScenario.steps.length} Steps</span>
                  <span>{Math.round(((currentStep + 1) / activeScenario.steps.length) * 100)}%</span>
                </div>
                <div className="h-1.5 w-full bg-bg-primary rounded-full overflow-hidden border border-border-custom">
                  <div 
                    className="h-full bg-accent transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / activeScenario.steps.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </Card>

          {/* IOC Panel */}
          <Card>
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="h-5 w-5 text-warning-custom" />
              <h3 className="text-sm font-bold text-white">Ingested IOC Matches</h3>
            </div>

            <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
              {timelineIocs.length === 0 ? (
                <div className="text-center py-8 text-slate-550 text-xs font-mono">
                  No active threat signatures matched. Start simulation.
                </div>
              ) : (
                timelineIocs.map((ioc, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-bg-primary/45 border border-border-custom/50 rounded-xl hover:border-slate-700 transition"
                  >
                    <span className="text-[9px] font-mono text-accent uppercase font-bold block">
                      {ioc.type}
                    </span>
                    <span className="text-[11px] font-mono text-slate-300 truncate block mt-0.5 max-w-[280px]">
                      {ioc.value}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>

        </div>

        {/* RIGHT COLUMN: Gauges, AI brief, Timeline, MITRE panel */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Risk Gauge Widget */}
            <Card className="flex flex-col justify-between items-center text-center p-6 border-warning-custom/15">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">ORGANIZATION RISK</span>
              
              <div className="relative flex items-center justify-center my-4 h-28 w-28 rounded-full border-4 border-border-custom">
                {/* Dynamic radial glow */}
                <div className={`absolute inset-0 rounded-full blur-md opacity-20 ${
                  currentRiskScore > 75 ? 'bg-critical-custom' : currentRiskScore > 50 ? 'bg-warning-custom' : 'bg-success-custom'
                }`} />
                <div className="flex flex-col items-center">
                  <span className={`text-3xl font-extrabold tracking-tight ${
                    currentRiskScore > 75 ? 'text-critical-custom' : currentRiskScore > 50 ? 'text-warning-custom' : 'text-success-custom'
                  }`}>
                    {currentRiskScore}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">Telemetry Rating</span>
                </div>
              </div>

              <Badge variant={currentRiskScore > 75 ? 'critical' : currentRiskScore > 50 ? 'warning' : 'success'} size="sm">
                {currentRiskScore > 75 ? 'CRITICAL RISK' : currentRiskScore > 50 ? 'MEDIUM RISK' : 'STABLE NODE'}
              </Badge>
            </Card>

            {/* AI Analyst Advisor Panel */}
            <Card className="md:col-span-2 flex flex-col justify-between border-accent/20 bg-accent/5">
              <div className="flex items-center justify-between mb-3 shrink-0">
                <div className="flex items-center space-x-2">
                  <Brain className="h-4.5 w-4.5 text-accent animate-pulse" />
                  <span className="text-xs font-bold text-white">AI Analyst Cognitive Brief</span>
                </div>
                <span className="text-[9px] font-mono text-slate-500">Session ID: AI-SIM-OP4</span>
              </div>

              <div className="flex-1 p-3.5 rounded-xl bg-bg-primary/45 border border-border-custom/50 text-xs text-slate-350 leading-relaxed font-sans min-h-[100px] flex items-center justify-center">
                {activeStepDetail ? (
                  <p>{activeStepDetail.aiExplanation}</p>
                ) : (
                  <p className="text-slate-550 font-mono text-center">
                    Simulator idle. Start playback scenario to activate cognitive vulnerability monitoring.
                  </p>
                )}
              </div>
            </Card>

          </div>

          {/* MITRE ATT&CK Matrix Panel */}
          <Card>
            <div className="flex items-center space-x-2.5 mb-4">
              <Layers className="h-5 w-5 text-accent" />
              <h3 className="text-sm font-bold text-white">MITRE Technique Heatmap</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 mt-4">
              {allMitreCodes.map((m) => {
                const isActive = activeStepDetail?.technique === m.code
                const borderColors = isActive
                  ? 'border-accent bg-accent/15 shadow-sm shadow-accent/10 scale-102 font-bold text-accent'
                  : 'border-border-custom bg-bg-primary/20 hover:border-slate-700 text-slate-400'

                return (
                  <div
                    key={m.code}
                    className={`p-3 rounded-xl border text-center flex flex-col justify-between transition-all duration-300 min-h-[90px] ${borderColors}`}
                  >
                    <span className="text-[10px] font-mono block text-slate-500 uppercase">{m.tactic}</span>
                    <span className="text-xs font-mono font-extrabold mt-1 block truncate">{m.code}</span>
                    <span className="text-[9px] text-slate-400 block truncate mt-1 leading-snug">{m.name}</span>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Live Event Timeline */}
          <Card className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-slate-450" />
                <h3 className="text-sm font-bold text-white">Live Event Timeline</h3>
              </div>
              {timelineEvents.length > 0 && (
                <span className="text-[10px] font-mono text-slate-500">{timelineEvents.length} Logs recorded</span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto max-h-[300px] pr-1 space-y-4 custom-scrollbar min-h-[140px] flex flex-col justify-start">
              {timelineEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-slate-600 font-mono text-xs text-center flex-1">
                  <Terminal className="h-5 w-5 mb-2 text-slate-700" />
                  <span>No events captured. Click play to inject telemetry.</span>
                </div>
              ) : (
                timelineEvents.map((evt, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-4 p-3.5 rounded-xl bg-bg-primary/45 border border-border-custom/50 hover:bg-bg-primary/80 transition duration-150 animate-fadeIn"
                  >
                    <div className={`p-2 rounded-lg bg-bg-secondary border border-border-custom text-slate-400 mt-0.5 shrink-0`}>
                      <Activity className={`h-4 w-4 ${
                        evt.severity === 'critical' ? 'text-critical-custom' : 
                        evt.severity === 'warning' ? 'text-warning-custom' : 
                        evt.severity === 'info' ? 'text-info-custom' : 
                        'text-success-custom'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-white">{evt.name}</span>
                          <span className="text-[10px] font-mono text-accent font-semibold">{evt.technique}</span>
                        </div>
                        <div className="flex items-center space-x-2 shrink-0">
                          <Badge variant={severityBadgeColor(evt.severity)} size="sm">{evt.severity}</Badge>
                          <span className="text-[10px] font-mono text-slate-550">{evt.timestamp}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-450 leading-relaxed">{evt.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

        </div>

      </div>
    </PageShell>
  )
}
