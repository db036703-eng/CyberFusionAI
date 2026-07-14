import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {
  Shield,
  AlertTriangle,
  FlameKindling,
  Brain,
  TrendingUp,
  TrendingDown,
  Target,
  Radio,
  Play,
  FileText,
  RefreshCw,
  ShieldAlert,
  Terminal,
  Layers,
  Activity
} from 'lucide-react'
import { Sidebar } from './components/layout/Sidebar'
import { Navbar } from './components/layout/Navbar'
import { NotificationPanel } from './components/layout/NotificationPanel'
import { Card } from './components/ui/Card'
import { Button } from './components/ui/Button'
import { Badge } from './components/ui/Badge'
import { Drawer } from './components/ui/Drawer'
import { EmptyState } from './components/ui/EmptyState'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/Table'
import { useUIStore } from './store/uiStore'
import { LoginPage } from './components/pages/LoginPage'
import { RegisterPage } from './components/pages/RegisterPage'
import { ForgotPasswordPage } from './components/pages/ForgotPasswordPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuthStore } from './store/authStore'

// Import new modular dashboard widgets
import { AttackTimeline } from './components/ui/AttackTimeline'
import { ThreatIntelFeed } from './components/ui/ThreatIntelFeed'
import { MitreAttackMatrix } from './components/ui/MitreAttackMatrix'
import { AiAnalystSummary } from './components/ui/AiAnalystSummary'
import { RecentReports } from './components/ui/RecentReports'

// Import expanded page views
import { AttackSimulatorPage } from './components/pages/AttackSimulatorPage'
import { ThreatIntelPage } from './components/pages/ThreatIntelPage'
import { IocManagerPage } from './components/pages/IocManagerPage'
import { ThreatActorsPage } from './components/pages/ThreatActorsPage'
import { MitreAttackPage } from './components/pages/MitreAttackPage'
import { AttackTimelinePage } from './components/pages/AttackTimelinePage'
import { ReportsPage } from './components/pages/ReportsPage'
import { AiAnalystPage } from './components/pages/AiAnalystPage'
import { SettingsPage } from './components/pages/SettingsPage'
import { ProfilePage } from './components/pages/ProfilePage'
import { AdminPage } from './components/pages/AdminPage'

interface HealthResponse {
  status: string
  service: string
  version: string
}

// Premium KPI Card component with tooltips and hover animations
interface PremiumKpiCardProps {
  title: string
  value: string | number
  trend: string
  trendType: 'increase' | 'decrease' | 'stable'
  icon: React.ReactNode
  tooltip: string
  color: 'accent' | 'critical' | 'warning' | 'info' | 'success'
}

const PremiumKpiCard: React.FC<PremiumKpiCardProps> = ({
  title,
  value,
  trend,
  trendType,
  icon,
  tooltip,
  color
}) => {
  const [showTooltip, setShowTooltip] = useState(false)
  
  const borderColors = {
    accent: 'hover:border-accent/40 shadow-accent/5',
    critical: 'hover:border-danger/40 shadow-danger/5',
    warning: 'hover:border-warning/40 shadow-warning/5',
    info: 'hover:border-secondary/40 shadow-secondary/5',
    success: 'hover:border-success/40 shadow-success/5'
  }

  const textColors = {
    accent: 'text-accent',
    critical: 'text-danger',
    warning: 'text-warning',
    info: 'text-secondary',
    success: 'text-success'
  }

  const bgColors = {
    accent: 'bg-accent/10',
    critical: 'bg-danger/10',
    warning: 'bg-warning/10',
    info: 'bg-secondary/10',
    success: 'bg-success/10'
  }

  const sparklineColors = {
    accent: '#00C2FF',
    critical: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    success: '#22C55E'
  }

  return (
    <div
      className={`relative group bg-[#12182A]/90 border border-border-custom/80 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:bg-[#161D33] ${borderColors[color]} flex flex-col justify-between min-h-[145px] shadow-[0_8px_30px_rgb(0,0,0,0.25)]`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="flex items-start justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400/80">{title}</span>
        <div className={`p-2 rounded-xl bg-[#0A0F1F] border border-border-custom group-hover:scale-105 transition-transform duration-300 ${textColors[color]} ${bgColors[color]}`}>
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
          <div className={`flex items-center space-x-1 text-[10px] font-mono mt-1 ${
            trendType === 'increase' ? 'text-success' :
            trendType === 'decrease' ? 'text-danger' :
            'text-slate-400'
          }`}>
            {trendType === 'increase' && <TrendingUp className="h-3 w-3" />}
            {trendType === 'decrease' && <TrendingDown className="h-3 w-3" />}
            <span className="font-semibold">{trend}</span>
          </div>
        </div>

        {/* Wavy SVG Sparkline with gradient Area fills */}
        <div className="w-16 h-8 overflow-hidden shrink-0 self-end opacity-85 group-hover:opacity-100 transition-opacity">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
            <defs>
              <linearGradient id={`grad-${title.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={sparklineColors[color]} stopOpacity="0.25" />
                <stop offset="100%" stopColor={sparklineColors[color]} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d={trendType === 'increase' ? "M0,25 Q15,20 30,12 T60,18 T90,5 L90,30 L0,30 Z" : trendType === 'decrease' ? "M0,5 Q15,10 30,18 T60,12 T90,25 L90,30 L0,30 Z" : "M0,15 Q25,12 50,18 T100,15 L100,30 L0,30 Z"}
              fill={`url(#grad-${title.replace(/\s+/g, '-')})`}
            />
            <path
              d={trendType === 'increase' ? "M0,25 Q15,20 30,12 T60,18 T90,5" : trendType === 'decrease' ? "M0,5 Q15,10 30,18 T60,12 T90,25" : "M0,15 Q25,12 50,18 T100,15"}
              fill="none"
              stroke={sparklineColors[color]}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Tooltip Overlay */}
      {showTooltip && (
        <div className="absolute top-[-52px] left-1/2 -translate-x-1/2 bg-[#12182A] border border-[#00C2FF]/30 text-slate-200 text-[10px] px-3 py-1.5 rounded-lg shadow-2xl z-30 transition-all duration-300 pointer-events-none font-mono text-center min-w-[200px] leading-snug glass-panel">
          {tooltip}
        </div>
      )}
    </div>
  )
}

function MainLayout() {
  const [simulationStatus, setSimulationStatus] = useState<'idle' | 'running' | 'completed'>('idle')
  const [reportProgress, setReportProgress] = useState<'idle' | 'generating' | 'done'>('idle')

  const {
    activeTab,
    searchQuery,
    selectedIncident,
    isDetailDrawerOpen,
    incidents,
    selectIncident,
    setDetailDrawerOpen,
    mitigateIncident
  } = useUIStore()

  // API connection health states
  const [apiStatus, setApiStatus] = useState<'healthy' | 'unhealthy' | 'loading'>('loading')
  const [apiDetails, setApiDetails] = useState<HealthResponse | null>(null)
  
  // Incidents Filter (by severity)
  const [severityFilter, setSeverityFilter] = useState<string>('all')

  const verifyBackendHealth = async () => {
    setApiStatus('loading')
    try {
      const response = await fetch('http://localhost:8000/health')
      if (!response.ok) throw new Error('Response error')
      const data = await response.json()
      setApiDetails(data)
      setApiStatus('healthy')
    } catch {
      setApiStatus('unhealthy')
      setApiDetails(null)
    }
  }

  const handleLaunchSimulation = () => {
    if (simulationStatus === 'running') return
    setSimulationStatus('running')
    setTimeout(() => {
      setSimulationStatus('completed')
      setTimeout(() => setSimulationStatus('idle'), 4000)
    }, 3000)
  }

  const handleGenerateReport = () => {
    if (reportProgress === 'generating') return
    setReportProgress('generating')
    setTimeout(() => {
      setReportProgress('done')
      
      // Trigger client-side mockup text file download
      const element = document.createElement('a')
      const file = new Blob([
        `CyberFusion AI Security Operations Center Executive Report\n`,
        `=======================================================\n`,
        `Generated: ${new Date().toLocaleString()}\n`,
        `Organization Risk Score: 72 (Medium)\n`,
        `Active Critical Threats: ${incidents.filter(i => i.severity === 'critical' && i.status === 'active').length}\n`,
        `Active Open Anomalies: ${incidents.filter(i => i.status === 'active' || i.status === 'investigating').length}\n`,
        `Indicators of Compromise Matched: 412 Matches\n`,
        `Threat Ingestion Channel: 99.8% Healthy\n`,
        `AI Cognitive Analytics Confidence: 94.2%\n`
      ], { type: 'text/plain' })
      element.href = URL.createObjectURL(file)
      element.download = `CyberFusion_Executive_Report_${Date.now()}.txt`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      
      setTimeout(() => setReportProgress('idle'), 3000)
    }, 2000)
  }

  useEffect(() => {
    verifyBackendHealth()
    const timer = setInterval(verifyBackendHealth, 15000) // Poll health every 15s
    return () => clearInterval(timer)
  }, [])

  // Filter incidents based on active search bar text and severity tab selection
  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.category.toLowerCase().includes(searchQuery.toLowerCase())
      
    const matchesSeverity = severityFilter === 'all' || inc.severity === severityFilter
    
    return matchesSearch && matchesSeverity
  })

  // Core metrics aggregations
  const criticalCount = incidents.filter(i => i.severity === 'critical' && i.status === 'active').length
  const activeCount = incidents.filter(i => i.status === 'active' || i.status === 'investigating').length

  return (
    <div className="min-h-screen bg-bg-primary text-slate-100 flex font-sans overflow-hidden">
      {/* Sidebar Layout */}
      <Sidebar />

      {/* Main Panel Viewport */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Navbar apiStatus={apiStatus} />
        
        {/* Dropdown panel position anchor */}
        <NotificationPanel />

        {/* Scrollable Workspace content */}
        <main className="flex-1 overflow-y-auto p-8 space-y-10 max-w-7xl w-full mx-auto">
          
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              {/* Simulation Status Toast Banner */}
              {simulationStatus !== 'idle' && (
                <div className={`p-4 rounded-xl border flex items-center justify-between transition-all duration-300 animate-pulse ${
                  simulationStatus === 'running'
                    ? 'bg-accent/10 border-accent/30 text-accent font-semibold'
                    : 'bg-success-custom/10 border-success-custom/30 text-success-custom font-semibold'
                }`}>
                  <div className="flex items-center space-x-3">
                    <ShieldAlert className="h-5 w-5 shrink-0" />
                    <span className="text-sm font-mono">
                      {simulationStatus === 'running'
                        ? 'ATTACK SIMULATION ACTIVE: Executing multi-stage intrusion scenario T1566.002 on corporate subnets...'
                        : 'SIMULATION COMPLETED: Vulnerability payloads isolated. Anomalous activity log updated.'}
                    </span>
                  </div>
                  {simulationStatus === 'running' && (
                    <div className="h-1.5 w-24 bg-accent/20 rounded-full overflow-hidden shrink-0">
                      <div className="h-full bg-accent w-1/2 rounded-full animate-bounce" />
                    </div>
                  )}
                </div>
              )}

              {/* 1. HERO SECTION */}
              <div className="relative overflow-hidden p-8 rounded-2xl bg-[#12182A] border border-border-custom/80 shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
                {/* Backplate patterns */}
                <div className="absolute inset-0 cyber-grid-bg opacity-15 pointer-events-none" />
                <div className="absolute -right-20 -top-20 h-64 w-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 z-10">
                  <div className="space-y-3">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-warning/5 border border-warning/20 text-warning text-xs font-mono select-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
                      <span>Organization Risk Index: 72 (Medium Risk)</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white m-0">
                      Good Morning, Analyst
                    </h1>
                    <p className="text-slate-400 text-xs flex items-center gap-2 font-medium font-mono">
                      <span>Telemetry active •</span>
                      <span>Last updated: Just now •</span>
                      <span className="text-danger flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-danger animate-pulse shrink-0" />
                        <span>3 critical priority logs require isolation playbook</span>
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest text-right hidden md:block">Quick Actions</span>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button
                        variant="primary"
                        onClick={handleLaunchSimulation}
                        disabled={simulationStatus === 'running'}
                        className="font-mono text-xs flex items-center space-x-2 border border-accent/30 bg-accent/5 hover:bg-accent/15 text-accent cursor-pointer group"
                      >
                        <Play className={`h-3.5 w-3.5 transition-transform group-hover:scale-110 ${simulationStatus === 'running' ? 'animate-spin' : ''}`} />
                        <span>{simulationStatus === 'running' ? 'Simulating...' : 'Launch Simulation'}</span>
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={handleGenerateReport}
                        disabled={reportProgress === 'generating'}
                        className="font-mono text-xs flex items-center space-x-2 border border-border-custom bg-bg-primary/50 hover:bg-[#1E293B]/20 text-slate-300 hover:text-white cursor-pointer"
                      >
                        {reportProgress === 'generating' ? (
                          <RefreshCw className="h-3.5 w-3.5 animate-spin text-accent" />
                        ) : (
                          <FileText className="h-3.5 w-3.5 text-slate-400" />
                        )}
                        <span>{reportProgress === 'generating' ? 'Compiling...' : 'Generate PDF'}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. 6 KPI CARDS (using grid-cols-12) */}
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-2">
                  <PremiumKpiCard
                    title="Organization Risk"
                    value={criticalCount === 0 ? "32" : "72"}
                    trend="+2.4%"
                    trendType="increase"
                    icon={<AlertTriangle className="h-5 w-5" />}
                    tooltip="Consolidated threat index factor based on active machine vulnerabilities (Medium Risk)."
                    color="warning"
                  />
                </div>
                <div className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-2">
                  <PremiumKpiCard
                    title="Critical Incidents"
                    value={criticalCount}
                    trend={criticalCount > 0 ? `+${criticalCount - 1} this hr` : "Stable"}
                    trendType={criticalCount > 0 ? "increase" : "stable"}
                    icon={<FlameKindling className="h-5 w-5" />}
                    tooltip="Severely anomalous machine actions requiring immediate containment playbooks."
                    color="critical"
                  />
                </div>
                <div className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-2">
                  <PremiumKpiCard
                    title="Open Incidents"
                    value={activeCount}
                    trend="-2 yesterday"
                    trendType="decrease"
                    icon={<Shield className="h-5 w-5" />}
                    tooltip="Total security alerts currently actively investigated by SOC operators."
                    color="info"
                  />
                </div>
                <div className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-2">
                  <PremiumKpiCard
                    title="IOC Matches"
                    value="412"
                    trend="+14%"
                    trendType="increase"
                    icon={<Target className="h-5 w-5" />}
                    tooltip="Correlated indicator signatures matched across proxy & database ports."
                    color="warning"
                  />
                </div>
                <div className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-2">
                  <PremiumKpiCard
                    title="Threat Feed Health"
                    value="99.8%"
                    trend="Stable"
                    trendType="stable"
                    icon={<Radio className="h-5 w-5" />}
                    tooltip="Operational rate of active ingested global security intelligence feeds."
                    color="success"
                  />
                </div>
                <div className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-2">
                  <PremiumKpiCard
                    title="AI Confidence"
                    value="94.2%"
                    trend="+1.2%"
                    trendType="increase"
                    icon={<Brain className="h-5 w-5" />}
                    tooltip="Autonomous classifier precision rate mapping historical telemetry nodes."
                    color="accent"
                  />
                </div>
              </div>

              {/* 3. ROW 1: Attack Path Timeline & AI Analyst Summary */}
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-7 flex flex-col">
                  <AttackTimeline />
                </div>
                <div className="col-span-12 lg:col-span-5 flex flex-col">
                  <AiAnalystSummary />
                </div>
              </div>

              {/* 4. ROW 2: MITRE ATT&CK Matrix Mapping */}
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12">
                  <MitreAttackMatrix />
                </div>
              </div>

              {/* 5. ROW 3: Threat Intelligence Feed & Recent Reports */}
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-6">
                  <ThreatIntelFeed />
                </div>
                <div className="col-span-12 lg:col-span-6">
                  <RecentReports />
                </div>
              </div>

              {/* 6. ROW 4: Recent Actionable Incidents Table */}
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12">
                  <div className="p-6 rounded-2xl bg-[#12182A] border border-border-custom/80 shadow-[0_8px_30px_rgb(0,0,0,0.25)] space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white m-0">Recent Actionable Incidents</h3>
                        <p className="text-slate-500 text-xs mt-1">Audit log of priority anomalies currently in ingestion pipelines.</p>
                      </div>
                      <Button variant="secondary" size="sm" onClick={() => useUIStore.getState().setActiveTab('incidents')} className="font-mono text-xs">
                        View All Incidents
                      </Button>
                    </div>
                    
                    <Table>
                      <TableHeader className="sticky top-0 bg-[#12182A] z-10">
                        <TableRow>
                          <TableHead>Incident ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Severity</TableHead>
                          <TableHead>Source Node</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {incidents.slice(0, 3).map((inc) => (
                          <TableRow
                            key={inc.id}
                            onClick={() => selectIncident(inc)}
                            className="cursor-pointer transition-colors duration-150 hover:bg-[#1E293B]/30"
                          >
                            <TableCell className="font-mono text-accent font-semibold">{inc.id}</TableCell>
                            <TableCell className="font-semibold text-white">{inc.title}</TableCell>
                            <TableCell>
                              <Badge variant={inc.severity} type="severity">
                                {inc.severity}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-slate-400">{inc.source}</TableCell>
                            <TableCell>{inc.category}</TableCell>
                            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                              {inc.status === 'active' || inc.status === 'investigating' ? (
                                <Button variant="primary" size="sm" onClick={() => mitigateIncident(inc.id)} className="font-mono text-xs px-3.5 py-1.5 rounded-lg">
                                  Mitigate
                                </Button>
                              ) : (
                                <Badge variant="success" size="sm">Mitigated</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INCIDENT MANAGER */}
          {activeTab === 'incidents' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-white m-0">Incident Management Panel</h2>
                  <p className="text-slate-400 text-sm mt-1">Audit, isolate, and execute response plays for platform anomalies.</p>
                </div>
                
                {/* Severity filter tabs */}
                <div className="inline-flex p-1 rounded-xl bg-bg-secondary border border-border-custom">
                  {['all', 'critical', 'warning', 'info', 'success'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSeverityFilter(filter)}
                      className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg capitalize cursor-pointer transition-all ${
                        severityFilter === filter
                          ? 'bg-accent text-[#0B1020] font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Incidents Table list */}
              {filteredIncidents.length === 0 ? (
                <EmptyState
                  title="No incidents match filter"
                  description="Try typing a different term in the search bar or changing the severity query tab."
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Incident Title</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Source Node</TableHead>
                      <TableHead>Time Triggered</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action Playbook</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIncidents.map((inc) => (
                      <TableRow
                        key={inc.id}
                        onClick={() => selectIncident(inc)}
                        className="cursor-pointer"
                      >
                        <TableCell className="font-mono text-accent font-semibold">{inc.id}</TableCell>
                        <TableCell className="font-semibold text-white">{inc.title}</TableCell>
                        <TableCell>
                          <Badge variant={inc.severity} type="severity">
                            {inc.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>{inc.category}</TableCell>
                        <TableCell className="font-mono text-slate-450">{inc.source}</TableCell>
                        <TableCell className="font-mono text-slate-450">{inc.timestamp}</TableCell>
                        <TableCell className="capitalize">
                          <span className={`inline-flex items-center text-xs ${
                            inc.status === 'active' ? 'text-critical-custom' :
                            inc.status === 'investigating' ? 'text-warning-custom' : 'text-slate-400'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full mr-1.5 bg-current ${
                              inc.status === 'active' || inc.status === 'investigating' ? 'animate-pulse' : ''
                            }`} />
                            {inc.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          {inc.status === 'active' || inc.status === 'investigating' ? (
                            <Button variant="primary" size="sm" onClick={() => mitigateIncident(inc.id)}>
                              Mitigate
                            </Button>
                          ) : (
                            <Badge variant="success" size="sm">Mitigated</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}

          {/* TAB 3: SYSTEM HEALTH TELEMETRY */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white m-0">Platform System Telemetry</h2>
                <p className="text-slate-400 text-sm mt-1">Live status verification of CyberFusion AI container stack.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* FastAPI Health status */}
                <Card className="flex flex-col justify-between min-h-[220px]">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Terminal className="h-5 w-5 text-accent" />
                        <h3 className="font-bold text-white text-sm m-0">FastAPI backend</h3>
                      </div>
                      <Badge variant={apiStatus === 'healthy' ? 'success' : 'critical'}>
                        {apiStatus === 'healthy' ? 'Active' : 'Offline'}
                      </Badge>
                    </div>
                    
                    {apiStatus === 'healthy' ? (
                      <div className="space-y-2 mt-4 text-xs font-mono text-slate-400">
                        <div className="flex justify-between border-b border-border-custom/40 pb-2">
                          <span>Service Name</span>
                          <span className="text-white">{apiDetails?.service}</span>
                        </div>
                        <div className="flex justify-between border-b border-border-custom/40 pb-2">
                          <span>Version</span>
                          <span className="text-accent">{apiDetails?.version}</span>
                        </div>
                        <div className="flex justify-between pb-2">
                          <span>API Endpoint</span>
                          <span className="text-white">/health</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-450 mt-4 leading-relaxed">
                        FastAPI backend server is unreachable. Ensure the FastAPI container is running inside docker-compose.
                      </p>
                    )}
                  </div>
                  
                  <Button variant="secondary" size="sm" onClick={verifyBackendHealth}>
                    Re-Verify Connection
                  </Button>
                </Card>

                {/* PostgreSQL DB status */}
                <Card className="flex flex-col justify-between min-h-[220px]">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Layers className="h-5 w-5 text-indigo-400" />
                        <h3 className="font-bold text-white text-sm m-0">PostgreSQL database</h3>
                      </div>
                      <Badge variant="info">Day 1 Setup</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                      PostgreSQL database client has been successfully configured using SQLAlchemy engine drivers.
                    </p>
                    <div className="mt-4 p-3 rounded-lg bg-bg-primary border border-border-custom text-[11px] font-mono text-slate-500">
                      postgres:15-alpine volume mapped
                    </div>
                  </div>
                  
                  <div className="text-[10px] text-slate-550 font-mono italic">
                    Real-time DB query check pending schema migration.
                  </div>
                </Card>

                {/* Redis status */}
                <Card className="flex flex-col justify-between min-h-[220px]">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Activity className="h-5 w-5 text-emerald-400" />
                        <h3 className="font-bold text-white text-sm m-0">Redis Cache</h3>
                      </div>
                      <Badge variant="info">Day 1 Setup</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                      Redis instance configured as network database cache container for token and throttle pipelines.
                    </p>
                    <div className="mt-4 p-3 rounded-lg bg-bg-primary border border-border-custom text-[11px] font-mono text-slate-500">
                      redis:7-alpine container volume mapped
                    </div>
                  </div>
                  
                  <div className="text-[10px] text-slate-550 font-mono italic">
                    Connection pool initialized.
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 4: ATTACK SIMULATOR */}
          {activeTab === 'simulator' && <AttackSimulatorPage />}

          {/* TAB 5: THREAT INTELLIGENCE */}
          {activeTab === 'intel' && <ThreatIntelPage />}

          {/* TAB 6: IOC MANAGER */}
          {activeTab === 'ioc' && <IocManagerPage />}

          {/* TAB 7: THREAT ACTORS */}
          {activeTab === 'actors' && <ThreatActorsPage />}

          {/* TAB 8: MITRE ATT&CK */}
          {activeTab === 'mitre' && <MitreAttackPage />}

          {/* TAB 9: ATTACK TIMELINE */}
          {activeTab === 'timeline' && <AttackTimelinePage />}

          {/* TAB 10: REPORTS */}
          {activeTab === 'reports' && <ReportsPage />}

          {/* TAB 11: AI ANALYST */}
          {activeTab === 'ai_analyst' && <AiAnalystPage />}

          {/* TAB 12: SETTINGS */}
          {activeTab === 'settings' && <SettingsPage />}

          {/* TAB 13: USER PROFILE */}
          {activeTab === 'profile' && <ProfilePage />}

          {/* TAB 14: SYSTEM ADMIN */}
          {activeTab === 'admin' && (
            <ProtectedRoute allowedRoles={['Super Admin']}>
              <AdminPage />
            </ProtectedRoute>
          )}

        </main>
      </div>

      {/* Side Slide-out Drawer: Detailed Incident Inspector */}
      <Drawer
        isOpen={isDetailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
        title={selectedIncident ? `Inspect Incident: ${selectedIncident.id}` : ''}
      >
        {selectedIncident && (
          <div className="space-y-8">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xl font-bold text-white m-0">{selectedIncident.title}</h4>
                <Badge variant={selectedIncident.severity} type="severity">
                  {selectedIncident.severity}
                </Badge>
              </div>
              <span className="text-xs font-mono text-slate-500">Triggered timestamp: {selectedIncident.timestamp}</span>
            </div>

            {/* Incident Specifications */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-bg-primary border border-border-custom">
                <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">Source node</span>
                <span className="text-sm font-mono text-slate-200">{selectedIncident.source}</span>
              </div>
              <div className="p-4 rounded-xl bg-bg-primary border border-border-custom">
                <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">Alert category</span>
                <span className="text-sm text-slate-200">{selectedIncident.category}</span>
              </div>
            </div>

            {/* Incident Description */}
            <div className="space-y-2">
              <h5 className="text-xs uppercase font-mono text-slate-400 m-0">Anomalous Telemetry</h5>
              <div className="p-4 rounded-xl bg-bg-primary/50 border border-border-custom text-sm text-slate-300 leading-relaxed">
                {selectedIncident.description}
              </div>
            </div>

            {/* Recommended Remediation Action */}
            <div className="space-y-2">
              <h5 className="text-xs uppercase font-mono text-slate-400 m-0">Mitigation Playbook Play</h5>
              <div className="p-4 rounded-xl border border-success-custom/20 bg-success-custom/5 text-sm text-slate-300 leading-relaxed">
                {selectedIncident.remediation || 'Remediation pipeline check required.'}
              </div>
            </div>

            {/* Drawer Control Options */}
            <div className="flex items-center space-x-4 pt-4 border-t border-border-custom">
              {selectedIncident.status === 'active' || selectedIncident.status === 'investigating' ? (
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => mitigateIncident(selectedIncident.id)}
                >
                  Apply Mitigation Action
                </Button>
              ) : (
                <div className="flex-1 p-3 rounded-xl bg-success-custom/10 border border-success-custom/20 text-center font-mono text-xs font-semibold text-success-custom">
                  Incident mitigated successfully.
                </div>
              )}
              <Button
                variant="secondary"
                onClick={() => setDetailDrawerOpen(false)}
              >
                Close Inspector
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}

function App() {
  const initializeAuth = useAuthStore(state => state.initialize)
  const isAuthLoading = useAuthStore(state => state.isLoading)

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-bg-primary text-slate-100 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        <span className="text-xs font-mono text-slate-400">Verifying security parameters...</span>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
