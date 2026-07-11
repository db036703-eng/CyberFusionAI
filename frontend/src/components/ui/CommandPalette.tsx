import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  FileText,
  AlertTriangle,
  Layers,
  Globe,
  Monitor,
  LayoutDashboard,
  Play,
  Fingerprint,
  Users,
  History,
  Brain,
  Settings,
  User,
  ShieldCheck,
  Terminal
} from 'lucide-react'
import { useUIStore } from '../../store/uiStore'

interface SearchItem {
  category: 'Pages' | 'Incidents' | 'MITRE' | 'CVEs' | 'IOCs' | 'Hosts' | 'Reports'
  title: string
  subtitle: string
  action: {
    type: 'tab' | 'incident'
    target: string
  }
  icon: React.ReactNode
}

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [filter, setFilter] = useState<'all' | 'pages' | 'threats'>('all')
  const inputRef = useRef<HTMLInputElement>(null)
  
  const { setActiveTab, selectIncident } = useUIStore()

  // Define searchable catalog
  const catalog: SearchItem[] = [
    // Dashboard pages
    { category: 'Pages', title: 'Dashboard', subtitle: 'Overview SOC status and telemetry indicators', action: { type: 'tab', target: 'overview' }, icon: <LayoutDashboard className="h-4 w-4" /> },
    { category: 'Pages', title: 'Incidents Manager', subtitle: 'Audit, assign, and mitigate security threats', action: { type: 'tab', target: 'incidents' }, icon: <AlertTriangle className="h-4 w-4" /> },
    { category: 'Pages', title: 'Attack Simulator', subtitle: 'Execute red team simulations on servers', action: { type: 'tab', target: 'simulator' }, icon: <Play className="h-4 w-4" /> },
    { category: 'Pages', title: 'Threat Intelligence', subtitle: 'Lookup IP reputation and zero-day databases', action: { type: 'tab', target: 'intel' }, icon: <Globe className="h-4 w-4" /> },
    { category: 'Pages', title: 'IOC Manager', subtitle: 'Manage custom file hashes and blocklists', action: { type: 'tab', target: 'ioc' }, icon: <Fingerprint className="h-4 w-4" /> },
    { category: 'Pages', title: 'Threat Actors', subtitle: 'View profiles of APT-29, Lazarus and others', action: { type: 'tab', target: 'actors' }, icon: <Users className="h-4 w-4" /> },
    { category: 'Pages', title: 'MITRE ATT&CK Mapping', subtitle: 'Evaluate tactic coverages and alerts gaps', action: { type: 'tab', target: 'mitre' }, icon: <Layers className="h-4 w-4" /> },
    { category: 'Pages', title: 'Attack Timeline', subtitle: 'Trace chronological intrusion events chain', action: { type: 'tab', target: 'timeline' }, icon: <History className="h-4 w-4" /> },
    { category: 'Pages', title: 'Reports Archive', subtitle: 'Download audits and compliance assessments', action: { type: 'tab', target: 'reports' }, icon: <FileText className="h-4 w-4" /> },
    { category: 'Pages', title: 'AI Analyst Chat', subtitle: 'Query log systems using cognitive Gemini', action: { type: 'tab', target: 'ai_analyst' }, icon: <Brain className="h-4 w-4" /> },
    { category: 'Pages', title: 'System Settings', subtitle: 'Adjust alert thresholds and ingestion levels', action: { type: 'tab', target: 'settings' }, icon: <Settings className="h-4 w-4" /> },
    { category: 'Pages', title: 'Profile Settings', subtitle: 'Manage active operator tokens and audits', action: { type: 'tab', target: 'profile' }, icon: <User className="h-4 w-4" /> },
    { category: 'Pages', title: 'Admin Panel', subtitle: 'Verify compose containers and postgres health', action: { type: 'tab', target: 'admin' }, icon: <ShieldCheck className="h-4 w-4" /> },
    
    // Mock Incidents (matching the store IDs where possible)
    { category: 'Incidents', title: 'Adversary Bruteforce on DB Node', subtitle: 'INC-2026-001 • Critical Active', action: { type: 'incident', target: 'INC-2026-001' }, icon: <AlertTriangle className="h-4 w-4 text-critical-custom" /> },
    { category: 'Incidents', title: 'Anomalous Data Exfiltration DNS Queries', subtitle: 'INC-2026-002 • Warning Investigating', action: { type: 'incident', target: 'INC-2026-002' }, icon: <AlertTriangle className="h-4 w-4 text-warning-custom" /> },
    { category: 'Incidents', title: 'Phishing Campaign Link Executed', subtitle: 'INC-2026-003 • Critical Active', action: { type: 'incident', target: 'INC-2026-003' }, icon: <AlertTriangle className="h-4 w-4 text-critical-custom" /> },
    { category: 'Incidents', title: 'AWS Security Group Wildcard Ingress', subtitle: 'INC-2026-004 • Info Mitigated', action: { type: 'incident', target: 'INC-2026-004' }, icon: <AlertTriangle className="h-4 w-4 text-success-custom" /> },
    { category: 'Incidents', title: 'Kubernetes Container Root Drift Detected', subtitle: 'INC-2026-005 • Warning Resolved', action: { type: 'incident', target: 'INC-2026-005' }, icon: <AlertTriangle className="h-4 w-4 text-success-custom" /> },

    // CVEs & IOCs
    { category: 'CVEs', title: 'CVE-2026-3011 RCE in Directory services', subtitle: 'CVSS 9.8 Severity Rating', action: { type: 'tab', target: 'intel' }, icon: <Fingerprint className="h-4 w-4 text-warning-custom" /> },
    { category: 'CVEs', title: 'CVE-2025-9981 Buffer Overflow in SSL', subtitle: 'CVSS 8.4 Severity Rating', action: { type: 'tab', target: 'intel' }, icon: <Fingerprint className="h-4 w-4 text-warning-custom" /> },
    { category: 'IOCs', title: 'IP: 198.51.100.12', subtitle: 'Active host identified with SSH bruteforce brute actions', action: { type: 'tab', target: 'ioc' }, icon: <Globe className="h-4 w-4 text-critical-custom" /> },
    { category: 'IOCs', title: 'Domain: dga-exfil.xyz', subtitle: 'Known malware DNS tunnel exfiltration domain', action: { type: 'tab', target: 'ioc' }, icon: <Globe className="h-4 w-4 text-critical-custom" /> },

    // Hosts
    { category: 'Hosts', title: 'Workstation-HR-04', subtitle: 'Host connected. VPN segment New York', action: { type: 'tab', target: 'profile' }, icon: <Monitor className="h-4 w-4" /> },
    { category: 'Hosts', title: 'Cloud-Prod-01', subtitle: 'AWS production database server group Node', action: { type: 'tab', target: 'admin' }, icon: <Monitor className="h-4 w-4" /> },
    { category: 'Hosts', title: 'K8s-Cluster-Node-02', subtitle: 'Kubernetes app deployment server pod group', action: { type: 'tab', target: 'admin' }, icon: <Monitor className="h-4 w-4" /> },
    { category: 'Hosts', title: '10.0.4.82 (DB-Node)', subtitle: 'Primary postgres cluster core server', action: { type: 'tab', target: 'admin' }, icon: <Monitor className="h-4 w-4" /> }
  ]

  // Event listener for Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Auto focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80)
      setQuery('')
      setActiveIndex(0)
    }
  }, [open])

  // Filtering based on tab selector
  const filteredCatalog = catalog.filter((item) => {
    const matchesQuery =
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())

    if (filter === 'pages') {
      return matchesQuery && item.category === 'Pages'
    }
    if (filter === 'threats') {
      return matchesQuery && (item.category === 'Incidents' || item.category === 'CVEs' || item.category === 'IOCs')
    }
    return matchesQuery
  })

  // Keyboard navigation inside list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => (prev + 1) % filteredCatalog.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => (prev - 1 + filteredCatalog.length) % filteredCatalog.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredCatalog[activeIndex]) {
        handleSelectItem(filteredCatalog[activeIndex])
      }
    }
  }

  const handleSelectItem = (item: SearchItem) => {
    setOpen(false)
    if (item.action.type === 'tab') {
      setActiveTab(item.action.target)
    } else if (item.action.type === 'incident') {
      // Find the actual incident in store and select it to trigger modal/drawer open
      const storeIncidents = useUIStore.getState().incidents
      const matched = storeIncidents.find((i) => i.id === item.action.target)
      if (matched) {
        selectIncident(matched)
      } else {
        // Fallback to overview tab
        setActiveTab('overview')
      }
    }
  }

  return (
    <>
      {/* Visual top indicator badge */}
      <button 
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-border-custom bg-bg-secondary hover:border-slate-650 transition cursor-pointer text-xs text-slate-400 select-none font-mono"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search SOC</span>
        <span className="bg-bg-primary border border-border-custom px-1.5 py-0.5 rounded text-[10px] text-slate-500 font-extrabold uppercase">
          Ctrl K
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#070b16]/75 backdrop-blur-sm cursor-pointer"
              onClick={() => setOpen(false)}
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-xl mx-4 bg-bg-secondary border border-border-custom shadow-2xl rounded-2xl flex flex-col overflow-hidden max-h-[500px]"
              onKeyDown={handleKeyDown}
            >
              {/* Search Field Header */}
              <div className="flex items-center px-4 py-3.5 border-b border-border-custom bg-bg-primary/30 shrink-0">
                <Search className="h-5 w-5 text-accent shrink-0 mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Query pages, active incidents, target CVEs, hosts..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setActiveIndex(0)
                  }}
                  className="flex-1 bg-transparent border-0 outline-none text-sm text-slate-100 placeholder-slate-500"
                />
                <button
                  onClick={() => setOpen(false)}
                  className="text-[10px] font-mono border border-border-custom px-2 py-1 bg-bg-primary hover:text-white rounded-lg text-slate-500 cursor-pointer"
                >
                  ESC
                </button>
              </div>

              {/* Categorized Filter Tabs */}
              <div className="px-4 py-2 border-b border-border-custom/50 bg-bg-primary/10 flex items-center space-x-2 shrink-0">
                {['all', 'pages', 'threats'].map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setFilter(f as any)
                      setActiveIndex(0)
                    }}
                    className={`px-3 py-1 text-[10px] font-mono font-medium rounded-lg capitalize cursor-pointer transition ${
                      filter === f
                        ? 'bg-accent/15 text-accent border border-accent/20'
                        : 'text-slate-500 hover:text-slate-350 border border-transparent'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Results List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar min-h-[180px]">
                {filteredCatalog.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-center font-mono text-xs">
                    <Terminal className="h-5 w-5 mb-2 text-slate-600" />
                    <span>No search matches found for: "{query}"</span>
                  </div>
                ) : (
                  filteredCatalog.map((item, idx) => {
                    const isSelected = activeIndex === idx
                    return (
                      <div
                        key={idx}
                        onClick={() => handleSelectItem(item)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={`flex items-center justify-between px-3.5 py-3 rounded-xl border cursor-pointer transition ${
                          isSelected
                            ? 'bg-accent/10 border-accent/20 shadow-md shadow-accent/5'
                            : 'bg-transparent border-transparent hover:bg-bg-primary/20 hover:border-border-custom/35'
                        }`}
                      >
                        <div className="flex items-center space-x-3.5 min-w-0">
                          <div className={`p-2 rounded-lg bg-bg-primary border border-border-custom shrink-0 transition-transform ${
                            isSelected ? 'scale-110 text-accent border-accent/30' : 'text-slate-450'
                          }`}>
                            {item.icon}
                          </div>
                          <div className="min-w-0">
                            <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                              {item.title}
                            </h4>
                            <p className="text-[10px] text-slate-500 truncate mt-0.5 font-mono">{item.subtitle}</p>
                          </div>
                        </div>

                        <span className="text-[9px] font-mono uppercase bg-bg-primary border border-border-custom text-slate-450 px-2 py-0.5 rounded shrink-0 pl-1.5 pr-1.5">
                          {item.category}
                        </span>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Footer Guide Info */}
              <div className="p-3 bg-bg-primary/45 border-t border-border-custom text-[10px] font-mono text-slate-550 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-3">
                  <span>↑↓ Navigate</span>
                  <span>↵ Open Item</span>
                </div>
                <span>Ctrl+K to close</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
