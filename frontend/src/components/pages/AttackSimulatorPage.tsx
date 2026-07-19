import React, { useState, useEffect } from 'react'
import { PageShell } from '../ui/PageShell'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Modal } from '../ui/Modal'
import { useUIStore } from '../../store/uiStore'
import { apiRequest } from '../../utils/api'
import {
  Play,
  Activity,
  Layers,
  Globe,
  Brain,
  Clock,
  Terminal,
  Trash2,
  Eye,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'

interface Stage {
  stage_number: number
  title: string
  description: string
  severity: string
  mitre_technique: string
  incident_category: string
  create_incident: boolean
  source_ip?: string
  destination_ip?: string
  remediation?: string
}

interface Scenario {
  name: string
  description: string
  estimated_duration: number
  delay_between_stages: number
  difficulty: 'Low' | 'Medium' | 'High' | 'Critical'
  recommended_role: string
  risk_change: number
  primary_mitre_techniques: string[]
  stages: Stage[]
}

const fallbackScenarios: Scenario[] = [
  {
    name: "SSH Brute Force",
    description: "Simulates brute force authentication attempts on SSH gateway servers.",
    estimated_duration: 6,
    delay_between_stages: 2,
    difficulty: "Medium",
    recommended_role: "SOC Analyst",
    risk_change: 40,
    primary_mitre_techniques: ["T1595.001", "T1110.001", "T1078.002"],
    stages: []
  },
  {
    name: "Phishing Campaign",
    description: "Simulates spearphishing link executions leading to harvested user credentials.",
    estimated_duration: 6,
    delay_between_stages: 2,
    difficulty: "Medium",
    recommended_role: "SOC Analyst",
    risk_change: 30,
    primary_mitre_techniques: ["T1566.001", "T1204.001", "T1566.002"],
    stages: []
  },
  {
    name: "PowerShell Execution",
    description: "Simulates local PowerShell shell execution pulling downstream payloads.",
    estimated_duration: 6,
    delay_between_stages: 2,
    difficulty: "High",
    recommended_role: "Threat Hunter",
    risk_change: 35,
    primary_mitre_techniques: ["T1059.001", "T1105"],
    stages: []
  },
  {
    name: "Credential Dumping",
    description: "Simulates memory access scans targeting local Windows credential stores.",
    estimated_duration: 6,
    delay_between_stages: 2,
    difficulty: "Critical",
    recommended_role: "Threat Hunter",
    risk_change: 50,
    primary_mitre_techniques: ["T1003.001", "T1003.002"],
    stages: []
  },
  {
    name: "DNS Tunneling",
    description: "Simulates command-and-control beacon tunnels routing data inside raw DNS query TXT formats.",
    estimated_duration: 6,
    delay_between_stages: 2,
    difficulty: "Critical",
    recommended_role: "Threat Hunter",
    risk_change: 45,
    primary_mitre_techniques: ["T1071.004", "T1071"],
    stages: []
  },
  {
    name: "Lateral Movement",
    description: "Simulates administrative remote shares query attempts moving between core database nodes.",
    estimated_duration: 6,
    delay_between_stages: 2,
    difficulty: "High",
    recommended_role: "SOC Analyst",
    risk_change: 40,
    primary_mitre_techniques: ["T1021.002", "T1021.001"],
    stages: []
  },
  {
    name: "Privilege Escalation",
    description: "Simulates security context elevation attempts targeting local system context accounts.",
    estimated_duration: 6,
    delay_between_stages: 2,
    difficulty: "High",
    recommended_role: "Threat Hunter",
    risk_change: 45,
    primary_mitre_techniques: ["T1134", "T1134.001"],
    stages: []
  },
  {
    name: "Ransomware Activity",
    description: "Simulates system volume shadow copy overrides and high-speed local partition locking plays.",
    estimated_duration: 6,
    delay_between_stages: 2,
    difficulty: "Critical",
    recommended_role: "SOC Analyst",
    risk_change: 55,
    primary_mitre_techniques: ["T1489", "T1486"],
    stages: []
  }
]

export const AttackSimulatorPage: React.FC = () => {
  // State Machine
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0)
  const [history, setHistory] = useState<any[]>([])
  const [activeSimulation, setActiveSimulation] = useState<any | null>(null)
  const [activeEvents, setActiveEvents] = useState<any[]>([])
  const [selectedHistorySim, setSelectedHistorySim] = useState<any | null>(null)
  const [historyEvents, setHistoryEvents] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  // Load scenarios and history on mount
  useEffect(() => {
    fetchScenarios()
    fetchHistory()
  }, [])

  // Poll active simulation progress
  useEffect(() => {
    let pollInterval: any = null
    
    if (activeSimulation && (activeSimulation.status === 'Pending' || activeSimulation.status === 'Running')) {
      pollInterval = setInterval(async () => {
        try {
          const sim = await apiRequest(`/simulations/${activeSimulation.id}`)
          const events = await apiRequest(`/simulations/${activeSimulation.id}/events`)
          
          setActiveSimulation(sim)
          setActiveEvents(events)
          
          if (sim.status === 'Completed' || sim.status === 'Failed') {
            clearInterval(pollInterval)
            fetchHistory()
            // Refresh dashboard metrics
            useUIStore.getState().fetchDashboardSummary()
            useUIStore.getState().fetchRecentIncidents()
            useUIStore.getState().fetchIncidents()
          }
        } catch (err: any) {
          console.error("Error polling active simulation:", err)
        }
      }, 2000)
    }
    
    return () => {
      if (pollInterval) clearInterval(pollInterval)
    }
  }, [activeSimulation])

  // Track elapsed time during running simulation
  useEffect(() => {
    let timer: any = null
    if (activeSimulation && activeSimulation.status === 'Running') {
      const start = new Date(activeSimulation.started_at).getTime()
      timer = setInterval(() => {
        const now = Date.now()
        setElapsedTime(Math.round((now - start) / 1000))
      }, 1000)
    } else {
      setElapsedTime(0)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [activeSimulation])

  const fetchScenarios = async () => {
    try {
      const data = await apiRequest('/simulations/scenarios')
      setScenarios(data)
    } catch (err: any) {
      console.warn("Failed to fetch scenarios from API, using fallback scenarios", err)
      setScenarios(fallbackScenarios)
    }
  }

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const data = await apiRequest('/simulations')
      setHistory(data)
      
      // Check if there is an active simulation running in background
      const active = data.find((sim: any) => sim.status === 'Running' || sim.status === 'Pending')
      if (active) {
        setActiveSimulation(active)
        // Fetch its events
        const events = await apiRequest(`/simulations/${active.id}/events`)
        setActiveEvents(events)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load simulation history')
    } finally {
      setLoading(false)
    }
  }

  const handleRunSimulation = async (scenarioName: string) => {
    setError(null)
    try {
      const res = await apiRequest('/simulations/run', {
        method: 'POST',
        body: JSON.stringify({ scenario_name: scenarioName })
      })
      setActiveSimulation(res)
      setActiveEvents([])
      setElapsedTime(0)
    } catch (err: any) {
      setError(err.message || 'Another simulation may be running.')
    }
  }

  const handleDeleteSimulation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.confirm("Are you sure you want to delete this simulation?")) return
    try {
      await apiRequest(`/simulations/${id}`, {
        method: 'DELETE'
      })
      setHistory(prev => prev.filter(sim => sim.id !== id))
      if (activeSimulation && activeSimulation.id === id) {
        setActiveSimulation(null)
        setActiveEvents([])
      }
      useUIStore.getState().fetchDashboardSummary()
    } catch (err: any) {
      alert("Failed to delete simulation: " + err.message)
    }
  }

  const handleViewTimeline = async (sim: any) => {
    setSelectedHistorySim(sim)
    try {
      const events = await apiRequest(`/simulations/${sim.id}/events`)
      setHistoryEvents(events)
      setIsModalOpen(true)
    } catch (err: any) {
      alert("Failed to fetch timeline: " + err.message)
    }
  }

  const activeScenario = scenarios[activeScenarioIdx]

  // Derived current metrics for active or selected views
  const isSimulating = activeSimulation && (activeSimulation.status === 'Pending' || activeSimulation.status === 'Running')
  const simulationProgress = isSimulating ? activeSimulation : null
  const currentRiskScore = simulationProgress ? simulationProgress.overall_risk : 32
  
  // Stages calculations
  const currentScenarioDetails = scenarios.find(s => s.name === activeSimulation?.name) || activeScenario
  const totalStages = currentScenarioDetails?.stages?.length || 3
  const completedStages = activeEvents.length
  const progressPercent = Math.min(100, Math.round((completedStages / totalStages) * 100))

  const activeStepDetail = activeEvents.length > 0 ? activeEvents[activeEvents.length - 1] : null
  const estimatedDuration = currentScenarioDetails?.estimated_duration || 6
  const remainingTime = Math.max(0, estimatedDuration - elapsedTime)

  // MITRE technique list to map inside the UI panel
  const allMitreCodes = [
    { code: 'T1595.001', name: 'Active Scanning', tactic: 'Reconnaissance' },
    { code: 'T1110.001', name: 'Password Guessing', tactic: 'Credential Access' },
    { code: 'T1078.002', name: 'Domain Accounts', tactic: 'Defense Evasion' },
    { code: 'T1566.001', name: 'Spearphishing Attachment', tactic: 'Initial Access' },
    { code: 'T1204.001', name: 'User Execution: Link', tactic: 'Execution' },
    { code: 'T1566.002', name: 'Spearphishing Link', tactic: 'Initial Access' },
    { code: 'T1059.001', name: 'PowerShell Interpreter', tactic: 'Execution' },
    { code: 'T1105', name: 'Ingress Tool Transfer', tactic: 'Command & Control' },
    { code: 'T1003.001', name: 'LSASS Memory Dump', tactic: 'Credential Access' },
    { code: 'T1003.002', name: 'Security Registry Dump', tactic: 'Credential Access' },
    { code: 'T1071.004', name: 'DNS Tunneling Protocol', tactic: 'Command & Control' },
    { code: 'T1071', name: 'Application Protocol', tactic: 'Command & Control' },
    { code: 'T1021.002', name: 'SMB Remote Share Access', tactic: 'Lateral Movement' },
    { code: 'T1021.001', name: 'Remote Desktop Protocol', tactic: 'Lateral Movement' },
    { code: 'T1134', name: 'Access Token Manipulation', tactic: 'Privilege Escalation' },
    { code: 'T1134.001', name: 'Token Manipulation Injection', tactic: 'Privilege Escalation' },
    { code: 'T1489', name: 'Stop Service shadow volume', tactic: 'Defense Evasion' },
    { code: 'T1486', name: 'Cryptographic Encryption', tactic: 'Impact' }
  ]

  // Severity colors helper
  const severityBadgeColor = (sev: string) => {
    const s = sev.toLowerCase()
    if (s === 'critical') return 'critical'
    if (s === 'high' || s === 'warning') return 'warning'
    if (s === 'medium') return 'info'
    return 'default'
  }

  return (
    <PageShell
      title="Attack Simulator & Training Engine"
      description="Launch educational, non-malicious simulations to validate detection coverage thresholds, firewall mitigations, and incident containment."
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
                    key={sc.name}
                    onClick={() => !isSimulating && setActiveScenarioIdx(idx)}
                    className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      isSimulating 
                        ? 'opacity-65 cursor-not-allowed border-border-custom bg-bg-primary/10'
                        : isSelected 
                        ? 'bg-accent/10 border-accent/20 shadow-md shadow-accent/5' 
                        : 'bg-bg-primary/20 border-border-custom hover:bg-bg-primary/45 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h4 className={`text-xs font-bold ${isSelected && !isSimulating ? 'text-white font-extrabold' : 'text-slate-350'}`}>
                        {sc.name}
                      </h4>
                      <Badge variant={sc.difficulty === 'Critical' ? 'critical' : sc.difficulty === 'High' ? 'warning' : 'info'} size="sm">
                        {sc.difficulty}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-snug line-clamp-2">{sc.description}</p>
                    
                    <div className="flex items-center justify-between mt-2 text-[9px] font-mono text-slate-400">
                      <span>Est. Duration: {sc.estimated_duration}s</span>
                      <span>Risk Change: +{sc.risk_change}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Control Panel */}
          <Card className="border-accent/15 cyber-glow-accent">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono font-semibold text-slate-400">SIMULATION CONTROLS</h3>
              {isSimulating ? (
                <span className="text-[10px] font-mono text-accent flex items-center space-x-1">
                  <RefreshCw className="h-3 w-3 animate-spin mr-1 text-accent" />
                  <span>{activeSimulation.status === 'Pending' ? 'Pending...' : 'Running'}</span>
                </span>
              ) : (
                <span className="text-[10px] font-mono text-slate-500">IDLE</span>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-950/40 border border-red-500/25 rounded-xl text-[10px] font-mono text-red-400 flex items-start space-x-1.5">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Launch Simulation */}
            <div className="flex items-center space-x-3.5 mb-5">
              <Button
                variant="primary"
                onClick={() => handleRunSimulation(activeScenario.name)}
                disabled={isSimulating || loading || scenarios.length === 0}
                className="flex-1 font-mono text-xs flex items-center justify-center space-x-1.5"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Run {activeScenario?.name || 'Simulation'}</span>
              </Button>
            </div>

            {/* Progress Bar (Visible while simulating) */}
            {isSimulating && (
              <div className="mt-5 space-y-3 p-3 bg-bg-primary/30 border border-border-custom rounded-xl font-mono">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Stages: {completedStages} / {totalStages}</span>
                  <span>{progressPercent}%</span>
                </div>
                
                <div className="h-1.5 w-full bg-bg-primary rounded-full overflow-hidden border border-border-custom">
                  <div 
                    className="h-full bg-accent transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-border-custom/50 text-[10px] text-slate-500">
                  <div>
                    <span className="block text-[8px] text-slate-600 uppercase">Elapsed Time</span>
                    <span className="font-bold text-white text-xs">{elapsedTime}s</span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-slate-600 uppercase">Est. Remaining</span>
                    <span className="font-bold text-accent text-xs">{remainingTime}s</span>
                  </div>
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
              {!isSimulating || activeEvents.length === 0 ? (
                <div className="text-center py-8 text-slate-550 text-xs font-mono">
                  No active threat signatures matched. Start a simulation run.
                </div>
              ) : (
                activeEvents.map((evt, idx) => {
                  const stageObj = currentScenarioDetails?.stages?.find(s => s.stage_number === evt.stage)
                  if (!stageObj || (!stageObj.source_ip && !stageObj.destination_ip)) return null
                  return (
                    <div
                      key={idx}
                      className="p-3 bg-bg-primary/45 border border-border-custom/50 rounded-xl hover:border-slate-700 transition space-y-1 font-mono"
                    >
                      <span className="text-[9px] text-accent uppercase font-bold block">
                        Stage {evt.stage}: Ingress Signatures
                      </span>
                      {stageObj.source_ip && (
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-500">Source:</span>
                          <span className="text-slate-350">{stageObj.source_ip}</span>
                        </div>
                      )}
                      {stageObj.destination_ip && (
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-500">Destination:</span>
                          <span className="text-slate-350">{stageObj.destination_ip}</span>
                        </div>
                      )}
                    </div>
                  )
                })
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
                  <span className="text-[9px] font-mono text-slate-500">Risk Factor</span>
                </div>
              </div>

              <Badge variant={currentRiskScore > 75 ? 'critical' : currentRiskScore > 50 ? 'warning' : 'success'} size="sm">
                {currentRiskScore > 75 ? 'CRITICAL THREATS' : currentRiskScore > 50 ? 'MEDIUM RISK' : 'SECURE NODE'}
              </Badge>
            </Card>

            {/* AI Analyst Advisor Panel */}
            <Card className="md:col-span-2 flex flex-col justify-between border-accent/20 bg-accent/5">
              <div className="flex items-center justify-between mb-3 shrink-0">
                <div className="flex items-center space-x-2">
                  <Brain className="h-4.5 w-4.5 text-accent animate-pulse" />
                  <span className="text-xs font-bold text-white">AI Analyst Cognitive Brief</span>
                </div>
                <span className="text-[9px] font-mono text-slate-500">
                  {isSimulating ? `RUN-${activeSimulation.id.slice(0, 8)}` : 'STANDBY'}
                </span>
              </div>

              <div className="flex-1 p-3.5 rounded-xl bg-bg-primary/45 border border-border-custom/50 text-xs text-slate-350 leading-relaxed font-sans min-h-[100px] flex items-center justify-center">
                {isSimulating && activeStepDetail ? (
                  <div className="space-y-2">
                    <p className="font-semibold text-white font-mono text-accent">Stage {activeStepDetail.stage}: {activeStepDetail.title}</p>
                    <p className="text-slate-400 font-mono text-[11px] leading-relaxed">{activeStepDetail.description}</p>
                  </div>
                ) : (
                  <p className="text-slate-550 font-mono text-center">
                    Simulator idle. Trigger a training scenario to monitor cognitive network telemetry audits.
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
                const isActive = isSimulating && activeStepDetail?.mitre_technique === m.code
                const borderColors = isActive
                  ? 'border-accent bg-accent/15 shadow-sm shadow-accent/10 scale-102 font-bold text-accent'
                  : 'border-border-custom bg-bg-primary/20 hover:border-slate-700 text-slate-400'

                return (
                  <div
                    key={m.code}
                    className={`p-3 rounded-xl border text-center flex flex-col justify-between transition-all duration-300 min-h-[90px] ${borderColors}`}
                  >
                    <span className="text-[9px] font-mono block text-slate-500 uppercase">{m.tactic}</span>
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
              {isSimulating && activeEvents.length > 0 && (
                <span className="text-[10px] font-mono text-slate-500">{activeEvents.length} Logs recorded</span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto max-h-[300px] pr-1 space-y-4 custom-scrollbar min-h-[140px] flex flex-col justify-start">
              {!isSimulating || activeEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-slate-600 font-mono text-xs text-center flex-1">
                  <Terminal className="h-5 w-5 mb-2 text-slate-700" />
                  <span>No events captured. Launch a simulation to inject telemetry.</span>
                </div>
              ) : (
                [...activeEvents].reverse().map((evt, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-4 p-3.5 rounded-xl bg-bg-primary/45 border border-border-custom/50 hover:bg-bg-primary/80 transition duration-150 animate-fadeIn animate-duration-300"
                  >
                    <div className="p-2 rounded-lg bg-bg-secondary border border-border-custom text-slate-400 mt-0.5 shrink-0">
                      <Activity className={`h-4 w-4 ${
                        evt.severity.toLowerCase() === 'critical' ? 'text-critical-custom' : 
                        evt.severity.toLowerCase() === 'high' ? 'text-warning-custom' : 
                        'text-info-custom'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-white">Stage {evt.stage}: {evt.title}</span>
                          {evt.mitre_technique && (
                            <span className="text-[10px] font-mono text-accent font-semibold">{evt.mitre_technique}</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 shrink-0">
                          <Badge variant={severityBadgeColor(evt.severity)} size="sm">{evt.severity}</Badge>
                          <span className="text-[10px] font-mono text-slate-550">
                            {new Date(evt.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-450 leading-relaxed">{evt.description}</p>
                      {evt.incident_id && (
                        <div className="mt-2 text-[10px] font-mono text-red-400 flex items-center space-x-1.5 bg-red-950/20 px-2.5 py-1.5 rounded-lg border border-red-500/10 w-fit">
                          <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                          <span>Generated Incident ID: {evt.incident_id.slice(0, 8)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

        </div>

      </div>

      {/* BOTTOM SECTION: Simulation History & Audit Logs */}
      <Card className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-white m-0">Simulation History & Audit Logs</h3>
            <p className="text-slate-500 text-xs mt-1">Audit logs of completed and failed educational training runs.</p>
          </div>
          <Button variant="secondary" size="sm" onClick={fetchHistory} disabled={loading} className="font-mono text-xs">
            Refresh History
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-custom/50 text-[10px] font-mono text-slate-500 uppercase">
                <th className="py-3 px-4">Simulation Name</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Started By</th>
                <th className="py-3 px-4">Started Time</th>
                <th className="py-3 px-4">Completed Time</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4 text-center">Incidents</th>
                <th className="py-3 px-4 text-center">Risk Delta</th>
                <th className="py-3 px-4 text-center">Overall Risk</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-custom/20 text-xs">
              {loading && history.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-slate-500 font-mono">
                    Loading audit records...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-slate-550 font-mono">
                    No historical simulation runs found. Launch one above!
                  </td>
                </tr>
              ) : (
                history.map((sim) => (
                  <tr
                    key={sim.id}
                    className="hover:bg-bg-primary/20 transition-colors duration-150 border-b border-border-custom/20"
                  >
                    <td className="py-3.5 px-4 font-bold text-white">{sim.name}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={
                        sim.status === 'Completed' ? 'success' :
                        sim.status === 'Running' ? 'info' :
                        sim.status === 'Failed' ? 'critical' : 'warning'
                      } size="sm">
                        {sim.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {sim.initiated_by_user?.username || `User #${sim.initiated_by}`}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(sim.started_at).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {sim.completed_at ? new Date(sim.completed_at).toLocaleString() : '-'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {sim.status === 'Running' ? '-' : `${sim.duration_seconds}s`}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-white">
                      {sim.incident_count}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-red-400">
                      +{sim.risk_score_change}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-accent">
                      {sim.overall_risk}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewTimeline(sim)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-bg-primary/45 hover:text-accent border border-border-custom/50 hover:border-accent/40 transition cursor-pointer"
                          title="View Timeline"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteSimulation(sim.id, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-bg-primary/45 hover:text-critical-custom border border-border-custom/50 hover:border-red-500/40 transition cursor-pointer"
                          title="Delete Simulation"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* TIMELINE MODAL FOR HISTORY DETAILS */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedHistorySim ? `Audit Details: ${selectedHistorySim.name}` : ''}
      >
        {selectedHistorySim && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border-custom font-mono text-[11px] text-slate-400">
              <div>
                <span className="block text-[9px] text-slate-500 uppercase">Started By</span>
                <span className="text-white font-bold">{selectedHistorySim.initiated_by_user?.username || 'System'}</span>
              </div>
              <div>
                <span className="block text-[9px] text-slate-500 uppercase">Overall Risk Score</span>
                <span className="text-accent font-bold text-xs">{selectedHistorySim.overall_risk}</span>
              </div>
              <div>
                <span className="block text-[9px] text-slate-500 uppercase">Incident Count</span>
                <span className="text-white font-bold">{selectedHistorySim.incident_count} Incidents</span>
              </div>
              <div>
                <span className="block text-[9px] text-slate-500 uppercase">Duration</span>
                <span className="text-white font-bold">{selectedHistorySim.duration_seconds} seconds</span>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">Execution Stages</h4>
              
              {historyEvents.length === 0 ? (
                <p className="text-slate-500 font-mono text-center py-6 text-xs">No stage events recorded for this run.</p>
              ) : (
                historyEvents.map((evt, idx) => (
                  <div key={idx} className="p-3 bg-bg-primary/30 border border-border-custom/50 rounded-xl space-y-2">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="text-[11px] font-mono font-bold text-white">
                        Stage {evt.stage}: {evt.title}
                      </span>
                      <Badge variant={severityBadgeColor(evt.severity)} size="sm">
                        {evt.severity}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">{evt.description}</p>
                    {evt.mitre_technique && (
                      <div className="text-[10px] font-mono text-slate-500">
                        MITRE technique: <span className="text-accent font-semibold">{evt.mitre_technique}</span>
                      </div>
                    )}
                    {evt.incident_id && (
                      <div className="flex items-center space-x-1.5 text-[10px] font-mono text-red-400 bg-red-950/20 px-2 py-1 rounded border border-red-500/10 w-fit mt-1">
                        <AlertTriangle className="h-3 w-3 text-red-500" />
                        <span>Incident Created: {evt.incident_id.slice(0, 8)}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </Modal>
    </PageShell>
  )
}
