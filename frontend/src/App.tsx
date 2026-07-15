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
import { Modal } from './components/ui/Modal'
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

// Import expanded page views

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

const mapSeverityToBadgeVariant = (severity: string): 'critical' | 'warning' | 'info' | 'default' => {
  const s = severity.toLowerCase()
  if (s === 'critical') return 'critical'
  if (s === 'high') return 'warning'
  if (s === 'medium') return 'info'
  if (s === 'low') return 'default'
  return 'default'
}

const mapStatusToBadgeVariant = (status: string): 'default' | 'warning' | 'info' | 'success' => {
  const s = status.toLowerCase()
  if (s === 'new') return 'default'
  if (s === 'investigating') return 'warning'
  if (s === 'mitigated') return 'info'
  if (s === 'resolved') return 'success'
  return 'default'
}

function MainLayout() {
  const [simulationStatus, setSimulationStatus] = useState<'idle' | 'running' | 'completed'>('idle')
  const [reportProgress, setReportProgress] = useState<'idle' | 'generating' | 'done'>('idle')

  const {
    activeTab,
    selectedIncident,
    isDetailDrawerOpen,
    incidents,
    selectIncident,
    setDetailDrawerOpen,
    mitigateIncident,
    
    dashboardSummary,
    systemHealth,
    isLoading,
    error,
    
    fetchDashboardSummary,
    fetchRecentIncidents,
    fetchThreatFeed,
    fetchSystemHealth,
    fetchIncidents,
    
    // Pagination & CRUD
    totalIncidents,
    totalPages,
    analysts,
    fetchAnalysts,
    createIncident,
    updateIncident,
    deleteIncident
  } = useUIStore()
  
  // Incidents Filter state
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [statusFilter, setStatusFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    severity: 'Low',
    status: 'New',
    category: 'Authentication',
    source_ip: '',
    destination_ip: '',
    mitre_technique: '',
    assigned_user_id: '',
    remediation: ''
  })
  const [createError, setCreateError] = useState<string | null>(null)
  const [successNotification, setSuccessNotification] = useState<string | null>(null)

  // Drawer Edit Form State
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    status: 'New',
    severity: 'Low',
    assigned_user_id: '',
    remediation: ''
  })

  // Delete Confirmation State
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)

  const apiStatus = systemHealth?.status || 'loading'

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
        `Organization Risk Score: ${dashboardSummary?.organization_risk || 32}\n`,
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

  // Load analysts on mount
  useEffect(() => {
    fetchAnalysts()
  }, [fetchAnalysts])

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setPage(1) // reset page on search
    }, 300)
    return () => clearTimeout(handler)
  }, [searchTerm])

  // Sync edit form with selected incident
  useEffect(() => {
    if (selectedIncident) {
      setEditForm({
        status: selectedIncident.status,
        severity: selectedIncident.severity,
        assigned_user_id: selectedIncident.assigned_user_id ? selectedIncident.assigned_user_id.toString() : '',
        remediation: selectedIncident.remediation || ''
      })
      setIsEditing(false)
    }
  }, [selectedIncident])

  // Fetch incidents on page/filter change
  useEffect(() => {
    fetchIncidents(page, limit, {
      severity: severityFilter,
      status: statusFilter,
      category: categoryFilter,
      search: debouncedSearch
    })
  }, [page, limit, severityFilter, statusFilter, categoryFilter, debouncedSearch, fetchIncidents])

  // Polling for metrics
  useEffect(() => {
    fetchSystemHealth()
    fetchDashboardSummary()
    fetchRecentIncidents()
    fetchThreatFeed()
    
    const healthTimer = setInterval(fetchSystemHealth, 15000)
    const metricsTimer = setInterval(() => {
      fetchDashboardSummary()
      fetchRecentIncidents()
      fetchThreatFeed()
    }, 30000)
    
    return () => {
      clearInterval(healthTimer)
      clearInterval(metricsTimer)
    }
  }, [fetchSystemHealth, fetchDashboardSummary, fetchRecentIncidents, fetchThreatFeed])

  // Form Handlers
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError(null)
    
    if (createForm.title.length < 3) {
      setCreateError("Title must be at least 3 characters long.")
      return
    }
    
    const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/
    if (createForm.source_ip && !ipPattern.test(createForm.source_ip)) {
      setCreateError("Invalid Source IP format.")
      return
    }
    if (createForm.destination_ip && !ipPattern.test(createForm.destination_ip)) {
      setCreateError("Invalid Destination IP format.")
      return
    }
    
    try {
      await createIncident({
        title: createForm.title,
        description: createForm.description || null,
        severity: createForm.severity,
        status: createForm.status,
        category: createForm.category,
        source_ip: createForm.source_ip || null,
        destination_ip: createForm.destination_ip || null,
        mitre_technique: createForm.mitre_technique || null,
        assigned_user_id: createForm.assigned_user_id ? parseInt(createForm.assigned_user_id) : null,
        remediation: createForm.remediation || null
      })
      
      setIsCreateOpen(false)
      setSuccessNotification("Incident created successfully!")
      setTimeout(() => setSuccessNotification(null), 4000)
      
      setCreateForm({
        title: '',
        description: '',
        severity: 'Low',
        status: 'New',
        category: 'Authentication',
        source_ip: '',
        destination_ip: '',
        mitre_technique: '',
        assigned_user_id: '',
        remediation: ''
      })
    } catch (err: any) {
      setCreateError(err.message || "Failed to create incident.")
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedIncident) return
    try {
      await updateIncident(selectedIncident.id, {
        status: editForm.status,
        severity: editForm.severity,
        assigned_user_id: editForm.assigned_user_id ? parseInt(editForm.assigned_user_id) : null,
        remediation: editForm.remediation || null
      })
      setIsEditing(false)
      setSuccessNotification("Incident updated successfully!")
      setTimeout(() => setSuccessNotification(null), 3000)
    } catch (err: any) {
      console.error(err)
    }
  }

  const handleConfirmDelete = async () => {
    if (selectedIncident) {
      try {
        await deleteIncident(selectedIncident.id)
        setIsConfirmDeleteOpen(false)
        setSuccessNotification("Incident deleted successfully!")
        setTimeout(() => setSuccessNotification(null), 4000)
      } catch (err: any) {
        console.error(err)
      }
    }
  }

  // Skeleton placeholders
  const KpiSkeleton = () => (
    <div className="relative bg-[#12182A]/90 border border-border-custom/40 p-5 rounded-2xl min-h-[145px] flex flex-col justify-between animate-pulse">
      <div className="flex items-start justify-between">
        <div className="h-3 w-24 bg-slate-800 rounded"></div>
        <div className="h-8 w-8 rounded-xl bg-slate-800"></div>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-6 w-16 bg-slate-800 rounded"></div>
          <div className="h-3 w-12 bg-slate-800 rounded"></div>
        </div>
        <div className="h-8 w-16 bg-slate-800 rounded-lg"></div>
      </div>
    </div>
  )

  const TableRowSkeleton = () => (
    <TableRow className="animate-pulse">
      <TableCell><div className="h-4 bg-slate-800 rounded w-16"></div></TableCell>
      <TableCell><div className="h-4 bg-slate-800 rounded w-48"></div></TableCell>
      <TableCell><div className="h-5 bg-slate-800 rounded-full w-12"></div></TableCell>
      <TableCell><div className="h-4 bg-slate-800 rounded w-24"></div></TableCell>
      <TableCell><div className="h-4 bg-slate-800 rounded w-20"></div></TableCell>
      <TableCell className="text-right"><div className="h-8 bg-slate-800 rounded-lg w-20 ml-auto"></div></TableCell>
    </TableRow>
  )

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
              
              {/* API ERROR BANNER */}
              {error && (
                <div className="p-4 rounded-xl border bg-danger/10 border-danger/30 text-danger font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 shrink-0 animate-bounce" />
                    <span className="text-sm font-mono">
                      OPERATION TELEMETRY ERROR: {error}
                    </span>
                  </div>
                  <button 
                    onClick={() => useUIStore.getState().clearError()}
                    className="text-xs font-mono uppercase bg-[#12182A] hover:bg-[#1E293B] text-slate-300 border border-border-custom px-3 py-1.5 rounded-lg cursor-pointer transition"
                  >
                    Clear Context
                  </button>
                </div>
              )}

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
                      <span>Organization Risk Index: {dashboardSummary?.organization_risk || 32} ({dashboardSummary && dashboardSummary.organization_risk > 50 ? 'Medium Risk' : 'Low Risk'})</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white m-0">
                      Good Morning, Analyst
                    </h1>
                    <p className="text-slate-400 text-xs flex items-center gap-2 font-medium font-mono">
                      <span>Telemetry active •</span>
                      <span>Last updated: Just now •</span>
                      {incidents.filter(i => i.severity === 'critical' && i.status === 'active').length > 0 && (
                        <span className="text-danger flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-danger animate-pulse shrink-0" />
                          <span>{incidents.filter(i => i.severity === 'critical' && i.status === 'active').length} critical threats require containment playbook</span>
                        </span>
                      )}
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

              {/* 2. 6 KPI CARDS */}
              <div className="grid grid-cols-12 gap-6">
                {!dashboardSummary ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <div key={idx} className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-2">
                      <KpiSkeleton />
                    </div>
                  ))
                ) : (
                  <>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-2">
                      <PremiumKpiCard
                        title="Organization Risk"
                        value={dashboardSummary.organization_risk}
                        trend="+2.4%"
                        trendType="increase"
                        icon={<AlertTriangle className="h-5 w-5" />}
                        tooltip="Consolidated threat index factor based on active machine vulnerabilities."
                        color="warning"
                      />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-2">
                      <PremiumKpiCard
                        title="Critical Incidents"
                        value={dashboardSummary.critical_incidents}
                        trend="Stable"
                        trendType="stable"
                        icon={<FlameKindling className="h-5 w-5" />}
                        tooltip="Severely anomalous machine actions requiring immediate containment playbooks."
                        color="critical"
                      />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-2">
                      <PremiumKpiCard
                        title="Open Incidents"
                        value={dashboardSummary.open_incidents}
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
                        value={dashboardSummary.ioc_matches}
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
                        value={dashboardSummary.threat_feed_health}
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
                        value={dashboardSummary.ai_confidence}
                        trend="+1.2%"
                        trendType="increase"
                        icon={<Brain className="h-5 w-5" />}
                        tooltip="Autonomous classifier precision rate mapping historical telemetry nodes."
                        color="accent"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* 3. ROW 1: Attack Path & AI Analyst */}
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-7 flex flex-col">
                  <AttackTimeline />
                </div>
                <div className="col-span-12 lg:col-span-5 flex flex-col">
                  <AiAnalystSummary />
                </div>
              </div>

              {/* 4. ROW 2: MITRE ATT&CK Matrix */}
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12">
                  <MitreAttackMatrix />
                </div>
              </div>

              {/* 5. ROW 3: Threat Ingest & Reports */}
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-6">
                  <ThreatIntelFeed />
                </div>
                <div className="col-span-12 lg:col-span-6">
                  <RecentReports />
                </div>
              </div>

              {/* 6. ROW 4: Actionable Incidents Table */}
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
                        {isLoading && incidents.length === 0 ? (
                          Array.from({ length: 3 }).map((_, idx) => (
                            <TableRowSkeleton key={idx} />
                          ))
                        ) : incidents.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-slate-500 font-mono text-xs">
                              No active incidents recorded in central directory.
                            </TableCell>
                          </TableRow>
                        ) : (
                          incidents.slice(0, 3).map((inc) => (
                            <TableRow
                              key={inc.id}
                              onClick={() => selectIncident(inc)}
                              className="cursor-pointer transition-colors duration-150 hover:bg-[#1E293B]/30"
                            >
                              <TableCell className="font-mono text-accent font-semibold">{inc.id.slice(0, 8)}</TableCell>
                              <TableCell className="font-semibold text-white">{inc.title}</TableCell>
                              <TableCell>
                                <Badge variant={mapSeverityToBadgeVariant(inc.severity)} type="severity">
                                  {inc.severity}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-mono text-slate-400">{inc.source}</TableCell>
                              <TableCell>{inc.category || 'System'}</TableCell>
                              <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                {inc.status?.toLowerCase() !== 'resolved' && inc.status?.toLowerCase() !== 'mitigated' ? (
                                  <Button variant="primary" size="sm" onClick={() => mitigateIncident(inc.id)} className="font-mono text-xs px-3.5 py-1.5 rounded-lg">
                                    Mitigate
                                  </Button>
                                ) : (
                                  <Badge variant="success" size="sm">Mitigated</Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
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
                
                <Button variant="primary" size="md" onClick={() => setIsCreateOpen(true)} className="flex items-center space-x-2 rounded-xl">
                  <span>Create Incident</span>
                </Button>
              </div>

              {/* Filters & Search */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#12182A] border border-border-custom/80 shadow-md">
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search incidents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-3 pr-3 py-2 text-sm bg-bg-primary/50 border border-border-custom hover:border-accent/40 focus:border-accent focus:outline-none rounded-xl text-slate-100 placeholder-slate-500 font-mono transition-colors"
                  />
                </div>

                {/* Severity Filter */}
                <div>
                  <select
                    value={severityFilter}
                    onChange={(e) => { setSeverityFilter(e.target.value); setPage(1); }}
                    className="w-full px-3 py-2 text-sm bg-bg-primary/50 border border-border-custom hover:border-accent/40 focus:border-accent focus:outline-none rounded-xl text-slate-100 font-mono transition-colors cursor-pointer"
                  >
                    <option value="all">All Severities</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="w-full px-3 py-2 text-sm bg-bg-primary/50 border border-border-custom hover:border-accent/40 focus:border-accent focus:outline-none rounded-xl text-slate-100 font-mono transition-colors cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Investigating">Investigating</option>
                    <option value="Mitigated">Mitigated</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                    className="w-full px-3 py-2 text-sm bg-bg-primary/50 border border-border-custom hover:border-accent/40 focus:border-accent focus:outline-none rounded-xl text-slate-100 font-mono transition-colors cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    <option value="Authentication">Authentication</option>
                    <option value="Initial Access">Initial Access</option>
                    <option value="Execution">Execution</option>
                    <option value="Persistence">Persistence</option>
                    <option value="Privilege Escalation">Privilege Escalation</option>
                    <option value="Defense Evasion">Defense Evasion</option>
                    <option value="Credential Access">Credential Access</option>
                    <option value="Discovery">Discovery</option>
                    <option value="Lateral Movement">Lateral Movement</option>
                    <option value="Collection">Collection</option>
                    <option value="Exfiltration">Exfiltration</option>
                    <option value="Command and Control">Command and Control</option>
                  </select>
                </div>
              </div>

              {/* Incidents Table list */}
              {error ? (
                <div className="p-6 rounded-2xl bg-danger/10 border border-danger/35 text-danger text-center font-mono text-sm shadow-md">
                  ⚠ Error loading incidents: {error}
                </div>
              ) : !isLoading && incidents.length === 0 ? (
                <EmptyState
                  title="No incidents match filter"
                  description="Try typing a different term in the search bar or changing your dropdown filters."
                />
              ) : (
                <div className="p-6 rounded-2xl bg-[#12182A] border border-border-custom/80 shadow-lg space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Incident ID</TableHead>
                        <TableHead>Incident Title</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Source Node</TableHead>
                        <TableHead>Triggered Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action Playbook</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array.from({ length: limit }).map((_, idx) => (
                          <TableRowSkeleton key={idx} />
                        ))
                      ) : (
                        incidents.map((inc) => (
                          <TableRow
                            key={inc.id}
                            onClick={() => selectIncident(inc)}
                            className="cursor-pointer transition-colors duration-150 hover:bg-[#1E293B]/30"
                          >
                            <TableCell className="font-mono text-accent font-semibold">{inc.id.slice(0, 8)}</TableCell>
                            <TableCell className="font-semibold text-white">{inc.title}</TableCell>
                            <TableCell>
                              <Badge variant={mapSeverityToBadgeVariant(inc.severity)} type="severity">
                                {inc.severity}
                              </Badge>
                            </TableCell>
                            <TableCell>{inc.category}</TableCell>
                            <TableCell className="font-mono text-slate-400">{inc.source}</TableCell>
                            <TableCell className="font-mono text-slate-450 text-xs">{inc.timestamp}</TableCell>
                            <TableCell>
                              <Badge variant={mapStatusToBadgeVariant(inc.status)} type="status">
                                {inc.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                              {inc.status !== 'Resolved' && inc.status !== 'Mitigated' && inc.status !== 'resolved' && inc.status !== 'mitigated' ? (
                                <Button variant="primary" size="sm" onClick={() => mitigateIncident(inc.id)} className="font-mono text-xs px-3.5 py-1.5 rounded-lg">
                                  Mitigate
                                </Button>
                              ) : (
                                <Badge variant="success" size="sm">Mitigated</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>

                  {/* Pagination Controls */}
                  {!isLoading && totalIncidents > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border-custom/60">
                      <div className="flex items-center space-x-3 text-xs text-slate-450 font-mono">
                        <span>Show</span>
                        <select
                          value={limit}
                          onChange={(e) => { setLimit(parseInt(e.target.value)); setPage(1); }}
                          className="px-2 py-1 bg-bg-primary/50 border border-border-custom rounded-lg text-slate-200 outline-none cursor-pointer"
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                        </select>
                        <span>entries (Total: {totalIncidents})</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={page === 1}
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          className="font-mono text-xs px-3 py-1.5 rounded-lg"
                        >
                          Previous
                        </Button>
                        <span className="text-xs text-slate-400 font-mono px-3">
                          Page {page} of {totalPages}
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={page === totalPages}
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                          className="font-mono text-xs px-3 py-1.5 rounded-lg"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
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
                          <span className="text-white">CyberFusion AI API</span>
                        </div>
                        <div className="flex justify-between border-b border-border-custom/40 pb-2">
                          <span>Version</span>
                          <span className="text-accent">1.0.0</span>
                        </div>
                        <div className="flex justify-between pb-2">
                          <span>API Endpoint</span>
                          <span className="text-white">/dashboard/system-health</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-450 mt-4 leading-relaxed">
                        FastAPI backend server is unreachable. Ensure the FastAPI container is running inside docker-compose.
                      </p>
                    )}
                  </div>
                  
                  <Button variant="secondary" size="sm" onClick={fetchSystemHealth}>
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
                      <Badge variant={systemHealth?.db_connected ? 'success' : 'critical'}>
                        {systemHealth?.db_connected ? 'Connected' : 'Offline'}
                      </Badge>
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
        title={selectedIncident ? `Inspect Incident: ${selectedIncident.id.slice(0, 8)}` : ''}
      >
        {selectedIncident && (
          <div className="space-y-6 overflow-y-auto max-h-[85vh] pr-1">
            {/* Header info */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h4 className="text-xl font-bold text-white m-0">{selectedIncident.title}</h4>
                <div className="flex space-x-2">
                  <Badge variant={mapSeverityToBadgeVariant(selectedIncident.severity)} type="severity">
                    {selectedIncident.severity}
                  </Badge>
                  <Badge variant={mapStatusToBadgeVariant(selectedIncident.status)} type="status">
                    {selectedIncident.status}
                  </Badge>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Triggered Time: {selectedIncident.timestamp}
              </span>
            </div>

            {/* Editing / Viewing toggle */}
            <div className="flex justify-between items-center py-2 border-b border-border-custom/50">
              <span className="text-xs font-mono text-slate-400">Incident Details</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="font-mono text-xs px-2.5 py-1 rounded-lg"
              >
                {isEditing ? 'Cancel Edit' : 'Edit Fields'}
              </Button>
            </div>

            {isEditing ? (
              /* EDIT FORM PANEL */
              <div className="space-y-4">
                {/* Status */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400 block">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-bg-primary border border-border-custom hover:border-accent/40 focus:border-accent focus:outline-none rounded-xl text-slate-100 font-mono transition-colors"
                  >
                    <option value="New">New</option>
                    <option value="Investigating">Investigating</option>
                    <option value="Mitigated">Mitigated</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                {/* Severity */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400 block">Severity</label>
                  <select
                    value={editForm.severity}
                    onChange={(e) => setEditForm({ ...editForm, severity: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-bg-primary border border-border-custom hover:border-accent/40 focus:border-accent focus:outline-none rounded-xl text-slate-100 font-mono transition-colors"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                {/* Assigned Analyst */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400 block">Assigned Analyst</label>
                  <select
                    value={editForm.assigned_user_id}
                    onChange={(e) => setEditForm({ ...editForm, assigned_user_id: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-bg-primary border border-border-custom hover:border-accent/40 focus:border-accent focus:outline-none rounded-xl text-slate-100 font-mono transition-colors"
                  >
                    <option value="">Unassigned</option>
                    {analysts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.username} ({a.role})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Remediation */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-400 block">Remediation Action Plan</label>
                  <textarea
                    rows={4}
                    value={editForm.remediation}
                    onChange={(e) => setEditForm({ ...editForm, remediation: e.target.value })}
                    placeholder="Provide incident resolution/mitigation steps..."
                    className="w-full px-3 py-2 text-sm bg-bg-primary border border-border-custom hover:border-accent/40 focus:border-accent focus:outline-none rounded-xl text-slate-100 font-mono transition-colors placeholder-slate-600 resize-y"
                  />
                </div>

                {/* Save Edit Button */}
                <Button variant="primary" className="w-full" onClick={handleSaveEdit}>
                  Save Changes
                </Button>
              </div>
            ) : (
              /* VIEW MODE DETAILS PANEL */
              <div className="space-y-6">
                {/* Specifications Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-bg-primary border border-border-custom/50">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">Source IP</span>
                    <span className="text-sm font-mono text-slate-200">{selectedIncident.source_ip || 'N/A'}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-bg-primary border border-border-custom/50">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">Destination IP</span>
                    <span className="text-sm font-mono text-slate-200">{selectedIncident.destination_ip || 'N/A'}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-bg-primary border border-border-custom/50">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">Alert Category</span>
                    <span className="text-sm text-slate-200">{selectedIncident.category}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-bg-primary border border-border-custom/50">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">Assigned Analyst</span>
                    <span className="text-sm text-slate-200 font-mono">
                      {selectedIncident.assigned_user ? selectedIncident.assigned_user.username : 'Unassigned'}
                    </span>
                  </div>
                </div>

                {/* MITRE Technique */}
                <div className="space-y-1">
                  <h5 className="text-xs uppercase font-mono text-slate-400 m-0">MITRE ATT&CK Technique</h5>
                  <div className="p-3 rounded-xl bg-bg-primary/50 border border-border-custom/50 text-xs font-mono text-slate-200">
                    {selectedIncident.mitre_technique || 'None mapped'}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <h5 className="text-xs uppercase font-mono text-slate-400 m-0">Anomalous Telemetry Description</h5>
                  <div className="p-4 rounded-xl bg-bg-primary/50 border border-border-custom/50 text-sm text-slate-300 leading-relaxed">
                    {selectedIncident.description}
                  </div>
                </div>

                {/* Remediation */}
                <div className="space-y-1">
                  <h5 className="text-xs uppercase font-mono text-slate-400 m-0">Mitigation Playbook Play</h5>
                  <div className="p-4 rounded-xl border border-success-custom/20 bg-success-custom/5 text-sm text-slate-300 leading-relaxed font-mono">
                    {selectedIncident.remediation || 'Remediation pipeline checks required.'}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center space-x-3 pt-4 border-t border-border-custom">
              {selectedIncident.status !== 'Resolved' && selectedIncident.status !== 'Mitigated' && selectedIncident.status !== 'resolved' && selectedIncident.status !== 'mitigated' && (
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => mitigateIncident(selectedIncident.id)}
                >
                  Mitigate Incident
                </Button>
              )}
              <Button
                variant="danger"
                onClick={() => setIsConfirmDeleteOpen(true)}
                className="px-4 py-2 text-xs font-mono rounded-lg"
              >
                Delete
              </Button>
              <Button
                variant="secondary"
                onClick={() => setDetailDrawerOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Create Incident Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Register New Incident Record"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {createError && (
            <div className="p-3 text-xs font-mono bg-danger/10 border border-danger/30 text-danger rounded-lg">
              ⚠ {createError}
            </div>
          )}

          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400 block">Title *</label>
            <input
              type="text"
              required
              value={createForm.title}
              onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
              placeholder="e.g. Host Privilege Escalation Detected"
              className="w-full px-3 py-2 text-sm bg-bg-primary border border-border-custom hover:border-accent/40 focus:border-accent focus:outline-none rounded-xl text-slate-100 font-mono transition-colors"
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400 block">Category *</label>
            <select
              value={createForm.category}
              onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-bg-primary border border-border-custom hover:border-accent/40 focus:border-accent focus:outline-none rounded-xl text-slate-100 font-mono transition-colors cursor-pointer"
            >
              <option value="Authentication">Authentication</option>
              <option value="Initial Access">Initial Access</option>
              <option value="Execution">Execution</option>
              <option value="Persistence">Persistence</option>
              <option value="Privilege Escalation">Privilege Escalation</option>
              <option value="Defense Evasion">Defense Evasion</option>
              <option value="Credential Access">Credential Access</option>
              <option value="Discovery">Discovery</option>
              <option value="Lateral Movement">Lateral Movement</option>
              <option value="Collection">Collection</option>
              <option value="Exfiltration">Exfiltration</option>
              <option value="Command and Control">Command and Control</option>
            </select>
          </div>

          {/* Severity & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 block">Severity</label>
              <select
                value={createForm.severity}
                onChange={(e) => setCreateForm({ ...createForm, severity: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-bg-primary border border-border-custom hover:border-accent/40 focus:border-accent focus:outline-none rounded-xl text-slate-100 font-mono transition-colors cursor-pointer"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 block">Status</label>
              <select
                value={createForm.status}
                onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-bg-primary border border-border-custom hover:border-accent/40 focus:border-accent focus:outline-none rounded-xl text-slate-100 font-mono transition-colors cursor-pointer"
              >
                <option value="New">New</option>
                <option value="Investigating">Investigating</option>
                <option value="Mitigated">Mitigated</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Source IP & Destination IP */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 block">Source IP</label>
              <input
                type="text"
                value={createForm.source_ip}
                onChange={(e) => setCreateForm({ ...createForm, source_ip: e.target.value })}
                placeholder="e.g. 10.0.1.15"
                className="w-full px-3 py-2 text-sm bg-bg-primary border border-border-custom hover:border-accent/40 focus:border-accent focus:outline-none rounded-xl text-slate-100 font-mono transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 block">Destination IP</label>
              <input
                type="text"
                value={createForm.destination_ip}
                onChange={(e) => setCreateForm({ ...createForm, destination_ip: e.target.value })}
                placeholder="e.g. 192.168.1.100"
                className="w-full px-3 py-2 text-sm bg-bg-primary border border-border-custom hover:border-accent/40 focus:border-accent focus:outline-none rounded-xl text-slate-100 font-mono transition-colors"
              />
            </div>
          </div>

          {/* MITRE Technique & Analyst Assignment */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 block">MITRE Technique</label>
              <input
                type="text"
                value={createForm.mitre_technique}
                onChange={(e) => setCreateForm({ ...createForm, mitre_technique: e.target.value })}
                placeholder="e.g. T1078 (Valid Accounts)"
                className="w-full px-3 py-2 text-sm bg-bg-primary border border-border-custom hover:border-accent/40 focus:border-accent focus:outline-none rounded-xl text-slate-100 font-mono transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-400 block">Assigned Analyst</label>
              <select
                value={createForm.assigned_user_id}
                onChange={(e) => setCreateForm({ ...createForm, assigned_user_id: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-bg-primary border border-border-custom hover:border-accent/40 focus:border-accent focus:outline-none rounded-xl text-slate-100 font-mono transition-colors cursor-pointer"
              >
                <option value="">Unassigned</option>
                {analysts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.username} ({a.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400 block">Description</label>
            <textarea
              rows={3}
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              placeholder="Provide telemetry triggers or security alert logs..."
              className="w-full px-3 py-2 text-sm bg-bg-primary border border-border-custom hover:border-accent/40 focus:border-accent focus:outline-none rounded-xl text-slate-100 font-mono transition-colors placeholder-slate-600 resize-none"
            />
          </div>

          {/* Remediation */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400 block">Remediation Actions</label>
            <textarea
              rows={3}
              value={createForm.remediation}
              onChange={(e) => setCreateForm({ ...createForm, remediation: e.target.value })}
              placeholder="Remediation steps or response containment instructions..."
              className="w-full px-3 py-2 text-sm bg-bg-primary border border-border-custom hover:border-accent/40 focus:border-accent focus:outline-none rounded-xl text-slate-100 font-mono transition-colors placeholder-slate-600 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Register Incident
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        title="Confirm permanent deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            Are you sure you want to permanently delete this incident record? This action is irreversible and will remove all audit data.
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setIsConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Success Notification Banner */}
      {successNotification && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-xl bg-success-custom/10 border border-success-custom/30 text-success-custom font-mono text-sm shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          ✓ {successNotification}
        </div>
      )}
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
