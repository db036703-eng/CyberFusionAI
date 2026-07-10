import { useEffect, useState } from 'react'
import {
  Shield,
  Activity,
  AlertTriangle,
  Server,
  Layers,
  Terminal,
  ShieldCheck,
  FlameKindling
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts'
import { Sidebar } from './components/layout/Sidebar'
import { Navbar } from './components/layout/Navbar'
import { NotificationPanel } from './components/layout/NotificationPanel'
import { MetricCard } from './components/ui/MetricCard'
import { Card } from './components/ui/Card'
import { Button } from './components/ui/Button'
import { Badge } from './components/ui/Badge'
import { Drawer } from './components/ui/Drawer'
import { Timeline, TimelineItem } from './components/ui/Timeline'
import { EmptyState } from './components/ui/EmptyState'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/Table'
import { useUIStore } from './store/uiStore'

interface HealthResponse {
  status: string
  service: string
  version: string
}

// Chart data representing security incidents over a week
const chartData = [
  { name: '00:00', threats: 12, anomalies: 34 },
  { name: '04:00', threats: 24, anomalies: 45 },
  { name: '08:00', threats: 18, anomalies: 50 },
  { name: '12:00', threats: 35, anomalies: 62 },
  { name: '16:00', threats: 28, anomalies: 41 },
  { name: '20:00', threats: 40, anomalies: 58 },
  { name: '24:00', threats: 31, anomalies: 47 }
]

function App() {
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
  const mitigatedCount = incidents.filter(i => i.status === 'mitigated' || i.status === 'resolved').length

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
        <main className="flex-1 overflow-y-auto p-8 space-y-8 max-w-7xl w-full mx-auto">
          
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Header and system alert banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-white m-0">Security Operations Command</h2>
                  <p className="text-slate-400 text-sm mt-1">Real-time indicators, active anomaly telemetry, and threat vector tracking.</p>
                </div>
                
                {criticalCount > 0 && (
                  <div className="flex items-center space-x-2 px-4 py-2 bg-critical-custom/10 border border-critical-custom/20 rounded-xl text-critical-custom text-xs font-mono animate-pulse">
                    <FlameKindling className="h-4 w-4" />
                    <span>{criticalCount} CRITICAL THREATS ACTIVE</span>
                  </div>
                )}
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Threat Index level"
                  value={criticalCount > 0 ? "74 / 100" : "12 / 100"}
                  icon={<AlertTriangle className="h-4 w-4" />}
                  change={{ value: criticalCount > 0 ? 15 : 4, type: criticalCount > 0 ? 'increase' : 'decrease' }}
                />
                <MetricCard
                  title="Active Incidents"
                  value={activeCount}
                  icon={<Shield className="h-4 w-4" />}
                />
                <MetricCard
                  title="Endpoints Monitored"
                  value="1,428 Nodes"
                  icon={<Server className="h-4 w-4" />}
                  change={{ value: 2.4, type: 'increase' }}
                />
                <MetricCard
                  title="Resolved Telemetry"
                  value={mitigatedCount}
                  icon={<ShieldCheck className="h-4 w-4" />}
                />
              </div>

              {/* Graphical distribution and timeline trail */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Chart */}
                <Card className="lg:col-span-2 flex flex-col justify-between min-h-[350px]">
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-white leading-none">Security Telemetry Rate</h3>
                    <p className="text-slate-500 text-xs mt-1">Simulated ingestion metrics of parsed anomalies against resolved threat patterns.</p>
                  </div>
                  <div className="h-64 w-full text-xs font-mono">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorAnomalies" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#232B45" opacity={0.4} />
                        <XAxis dataKey="name" stroke="#5F6D7E" />
                        <YAxis stroke="#5F6D7E" />
                        <Tooltip contentStyle={{ backgroundColor: '#141A2E', borderColor: '#232B45', borderRadius: '12px' }} />
                        <Area type="monotone" dataKey="threats" stroke="#00E5FF" strokeWidth={2} fillOpacity={1} fill="url(#colorThreats)" name="Active Threats" />
                        <Area type="monotone" dataKey="anomalies" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorAnomalies)" name="Telemetry Anomalies" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Audit trail / Timeline */}
                <Card className="flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-white leading-none">Audit & Activity Log</h3>
                    <p className="text-slate-500 text-xs mt-1">Platform actions and configuration changes.</p>
                  </div>
                  <div className="flex-1 overflow-y-auto max-h-[250px] pr-2">
                    <Timeline>
                      <TimelineItem
                        title="Database Monitor HealthCheck"
                        time="19:28:46"
                        description="Auto ping validation verified db configuration layers are responsive."
                        statusColor="success"
                      />
                      <TimelineItem
                        title="Alert MIT-309 Applied"
                        time="18:55:00"
                        description="AWS wildcards reverted to secure network mappings."
                        statusColor="info"
                      />
                      <TimelineItem
                        title="Threat Flagged on DB"
                        time="18:12:03"
                        description="High SSH attempts detected. Incident INC-2026-001 created."
                        statusColor="critical"
                      />
                    </Timeline>
                  </div>
                </Card>
              </div>

              {/* Highlighted Alerts preview panel */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white m-0">Recent Actionable Incidents</h3>
                  <Button variant="secondary" size="sm" onClick={() => useUIStore.getState().setActiveTab('incidents')}>
                    View All Incidents
                  </Button>
                </div>
                
                <Table>
                  <TableHeader>
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
                        className="cursor-pointer"
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

export default App
